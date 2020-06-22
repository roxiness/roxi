import svelte from 'rollup-plugin-svelte-hot';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import copy from 'rollup-plugin-copy'
import Hmr from 'rollup-plugin-hot'
import livereload from 'rollup-plugin-livereload';

export default function ({ staticDir, distDir, buildDir, production, isNollup, buildStaticExports, useDynamicImports }) {
  return {
    input: `src/main.js`,
    output: {
      name: 'routify_app',
      sourcemap: true,
      inlineDynamicImports: !useDynamicImports,
      output: useDynamicImports
        ? { format: 'iife', file: `${buildDir}/bundle.js` }
        : { format: 'esm', dir: buildDir }
    },
    plugins: [
      copy({
        targets: [
          { src: [`${staticDir}/*`, "!*/(__index.html)"], dest: distDir },
          { src: [`${staticDir}/__index.html`], dest: distDir, rename: '__app.html', transform },
        ],
        copyOnce: true,
        flatten: false
      }),
      svelte({
        dev: !production, // run-time checks
        // Extract component CSS — better performance
        css: css => {
          css.write(`${buildDir}/bundle.css`);
        },
        hot: isNollup,
      }),

      // resolve matching modules from current working directory
      resolve({
        browser: true,
        dedupe: importee => !!importee.match(/svelte(\/|$)/)
      }),
      commonjs(),

      production && terser(), // minify
      buildStaticExports && prerender(),
      !production && isNollup && Hmr({ inMemory: true, public: staticDir, }), // refresh only updated code
      !production && !isNollup && livereload(distDir) // refresh entire window when code is updated
    ],
    watch: {
      clearScreen: false,
      buildDelay: 100,
    }
  }


  function transform(contents) {
    return contents.toString().replace('__SCRIPT__', useDynamicImports
      ? '<script type="module" defer src="/build/main.js"></script>'
      : '<script defer src="/build/bundle.js"></script>')
  }

  function prerender() {
    return {
      writeBundle() {
        require('child_process').spawn('npm', ['run', 'export'], {
          stdio: ['ignore', 'inherit', 'inherit'],
          shell: true
        });
      }
    }
  }
}
