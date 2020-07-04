import svelte from 'rollup-plugin-svelte-hot';
import resolve from '@rollup/plugin-node-resolve';
import { spassr } from 'spassr'
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import copy from 'rollup-plugin-copy'
import Hmr from 'rollup-plugin-hot'
import livereload from 'rollup-plugin-livereload';
import { readFileSync } from 'fs'
import esm from 'esm'

const wrappers = esm(module)(process.cwd() + '/_roxi/config.wrappers.js').default

export default function (options) {
  const { staticDir, distDir, buildDir, production, isNollup, buildStaticExports, useDynamicImports } = options
  const config = wrappers.rollup({
    input: `src/main.js`,
    inlineDynamicImports: !useDynamicImports,
    output: {
      name: 'routify_app',
      sourcemap: true,
      ...useDynamicImports
      ? { format: 'esm', dir: buildDir }
      : { format: 'iife', file: `${buildDir}/bundle.js` }
    },
    plugins: [
      useDynamicImports && copy({
        targets: [
          { src: [`${staticDir}/*`, "!*/(__index.html)"], dest: distDir },
          { src: [`${staticDir}/__index.html`], dest: distDir, rename: '__app.html', transform },
        ],
        copyOnce: true,
        flatten: false
      }),
      {
        // replace self.__ROXI with main.template.js's content
        transform: (code, id) => id.match(/[/\\]src[/\\]main.js$/) && code.replace(/self\.__ROXI/, readFileSync(__dirname + '/main.template.js', 'utf-8'))
      },
      svelte(wrappers.svelte({
        dev: !production, // run-time checks
        // Extract component CSS — better performance
        css: css => {
          css.write(`${buildDir}/bundle.css`);
        },
        hot: isNollup,
      })),

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
        writeBundle: () => spassr({ serveSpa: true, serveSsr: true, })
      }
    ],
    watch: {
      clearScreen: false,
      buildDelay: 100,
    }
  })

  // return userConfig({ config })
  return config

  function transform(contents) {
    return contents.toString().replace('__SCRIPT__', useDynamicImports
      ? '<script type="module" defer src="/build/main.js"></script>'
      : '<script defer src="/build/bundle.js"></script>')
  }

  function prerender() {
    return {
      // writeBundle() {
      //   require('child_process').spawn('npm', ['run', 'export'], {
      //     stdio: ['ignore', 'inherit', 'inherit'],
      //     shell: true
      //   });
      // }
    }
  }
}
