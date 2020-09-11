import svelte from 'rollup-plugin-svelte-hot'
import resolve from '@rollup/plugin-node-resolve'
import { spassr } from 'spassr'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import copy from 'rollup-plugin-copy-watch'
import Hmr from 'rollup-plugin-hot'
import livereload from 'rollup-plugin-livereload'
import { readFileSync } from 'fs'
const { optionsFromEnv } = require('../utils/config.old.js')

const production = process.env.NODE_ENV === 'production';
const isNollup = !!process.env.NOLLUP

const buildStaticExports = process.env.PRERENDER === "true" || !!production
const useDynamicImports = process.env.BUNDLING === 'dynamic' || isNollup || !!production

const _options = { production, buildStaticExports, isNollup, useDynamicImports }

// const configs = [
//   !isNollup && baseConfig({ useDynamicImports: false }), // we want a bundled config for SSR in dev and prod
//   useDynamicImports && baseConfig({})
// ].filter(Boolean)


export default function rollupConfig(ctx) {
  const { staticDir, distDir, buildDir } = ctx.config.roxi

  /** @namespace rollupConfig.config */
  this.config = {
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
    plugins: [
      copy({
        watch: !production && 'public',
        targets: [
          { src: [`${staticDir}/*`, "!*/(__index.html)"], dest: distDir },
          { src: [`${staticDir}/__index.html`], dest: distDir, rename: '__app.html', transform },
        ],
        copyOnce: true,
        flatten: false
      }),
      {
        // replace self.__ROXI with main.template.js's content
        transform: (code, id) => id.match(/[/\\]src[/\\]main.js$/)
          && code.replace(/self\.__ROXI/,
            readFileSync(__dirname + '/../shared/main.template.js', 'utf-8'))
      },
      svelte(ctx.config.svelte),

      // resolve matching modules from current working directory
      resolve({
        browser: true,
        dedupe: importee => !!importee.match(/svelte(\/|$)/)
      }),
      commonjs(),

      production && terser(), // minify
      buildStaticExports && prerender(),
      !production && isNollup && Hmr({ inMemory: true, public: staticDir, }), // refresh only updated code
      !production && !isNollup && livereload(distDir), // refresh entire window when code is updated

      !production && !isNollup && !useDynamicImports && {
        writeBundle: () => spassr({
          serveSpa: true,
          serveSsr: true,
          spaPort: port,
          ssrPort: (Number(port) + 5).toString()
        })
      }
    ],
    watch: {
      clearScreen: false,
      buildDelay: 100,
    }
  }

  return this.config
}

function transform(contents) {
  return contents.toString().replace('__SCRIPT__', useDynamicImports
    ? '<script type="module" defer src="/build/main.js"></script>'
    : '<script defer src="/build/bundle.js"></script>')
}


