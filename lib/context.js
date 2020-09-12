/**
 * @typedef {Object} NamedObject
 * @prop {String} name
 * @prop {Object.<string, *>} params
 *
 * @typedef {'start'|'beforeUserConfig'|'afterUserConfig'|'router'|'end'} ContextEvent
 *
 * @typedef {Object} RoxiPlugin
 * @prop {string} name
 * @prop {RoxiPluginHook[]} hooks
 * @prop {Object.<string, *>} params
 * @prop {String[]} dependencies
 *
 * @typedef {Object} RoxiPluginHook
 * @prop {String} condition
 * @prop {Function} action
 *
 * @callback RoxiPluginHookAction
 * @param {RoxiContext} ctx
 *
 * @typedef {createContext['ctx']} RoxiContext
 */



const esmRequire = require("esm")(module, {}/*, options*/)
const { readFileSync, existsSync } = require('fs-extra')
const mergeOptions = require('merge-options')
const roxiConfigPath = process.cwd() + '/_roxi/roxi.config.yaml'


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

async function createContext() {
  const roxi = require('./configs/roxi.defaults.config')

  const _ctx = { config: { roxi }, state: {} }

  // create new this.ctx for better types
  let ctx = this.ctx = {
    ..._ctx,
    config: {
      roxi: { ...roxi, ...(await parseRoxiConfig()) },
      svelte: require('./configs/svelte.config')(_ctx),
      spassr: require('./configs/spassr.config')(_ctx),
      nollup: require('./configs/nollup.config')(_ctx),
      vite: require('./configs/nollup.config')(_ctx),
      serviceWorker: require('./configs/nollup.config')(_ctx),
    }
  }

  /** @type {ContextEvent[]} */
  const events = ['start', 'beforeUserConfig', 'afterUserConfig', 'router', 'end']
  for (const event of events) {
    ctx = await runPlugins(event, ctx)
    if (event === 'beforeUserConfig') {
      ctx = await runUserMutations(ctx)
    }
  }

  return ctx
}

async function runUserMutations(ctx) {
  const config = await esmRequire(process.cwd() + '/_roxi/app.config.js').default(ctx)
  /** @ts-ignore */
  return mergeOptions(ctx, config)
}

/**
 * @param {ContextEvent} event
 * @param {RoxiContext} ctx
 */
async function runPlugins(event, ctx) {
  const esmRequire = require('esm')(module)
  const merge = mergeOptions.bind({ concatArrays: true })
  const builtInPlugins = [
    esmRequire('./plugins/rollup').default,
    esmRequire('./plugins/routify').default
  ]

  const plugins = [...ctx.config.roxi.plugins, ...builtInPlugins]

  for (const plugin of plugins) {
    const hooks = plugin.hooks.filter(hookCondition(event, ctx))
    for (const hook of hooks) {
      /** @type {RoxiContext|false} */
      const result = await hook.action(ctx, plugin.params)
      if (result) {
        ctx = merge(ctx, result)
      }
    }
  }
  return ctx
}



/**
* @param {ContextEvent} event
* @param {RoxiContext} ctx
* @returns {function(RoxiPluginHook):boolean}
*/
function hookCondition(event, ctx) {
  return (hook) => hook.condition === event
}



/**
 * Creates a config from Roxi defaults, user config and plugins
 * @returns {Promise<{bundler: string, plugins: RoxiPlugin[]}>}
 */
async function parseRoxiConfig() {
  const { parse } = require('yaml')
  const { normalizeYamlArray } = require('./utils')

  if (!existsSync(roxiConfigPath))
    return { bundler: 'rollup', plugins: [] }

  /** @type {RoxiContext['config']['roxi']} */
  const config = parse(readFileSync(roxiConfigPath, 'utf-8'))
  const listedPluginsMeta = normalizeYamlArray(config.plugins)
  const listedPlugins = attachPluginComponents(listedPluginsMeta)
  const plugins = await attachPluginDependencies(listedPlugins)
  return { ...config, plugins }
}

/**
 * attaches 'hooks' to plugins
 * @param {Partial<RoxiPlugin[]>} plugins
 */
function attachPluginComponents(plugins) {
  return plugins.map(plugin => {
    const pluginPath = require.resolve(plugin.name)

    /** @type {RoxiPlugin} */
    const component = esmRequire(pluginPath).default
    return { ...plugin, ...component }
  })
}

/**
 * attaches 'hooks' to plugins
 * @param {Partial<RoxiPlugin[]>} plugins
 */
async function attachPluginDependencies(plugins) {
  for (const plugin of plugins) {
    const names = plugins.map(plugin => plugin.name);
    for(const [dependency, resolve] of Object.entries(plugin.dependencies || {}))    {
      if (!names.includes(dependency)) {
        let component
        try {
          const pluginPath = require.resolve(dependency)
          component = esmRequire(pluginPath).default
        } catch {}
        component = component || (await resolve()).default
        const newPlugin = { name: dependency, ...component }
        plugins.push(newPlugin)
      }
    }
  }
  return plugins
}

module.exports = {
  createContext
}
