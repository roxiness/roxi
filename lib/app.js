/// <reference path="../typedef.js" />

const chalk = require('chalk')
/** @ts-ignore */
const esmRequire = require("esm")(module, {}/*, options*/)
const { deepAssign, log } = require('./utils')


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

class App {
  constructor() {
    this.events = events
    this.state = {}
    this.log = log
    this.config = {}
  }

  merge(obj) { deepAssign(this, obj) }
  async initiate() {
    this.config.roxi = await require('./roxi').run()
    process.env.ROXI_LOG_LEVEL = this.config.roxi.logLevel
  }
  async run(events = this.events) {
    for (const event of events) {
      log.debug(`[events] ${event}`)
      await runPlugins(event, this)
    }
  }
}


/**
 * @param {AppEvent} event
 * @param {RoxiApp} app
 */
async function runPlugins(event, app) {
  const plugins = [...app.config.roxi.plugins]
  for (const plugin of plugins) {
    const hooks = plugin.hooks.filter(hookCondition(app, plugin.params, { event }))
    for (const hook of hooks) {
      log.debug(`[events]   ${plugin.name} ${chalk.gray(JSON.stringify(plugin.params))}`)

      //todo
      const ctx = {}

      /** @type {RoxiApp|false} */
      await hook.action(app, plugin.params, ctx)
    }
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
