

const { readFileSync } = require('fs-extra')

/** @type {RoxiPluginHookFunction} */
module.exports.default = function rollup(app, params) {
  const { buildDir, staticDir } = app.config.roxi
  const { production } = app.state

  /** assign to `this` for type support */
  const rollup = {
    writeConfig: false,
    compileConfig: false,
    input: `src/main.js`,
    preserveEntrySignatures: false,
    output: {
      name: 'routify_app',
      sourcemap: true,
      format: 'esm', dir: buildDir
    },
    plugins: [],
    pluginsCfg: {
      mainJsTransform: {
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
      copy: {
        watch: !production && 'public',
        copyOnce: true,
        flatten: false
      },
      resolve: {
        browser: true,
        dedupe: importee => !!importee.match(/svelte(\/|$)/)
      },
      hmr: { inMemory: true, public: staticDir }
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
