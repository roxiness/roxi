/**
 * @typedef {'svelte'|'rollup'|'vite'} wrapperTypes
 */


/**
 * merge base configs with user and plugin wrappers
 * @param {wrapperTypes} name
 * @param {Object.<String, *>} options
 * @param {import("./userConfigs").UserConfig} userConfig
 */
function mergeConfigs(name, options, userConfig) {
  const { roxi, wrappers: userWrappers } = userConfig
  let config = { ...options }

  const wrappers = [
    userWrappers[name],
    ...roxi.plugins.map(plugin => plugin.wrappers[name])
  ].filter(Boolean)

  wrappers.forEach(wrapper => {
    config = wrapper(config, null) || config
  })

  return config
}


module.exports = {
  mergeConfigs
}
