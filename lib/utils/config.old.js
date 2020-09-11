/**
 * @typedef {'svelte'|'rollup'|'vite'|'svite'} wrapperTypes
 */


/**
 * merge a base config with user and plugin wrappers
 * @param {wrapperTypes} configName
 * @param {Object.<String, *>} options
 * @param {import("../shared/userConfigs").UserConfig} userConfig
 */
function mergeConfigs(configName, options, userConfig, ctx = {}) {
  let config = { ...options }
  const { roxi, wrappers } = userConfig;

  // user wrappers
  [].concat(wrappers).forEach(wrappers => {
    const wrapper = wrappers[configName]
    if (wrapper)
      config = wrapper(config, ctx) || config
  })

  // plugin wrappers
  roxi.plugins.forEach(({ fields, wrappers }) => {
    // ensure we have an array
    [].concat(wrappers).forEach(wrappers => {
      const wrapper = wrappers[configName]
      const pluginCtx = { ...ctx, options: fields || {} }
      if (wrapper)
        config = wrapper(config, pluginCtx) || config
    })
  })

  return config
}

const ROXI_PREFIX = 'ROXI_OPTION_'



module.exports = { mergeConfigs }
