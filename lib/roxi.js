/// <reference path="../typedef.js" />

const { readFileSync, existsSync } = require('fs-extra')
const { resolve } = require('path')
const esmRequire = require("esm")(module, {}/*, options*/)
const { normalizePluginConfig } = require('./utils')
const roxiConfigPath = process.cwd() + '/_roxi/roxi.config.yaml'

module.exports = {
  run: async () => {
    const config = {
      port: "5000",
      host: "http://mysite.com",
      bundler: "nollup",
      staticDir: 'public',
      template: 'public/__index.html',
      buildDir: 'public/build',
      script: 'public/build/main.js',
      distDir: 'dist',
      logLevel: 'info',
      ...await parseRoxiConfig()
    }
    this.template = { roxi: config }
    return config
  }
}


/**
 * Creates a config from Roxi defaults, user config and plugins
 * @returns {Promise<{plugins: RoxiPluginConfigured[]}>}
 */
async function parseRoxiConfig() {
  const { parse } = require('yaml')

  if (!existsSync(roxiConfigPath))
    return { plugins: [] }

  /** @type {RoxiApp['config']['roxi']} */
  const config = parse(readFileSync(roxiConfigPath, 'utf-8'))
  const pluginConfigs = config.plugins.map(normalizePluginConfig)
  let plugins = pluginConfigs.map(resolvePlugin)
  plugins = await attachPluginDependencies(plugins)
  return { ...config, plugins }
}


/**
 * @param {RoxiPluginConfig} plugin
 * @return {RoxiPluginConfigured}
 */
function resolvePlugin(plugin) {
  let path = plugin.name
  const builtinPath = resolve(__dirname, 'plugins', path)

  if (existsSync(path))
    path = resolve(path)
  else if (existsSync(builtinPath))
    path = builtinPath

  /** @type {RoxiPlugin} */
  const component = esmRequire(path)['default']
  return { ...plugin, ...component }
}


/**
 * add plugins that haven't been declared in roxi config.
 * these are all resolved within the respective plugins
 * @param {RoxiPluginConfigured[]} plugins
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
