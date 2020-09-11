function dev(options) {
  process.env.NODE_ENV = 'development'
  // start(options)
}

/**
 *
 * @param {import('../shared/context').RoxiContext} ctx
 */
async function build(ctx) {
  const { roxi } = ctx.config
  const { removeSync } = require('fs-extra')
  removeSync(process.cwd() + '/' + roxi.distDir + '/**') // clear previous builds
  process.env.NODE_ENV = 'production'
  // if (options.bundler === 'nollup') options.bundler = 'rollup'
  roxi.bundler = 'rollup'
  await start(ctx)
}

/**
 *
 * @param {import('../shared/context').RoxiContext} ctx
 */
async function start(ctx) {
  // const bundlers = {
  //   nollup: () => require('./nollup').startNollup,
  //   rollup: () => require('./rollup').startRollup,
  //   vite: () => require('./vite').startVite,
  //   snowpack: () => require('./snowpack/snowpack').startSnowpack
  // }

  // const bundler = bundlers[ctx.config.roxi.bundler]()
  // bundler(ctx)
  await startRoutify(ctx)
}

async function startRoutify(_options) {
  const options = {
    routifyDir: '_roxi/.routify',
    dynamicImports: true,
    singleBuild: process.env.NODE_ENV === 'production'
  }
  await require(`@roxi/routify/lib/services/interface`).start(options)
}




module.exports = { dev, build }
