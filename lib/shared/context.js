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



async function createContext() {
  const roxi = require('../configs/roxi.defaults.config')

  const _ctx = { config: { roxi }, state: {} }

  // create new this.ctx for better types
  let ctx = this.ctx = {
    ..._ctx,
    config: {
      roxi: { ...roxi, ...parseRoxiConfig() },
      // /** @type {import('../configs/rollup.config').default['config']} */
      // rollup: esmRequire('../configs/rollup.config').default(_ctx),
      svelte: require('../configs/svelte.config')(_ctx),
      spassr: require('../configs/spassr.config')(_ctx),
      nollup: require('../configs/nollup.config')(_ctx),
      vite: require('../configs/nollup.config')(_ctx),
      serviceWorker: require('../configs/nollup.config')(_ctx),
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
  const merge = mergeOptions.bind({concatArrays: true})
  const builtInPlugins = [
    esmRequire('../plugins/rollup').default,
    esmRequire('../plugins/routify').default
  ]

  const plugins = [...ctx.config.roxi.plugins, ...builtInPlugins]

  for (const plugin of plugins) {
    const hooks = plugin.hooks.filter(hookCondition(event, ctx))
    for (const hook of hooks) {
      /** @type {RoxiContext|false} */
      const result = await hook.action(ctx, plugin.params)
      if (result) {
        /** @ts-ignore */
        ctx = merge(ctx, result)
      }
    }
  }

  // const pluginPromises = plugins.map(plugin => {
  //   return plugin.hooks
  //     .filter(hookCondition(event, ctx))
  //     .map(async hook => {
  //       /** @type {RoxiContext|false} */
  //       const result = await hook.action(ctx, plugin.params)
  //       if (result) {
  //         /** @ts-ignore */
  //         ctx = mergeOptions(ctx, result)
  //       }
  //     })
  // })
  // await Promise.all(pluginPromises)
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
 * @returns {{bundler: string, plugins: RoxiPlugin[]}}
 */
function parseRoxiConfig() {
  const { parse } = require('yaml')
  const { normalizeYamlArray } = require('../utils')

  if (!existsSync(roxiConfigPath))
    return { bundler: 'rollup', plugins: [] }

  /** @type {RoxiContext['config']['roxi']} */
  const config = parse(readFileSync(roxiConfigPath, 'utf-8'))
  const plugins = attachPlugins(normalizeYamlArray(config.plugins))
  return { ...config, plugins }
}

/**
 * attaches 'hooks' to plugins
 * @param {NamedObject[]} plugins
 */
function attachPlugins(plugins) {
  return plugins.map(plugin => {
    const pluginPath = require.resolve(plugin.name)
    /** @type {RoxiPluginHook[]} */
    const hooks = esmRequire(pluginPath).default
    const _plugin = { ...plugin, hooks }
    return _plugin
  })
}

module.exports = {
  createContext
}
