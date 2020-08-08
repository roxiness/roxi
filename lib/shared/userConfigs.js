/**
 * @typedef {Object} UserConfig
 * @prop {RoxiConfig} roxi
 * @prop {Wrappers} wrappers
 *
 * @typedef {Object} RoxiConfig
 * @prop {String} bundler
 * @prop {RoxiPlugin[]} plugins
 *
 * @typedef {NamedObject & {wrappers: Wrappers}} RoxiPlugin
 *
 * @typedef {Object} NamedObject
 * @prop {String} name
 * @prop {Object.<string, *>} fields
 *
 * @typedef {Object} PredefinedWrappers
 * @prop {Wrapper=} svelte
 * @prop {Wrapper=} rollup
 * @prop {Wrapper=} vite
 * @prop {Wrapper=} routify
 *
 * @typedef {PredefinedWrappers & Object.<string, Wrapper>} Wrappers
 *
 * @callback  Wrapper
 * @param {Object.<String, *>} config
 * @param {*} ctx
 */

require = require("esm")(module/*, options*/)
const { parse } = require('yaml')
const { readFileSync, existsSync } = require('fs-extra')

const wrappersPath = process.cwd() + '/_roxi/config.wrappers.js'
const roxiConfigPath = process.cwd() + '/_roxi/roxi.config.yaml'
const wrapperExists = existsSync(wrappersPath)
const { normalizeYamlArray } = require('../utils')
const { mergeConfigs } = require("../utils/config")


/**
 * @returns {RoxiConfig}
 */
function getRoxiConfig() {
  if (!existsSync(roxiConfigPath))
    return { bundler: 'rollup', plugins: [] }

  /** @type {RoxiConfig} */
  const config = parse(readFileSync(roxiConfigPath, 'utf-8'))
  config.plugins = normalizePlugins(config.plugins)

  return config
}


function normalizePlugins(plugins) {
  const _plugins = normalizeYamlArray(plugins)
  return attachPlugins(_plugins)
}


/**
 * attaches 'wrappers' to plugins
 * @param {NamedObject[]} plugins
 * @return {RoxiPlugin[]}
 */
function attachPlugins(plugins) {
  return plugins.map(plugin => {
    const pluginPath = require.resolve(plugin.name)
    const wrappers = require(pluginPath).wrappers
    const _plugin = { ...plugin, wrappers }
    return _plugin
  })
}

const userConfig = {
  wrappers: wrapperExists ? require(wrappersPath).default : {},
  roxi: getRoxiConfig(),
}

module.exports = {
  ...userConfig,
  mergeWithUserConfig(name, options, ctx) {
    return mergeConfigs(name, options, userConfig, ctx)
  }
}
