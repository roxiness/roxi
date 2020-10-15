/// <reference path="../../../typedef.js" />

const { outputJSONSync,
  outputFileSync,
  removeSync,
  readJSONSync,
  readdirSync,
  moveSync,
  existsSync,
  readFileSync
} = require('fs-extra')

const chalk = require('chalk')
const subtle = '#cc7eff'
const background = '#6B4C7F'
const text = '#eacbff'
const chalker = str => chalk.bgHex(background)(chalk.hex(text)(str))

const { create } = require('jsondiffpatch')
const LOGSFOLDER = '_roxi/.roxi/logs/'
const EVENTSFOLDER = '_roxi/.roxi/logs/events/'
const PREVFOLDER = '_roxi/.roxi/logs/events/previous/'
const TEMPPREVFOLDER = '_roxi/.roxi/logs/__temp__previous/'
let lastEvent = ''
let eventCount = 0
let lastSnapshot = "null"
const jsondiffpatch = create()



/** @type {RoxiPlugin} */
module.exports.default = {
  hooks: [
    {
      name: 'attach error handler',
      event: 'init',
      action: (app, params, { event }) => {
        // move logs to temp-prev-folder, then move temp-prev-folder to prev-folder
        if (existsSync(EVENTSFOLDER)) {
          moveSync(`${EVENTSFOLDER}`, `${TEMPPREVFOLDER}`)
          moveSync(`${TEMPPREVFOLDER}`, `${PREVFOLDER}`)
          removeSync(`${PREVFOLDER}previous`)
        }

        app.errorHandler = wrapErrorHandler(app)
        app.hookHandler = wrapHookHandler(app)
      }
    },
    {
      name: 'track and write event',
      event: '*',
      action: (app, params, { event }) => {
        app.log.debug(chalker(`[events] ${event}`))

        const name = `${eventCount}.${event.replace(':', '-')}`
        const snapshot = JSON.stringify(app, null, 2)
        outputFileSync(`${EVENTSFOLDER + name}.json`, snapshot)
        const delta = jsondiffpatch.diff(JSON.parse(snapshot), JSON.parse(lastSnapshot))
        if (delta) {
          outputJSONSync(`${EVENTSFOLDER + name}.delta.json`, delta, { spaces: 2 })
          createHtml(`${EVENTSFOLDER}html/${name}.delta.html`, lastSnapshot, snapshot)
        }
        lastEvent = event
        eventCount++
        lastSnapshot = snapshot
      }
    },
    {
      name: 'write dump',
      event: 'end',
      action: app => {
        const total = getTotal()
        const oldTotal = getOldTotal()
        const delta = jsondiffpatch.diff(total, oldTotal)
        outputJSONSync(`${EVENTSFOLDER}total.json`, total, { spaces: 2 })
        outputJSONSync(`${EVENTSFOLDER}total.delta.json`, delta, { spaces: 2 })
        createHtml(`${EVENTSFOLDER}html/total.delta.html`, JSON.stringify(oldTotal), JSON.stringify(total))
      }
    },
  ]
}


function getTotal() {
  const total = { time: (new Date).toISOString() }
  const filenames = readdirSync(EVENTSFOLDER)
    .filter(file => file.match(/json/))
    .filter(file => !file.match(/delta/))
  filenames.forEach(name => total[name] = readJSONSync(EVENTSFOLDER + name))
  return total
}

function getOldTotal() {
  if (existsSync(`${PREVFOLDER}total.json`)) {
    return readJSONSync(`${PREVFOLDER}total.json`)
  }
  return {}
}

/**
 * Save Html diff file to disk
 * @param {string} path
 * @param {object} left
 * @param {object} right
 */
function createHtml(path, left, right) {
  left = typeof left === 'string' ? left : JSON.stringify(left)
  right = typeof right === 'string' ? right : JSON.stringify(right)
  const template = readFileSync(__dirname + '/template.html', 'utf-8')
    .replace('__LEFT__', left)
    .replace('__RIGHT__', right)
  outputFileSync(path, template)
}


/**
 * Save a dump of the current app and a comparison between the current
 * app and a snapshot of the previously executed app at the same event
 * @param {RoxiApp} app
 */
function writeDumpAndDelta(app) {
  const { event } = app.state
  outputJSONSync(`${LOGSFOLDER}app.dump.json`, app, { spaces: 2 })
  const prevAppState = getEventStateFromPrevExec(app)
  createHtml(`${LOGSFOLDER}app.diff.html`, { [event]: prevAppState }, { [event]: app })
}

/**
 * returns the respective event state from the previous execution of the app
 * @param {RoxiApp} app
 */
function getEventStateFromPrevExec(app) {
  const { event } = app.state

  const file = readdirSync(PREVFOLDER, 'utf-8')
    .find(name => name
      .replace('-', ':')
      .replace(/\d+\./, '')
      .replace('.json', '')
      === event
    )

  if (file) return readJSONSync(PREVFOLDER + file)
  return {}
}


function logEventHook(app, hook, plugin) {
  if(hook.event !== '*'){
    const name = hook.name ? `- ${hook.name}` : ''
    const params = chalk.hex(subtle)(JSON.stringify(plugin.params))
    app.log.debug(chalker(`[events]   ${plugin.name} ${name} ${params}`))
  }
}

function wrapHookHandler(app) {
  const hookHandler = app.hookHandler
  return async (app, hook, plugin, ctx) => {
    logEventHook(app, hook, plugin)
    await hookHandler(app, hook, plugin, ctx)
  }
}

function wrapErrorHandler(app) {
  const errorHandler = app.errorHandler
  return err => {
    writeDumpAndDelta(app)
    app.log.error(`Error encountered.`)
    app.log.error(`App dump: ${LOGSFOLDER}app.dump.json`)
    app.log.error(`App comparison to previous run: ${LOGSFOLDER}app.diff.html`)
    errorHandler(err, app)
  }
}
