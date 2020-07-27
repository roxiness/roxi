const { rmdirSync, removeSync } = require('fs-extra')
import serviceWorkerConfig from './serviceworker.config.js'
import baseConfig from './base.config.js'

const production = process.env.NODE_ENV === 'production';
const isNollup = !!process.env.NOLLUP

const staticDir = 'public'
const distDir = 'dist'
const buildDir = `${distDir}/build`
const buildStaticExports = process.env.PRERENDER === "true" || !!production
const useDynamicImports = process.env.BUNDLING === 'dynamic' || isNollup || !!production

const options = { staticDir, distDir, buildDir, production, buildStaticExports, isNollup, useDynamicImports }



removeSync(process.cwd() + '/' + distDir + '/**') // clear previous builds


// Combine configs as needed
const configs = [
  !isNollup && baseConfig({ ...options, useDynamicImports: false }), // we want a bundled config for SSR in dev and prod
  useDynamicImports && baseConfig(options),
  // !isNollup && serviceWorkerConfig({ distDir, production })
].filter(Boolean)

export default configs
