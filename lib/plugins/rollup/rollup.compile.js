/// <reference path="../../../typedef.js" />

const { keysAsFunctions } = require('../../utils')

/**@param {RoxiApp} app     */
export default async function rollupConfig(app, params, ctx) {
  const { plugins, pluginsMap } = app.config.rollup
  delete app.config.rollup.pluginsMap
  app.config.rollup.plugins.svelte = app.config.svelte
  app.config.rollup.plugins = await keysAsFunctions(plugins, pluginsMap)
}
