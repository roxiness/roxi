export default function (ctx, params) {
  const { buildDir, distDir, staticDir, port } = ctx.config.roxi
  const { production } = ctx.state
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
    onwarn(warning, warn) {
      // skip certain warnings
      if (warning.code === 'UNUSED_EXTERNAL_IMPORT') return;

      // throw on others
      if (warning.code === 'NON_EXISTENT_EXPORT') throw new Error(warning.message);

      console.log(warning.message)
      // Use default for everything else
      warn(warning);
    },
    output: {
      name: 'routify_app',
      sourcemap: true,
      ...useDynamicImports
        ? { format: 'esm', dir: buildDir }
        : { format: 'iife', file: `${buildDir}/bundle.js` }
    },
    plugins: [],
    pluginsCfg: {
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
