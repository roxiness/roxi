import svelte from 'rollup-plugin-svelte-hot'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import copy from 'rollup-plugin-copy-watch'
import Hmr from 'rollup-plugin-hot'
import livereload from 'rollup-plugin-livereload'
import { readFileSync } from 'fs'

/**@param {RoxiContext} ctx     */
export default function rollupConfig(ctx, params) {
  const { pluginsCfg } = ctx.config.rollup
  const { distDir, bundler } = ctx.config.roxi
  const { production } = ctx.state
  const useDynamicImports = true
  const isNollup = bundler === 'nollup'

  delete ctx.config.rollup.pluginsCfg

  return {
    config: {
      rollup: {
        plugins: [
          copy(pluginsCfg.copy),
          {
            // replace self.__ROXI with main.template.js's content
            transform: (code, id) => id.match(/[/\\]src[/\\]main.js$/)
              && code.replace(/self\.__ROXI/,
                readFileSync(__dirname + '/../../shared/main.template.js', 'utf-8'))
          },
          svelte(ctx.config.svelte),

          // resolve matching modules from current working directory
          resolve(pluginsCfg.resolve),
          commonjs(),
          production && terser(), // minify
          !production && isNollup && Hmr(pluginsCfg.hmr), // refresh only updated code
          !production && !isNollup && livereload(distDir), // refresh entire window when code is updated

        ],
        watch: {
          clearScreen: false,
          buildDelay: 100,
        }
      }
    }
  }
}
