function dev(options) {
  process.env.NODE_ENV = 'development'
  start(options)
}

async function build(options) {
  process.env.NODE_ENV = 'production'
  // if (options.bundler === 'nollup') options.bundler = 'rollup'
  options.bundler = 'rollup'
  await start(options)
}

async function start(options) {
  const bundlers = {
    nollup: () => require('./rollup/nollup').startNollup,
    rollup: () => require('./rollup/rollup').startRollup,
    vite: () => require('./vite/vite').startVite,
    snowpack: () => require('./snowpack/snowpack').startSnowpack
  }

  const bundler = bundlers[options.bundler]()
  bundler(options)
  await startRoutify(options)
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
