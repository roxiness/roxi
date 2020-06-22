import del from 'del'
import { spassr } from 'spassr'
import serviceWorkerConfig from './configs/serviceworker.config.js'
import baseConfig from './configs/base.config.js'

const production = !process.env.ROLLUP_WATCH;
const isNollup = !!process.env.NOLLUP

const staticDir = 'static'
const distDir = 'dist'
const buildDir = `${distDir}/build`
const buildStaticExports = process.env.PRERENDER === "true" || !!production
const useDynamicImports = process.env.BUNDLING === 'dynamic' || isNollup || !!production

const options = { staticDir, distDir, buildDir, production, buildStaticExports, isNollup, useDynamicImports }



del.sync(distDir + '/**') // clear previous builds

if (!production && !isNollup)
  spassr({ serveSpa: true, serveSsr: true, })


// extends baseConfig
const bundledConfig = extendBase({
  inlineDynamicImports: true,
  output: { format: 'iife', file: `${buildDir}/bundle.js` }
})

// extends baseConfig
const dynamicConfig = extendBase({ output: { format: 'esm', dir: buildDir } })

// Combine configs as needed
const configs = [
  !isNollup && baseConfig({ ...options, useDynamicImports: false }), // we want a bundled config for SSR in dev and prod
  useDynamicImports && baseConfig(options),
  !isNollup && serviceWorkerConfig({ distDir, production })
].filter(Boolean)

export default configs





function extendBase(extend) { return mergeRollupConfigs(baseConfig(options), extend) }

function mergeRollupConfigs(base, extend) {
  Object.entries(extend).forEach(([key, value]) => {
    if (Array.isArray(value)) base[key].push(...value)
    else if (typeof value === 'object') Object.assign(base[key], value)
    else base[key] = value
  })
  return base
}

function runCount(name) {
  const entries = runCount['entries'] = runCount['entries'] || {}
  entries[name] = entries[name] && entries[name] + 1 || 1
  return entries[name] - 1
}
