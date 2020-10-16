
const svelte = require('rollup-plugin-svelte-hot')
const resolve = require('@rollup/plugin-node-resolve').default
const commonjs = require('@rollup/plugin-commonjs')
const { terser } = require('rollup-plugin-terser')
const hmr = require('rollup-plugin-hot')
const livereload = require('rollup-plugin-livereload')
const { readFileSync } = require('fs-extra')

/** @type {RoxiPluginHookFunction} */
module.exports = function rollup(app, params) {
  const isNollup = app.config.roxi.plugins.find(p => p.name === 'nollup')
  const { buildDir, staticDir } = app.config.roxi
  const { production } = app.state

  /** assign to `this` for type support */
  const rollup = {
    writeConfig: false,
    compileConfig: false,
    input: `src/main.js`,
    preserveEntrySignatures: false,
    output: {
      name: 'roxi_app',
      sourcemap: true,
      format: 'esm', dir: buildDir
    },
    pluginsMap: { svelte, resolve, commonjs, terser, hmr, livereload },
    plugins: {
      terser: production && {},
      svelte: app.config.svelte,
      // resolve matching modules from current working directory
      resolve: {
        browser: true,
        dedupe: importee => !!importee.match(/svelte(\/|$)/)
      },
      commonjs: {},
      terser: production && {}, // minify
      livereload: !production && !isNollup && distDir,
      _mainJsTransform: {
        transform: (code, id) => {
          if (id.match(/[/\\]src[/\\]main.js$/)) {
            const tmpl = readFileSync(__dirname + '/../../shared/main.template.js', 'utf-8')
            return {
              code: code.replace(/self\.__ROXI/, tmpl),
              map: { mappings: '' }
            }
          }
        }
      },

      hmr: production && { inMemory: true, public: staticDir }
    },
    watch: {
      clearScreen: false,
      buildDelay: 100,
    }
  }

  app.merge({ config: { rollup } })

  //add types to Typescript / JSDoc
  this.template = { rollup }
}
