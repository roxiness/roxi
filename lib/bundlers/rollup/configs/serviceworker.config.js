import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import replace from '@rollup/plugin-replace';
import { injectManifest } from 'rollup-plugin-workbox'

export default function ({ distDir, production }) {
  return {
    input: `src/sw.js`,
    output: {
      name: 'service_worker',
      sourcemap: true,
      format: 'iife',
      file: `${distDir}/sw.js`
    },
    plugins: [
      {
        name: 'watch-app',
        buildStart() { this.addWatchFile(`${distDir}/build`) }
      },
      commonjs(),
      resolve({ browser: true }),
      injectManifest({
        swSrc: `${distDir}/sw.js`,
        swDest: `${distDir}/sw.js`,
        globDirectory: distDir,
        globPatterns: ['**/*.{js,css,svg}', '__app.html'],
        maximumFileSizeToCacheInBytes: 10000000, // 10 MB
      }),
      replace({ 'process.env.NODE_ENV': JSON.stringify('production'), }),
      production && terser(),
    ]
  }
}
