/**
 * @typedef {Object} NamedObject
 * @prop {String} name
 * @prop {Object.<string, *>} params
 *
 * @typedef {'start'|'before:config'|'config'
 * |'after:config'|'before:bundle'|'bundle'
 * |'after:bundle'|'router'|'end'} AppEvent
 *
 * @typedef {Object} RoxiPlugin
 * @prop {string} name
 * @prop {RoxiPluginHook[]} hooks
 * @prop {Object.<string, *>} params
 * @prop {Object.<string, Function>} dependencies
 *
 * @typedef {Object} RoxiPluginHook
 * @prop {String|Function} condition
 * @prop {String} event
 * @prop {Function} action
 *
 * @typedef {Function} RoxiPluginHookFunction
 * @param {RoxiApp} app
 * @param {Object.<string, *>} params
 * @param {Object.<string, *>} context
 * @prop {String} event
 *
 *
 * @typedef {createApp['app']} RoxiApp
 */


/** @ts-ignore */
const esmRequire = require("esm")(module, {}/*, options*/)
const { normalizeYamlArray, deepAssign, log } = require('./utils')
const { readFileSync, existsSync } = require('fs-extra')
const roxiConfigPath = process.cwd() + '/_roxi/roxi.config.yaml'
const builtInPlugins = {
  rollup: './plugins/rollup',
  routify: './plugins/routify',
  vite: './plugins/vite',
  nollup: './plugins/nollup'
}

/** @type {AppEvent[]} */
const events = [
  'start',
  'before:config',
  'config',
  'after:config',
  'before:bundle',
  'bundle',
  'after:bundle',
  'end',
]

async function createApp() {
  const roxi = require('./configs/roxi.defaults.config')

  const _app = { config: { roxi }, state: {} }

  // create new this.app for better types
  let app = this.app = {
    ..._app,
    events,
    config: {
      roxi: { ...roxi, ...(await parseRoxiConfig()) },
      svelte: require('./configs/svelte.config')(_app),
      spassr: require('./configs/spassr.config')(_app),
      // nollup: require('./configs/nollup.config')(_app),
      serviceWorker: require('./configs/nollup.config')(_app),
    },
    log,
    merge: obj => deepAssign(app, obj),
    state: {},
    async run(events = this.events) {
      for (const event of events) {
        log.debug(`[events] ${event}`)
        app = await runPlugins(event, app)
        if (event === 'before:config') {
          app = await runUserMutations(app)
        }
      }
    }
  }

  process.env.ROXI_LOG_LEVEL = app.config.roxi.logLevel

  return app
}

async function runUserMutations(app) {
  const config = await esmRequire(process.cwd() + '/_roxi/app.config.js').default(app)
  return deepAssign(app, config)
}

/**
 * @param {AppEvent} event
 * @param {RoxiApp} app
 */
async function runPlugins(event, app) {
  const esmRequire = require('esm')(module)

  const plugins = [...app.config.roxi.plugins]

  for (const plugin of plugins) {
    const hooks = plugin.hooks.filter(hookCondition(app, plugin.params, { event }))
    for (const hook of hooks) {
      log.debug(`[events]   ${plugin.name}`)
      /** @type {RoxiApp|false} */
      await hook.action(app, plugin.params)
    }
  }
  return app
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

/**
 * Creates a config from Roxi defaults, user config and plugins
 * @returns {Promise<{bundler: string, plugins: RoxiPlugin[]}>}
 */
async function parseRoxiConfig() {
  const { parse } = require('yaml')

  if (!existsSync(roxiConfigPath))
    return { bundler: 'rollup', plugins: [] }

  /** @type {RoxiApp['config']['roxi']} */
  const config = parse(readFileSync(roxiConfigPath, 'utf-8'))
  let listedPlugins = normalizeYamlArray(config.plugins)
  listedPlugins = attachPluginComponents(listedPlugins)
  const plugins = await attachPluginDependencies(listedPlugins)
  return { ...config, plugins }
}

/**
 * @param {Partial<RoxiPlugin[]>} plugins
 */
function attachPluginComponents(plugins) {
  return plugins.map(plugin => {
    const path = builtInPlugins[plugin.name] || plugin.name

    /** @type {RoxiPlugin} */
    const component = esmRequire(path).default
    return { ...plugin, ...component }
  })
}

/**
 * add plugins that haven't been declared in roxi config.
 * these are all resolved within the respective plugins
 * @param {Partial<RoxiPlugin[]>} plugins
 */
async function attachPluginDependencies(plugins) {
  for (const plugin of plugins) {
    const names = plugins.map(plugin => plugin.name);
    for (const [dependency, resolve] of Object.entries(plugin.dependencies || {})) {
      if (!names.includes(dependency)) {
        let component
        try {
          const pluginPath = require.resolve(dependency)
          component = esmRequire(pluginPath).default
        } catch { }
        component = component || (await resolve()).default
        const newPlugin = { name: dependency, ...component }
        plugins.push(newPlugin)
      }
    }
  }
  return plugins
}

module.exports = {
  createApp
}
