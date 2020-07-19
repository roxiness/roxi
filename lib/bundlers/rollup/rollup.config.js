import del from 'del'
import serviceWorkerConfig from './configs/serviceworker.config.js'
import baseConfig from './configs/base.config.js'

const production = process.env.NODE_ENV === 'production';
const isNollup = !!process.env.NOLLUP

const staticDir = 'public'
const distDir = 'dist'
const buildDir = `${distDir}/build`
const buildStaticExports = process.env.PRERENDER === "true" || !!production
const useDynamicImports = process.env.BUNDLING === 'dynamic' || isNollup || !!production

const options = { staticDir, distDir, buildDir, production, buildStaticExports, isNollup, useDynamicImports }



del.sync(distDir + '/**') // clear previous builds


// Combine configs as needed
const configs = [
  !isNollup && baseConfig({ ...options, useDynamicImports: false }), // we want a bundled config for SSR in dev and prod
  useDynamicImports && baseConfig(options),
  !isNollup && serviceWorkerConfig({ distDir, production })
].filter(Boolean)

export default configs
