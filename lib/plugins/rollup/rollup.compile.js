/// <reference path="../../../typedef.js" />

import svelte from 'rollup-plugin-svelte-hot'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import Hmr from 'rollup-plugin-hot'
import livereload from 'rollup-plugin-livereload'
import { readFileSync } from 'fs'

/**@param {RoxiApp} app     */
export default function rollupConfig(app, params, ctx) {
  const {  pluginsCfg } = app.config.rollup
  const { distDir, bundler } = app.config.roxi
  const { production } = app.state
  const isNollup = bundler === 'nollup'
  delete app.config.rollup.pluginsCfg

  app.merge({
    config: {
      rollup: {
        plugins: [
          pluginsCfg.mainJsTransform,
          svelte(app.config.svelte),

          // resolve matching modules from current working directory
          resolve(pluginsCfg.resolve),
          commonjs(),
          production && terser(), // minify
          // !production && isNollup && Hmr(pluginsCfg.hmr), // refresh only updated code
          !production && !isNollup && livereload(distDir), // refresh entire window when code is updated

        ],
        watch: {
          clearScreen: false,
          buildDelay: 100,
        }
      }
    }
  })
}
