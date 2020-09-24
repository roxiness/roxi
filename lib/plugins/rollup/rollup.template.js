import { readFileSync } from 'fs-extra'

export default function (app, params) {
  const { buildDir, distDir, staticDir, port } = app.config.roxi
  const { production } = app.state

  const transform = contents =>
    contents.toString().replace('__SCRIPT__', '<script type="module" defer src="/build/main.js"></script>')



  /** assign to `this` for type support */
  const rollup = this.config = {
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
        // replace self.__ROXI with main.template.js's content
        transform: (code, id) => {
          if (id.match(/[/\\]src[/\\]main.js$/)) {
            const tmpl = readFileSync(__dirname + '/../../shared/main.template.js', 'utf-8')
            return {
              code: code.replace(/self\.__ROXI/, tmpl),
              map: {mappings: ''}
            }
          }
        }
      },
      copy: {
        watch: !production && 'public',
        targets: [
          { src: [`${staticDir}/*`, "!*/(__index.html)"], dest: distDir },
          { src: [`${staticDir}/__index.html`], dest: distDir, rename: '__app.html', transform },
        ],
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

  return { config: { rollup } }
}
