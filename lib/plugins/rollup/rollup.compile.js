/// <reference path="../../../typedef.js" />

import svelte from 'rollup-plugin-svelte-hot'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import copy from 'rollup-plugin-copy-watch'
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
          copy(pluginsCfg.copy),
          {
            // replace self.__ROXI with main.template.js's content
            transform: (code, id) => id.match(/[/\\]src[/\\]main.js$/)
              && code.replace(/self\.__ROXI/,
                readFileSync(__dirname + '/../../shared/main.template.js', 'utf-8'))
          },
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
