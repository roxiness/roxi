function dev(options) {
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
  // await startRoutify(ctx)
}

// async function startRoutify(ctx) {
//   const options = {
//     routifyDir: '_roxi/.routify',
//     dynamicImports: true,
//     singleBuild: !!ctx.config.roxi.production
//   }
//   await require(`@roxi/routify/lib/services/interface`).start(options)
// }




module.exports = { dev, build }
