import {readFileSync} from 'fs-extra'

export default function (app, params) {
  const { buildDir, distDir, staticDir, port } = app.config.roxi
  const { production } = app.state
  const useDynamicImports = true

  const transform = contents =>
    contents.toString().replace('__SCRIPT__', useDynamicImports
      ? '<script type="module" defer src="/build/main.js"></script>'
      : '<script defer src="/build/bundle.js"></script>')


  /** assign to `this` for type support */
  const rollup = this.config = {
    input: `src/main.js`,
    preserveEntrySignatures: false,
    inlineDynamicImports: !useDynamicImports,
    output: {
      name: 'routify_app',
      sourcemap: true,
      ...useDynamicImports
        ? { format: 'esm', dir: buildDir }
        : { format: 'iife', file: `${buildDir}/bundle.js` }
    },
    plugins: [],
    pluginsCfg: {
      mainJsTransform: {
        // replace self.__ROXI with main.template.js's content
        transform: (code, id) => id.match(/[/\\]src[/\\]main.js$/)
          && code.replace(/self\.__ROXI/,
            readFileSync(__dirname + '/../../shared/main.template.js', 'utf-8'))
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
