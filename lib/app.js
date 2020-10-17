/// <reference path="../typedef.js" />

const { deepAssign, log, keysAsFunctionsRecursive } = require('./utils')


/** @type {AppEvent[]} */
const events = [
  'init',
  'start',
  'before:config',
  'config',
  'after:config',
  'before:bundle',
  'bundle',
  'after:bundle',
  'end',
]

const App = class {
  constructor() {
    this.events = events
    this.state = {}
    this.log = log
    this.config = {}
  }
  /** @type {ErrorHandler} */
  errorHandler = err => { throw err }

  /** @type {HookHandler} */
  hookHandler = async (app, hook, plugin, ctx) => {
    await hook.action(app, plugin.params, ctx)
  }

  merge(obj) { deepAssign(this, obj) }
  async initiate() {
    this.config.roxi = await require('./roxi').run()
    process.env.ROXI_LOG_LEVEL = this.config.roxi.logLevel
  }
  async run(events = this.events) {
    try {
      for (const event of events) {
        console.log('event', event)
        this.state.event = event
        await runPlugins(event, this)
      }
    } catch (err) { this.errorHandler(err) }
  }
}

//todo move this somewhere else?
const objToArray = {
  hooks: [{ event: 'bundle', action: app => keysAsFunctionsRecursive(app) }]
}

/**
 * @param {AppEvent} event
 * @param {RoxiApp} app
 */
async function runPlugins(event, app) {
  const plugins = [objToArray, ...app.config.roxi.plugins]
  for (const plugin of plugins) {
    const hooks = plugin.hooks.filter(hookCondition(app, plugin.params, { event }))
    for (const hook of hooks)
      await app.hookHandler(app, hook, plugin, { event })
  }
}

/**
* @param {RoxiApp} app
* @param {Object} params
* @param {{event: AppEvent}} ctx
* @returns {function(RoxiPluginHook):boolean}
*/
function hookCondition(app, params, ctx) {
  const env = app.state.production ? 'production' : 'development'
  return ({ condition, event }) =>
    (
      event === '*'
      || [].concat(event).includes(ctx.event)
    )
    && (
      !condition
      || condition === env
      || (
        typeof condition === 'function'
        && condition(app, params, ctx)
      )
    )
}

module.exports = { App }
