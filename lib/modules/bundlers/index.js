function dev(options) {
  const bundlers = {
    nollup: () => require('./rollup/nollup').startNollup(),
    rollup: () => require('./rollup/rollup').startRollup(),
    vite: '',
    // snowpack: () => require('./bundlers/snowpack').startSnowpack()
  }

  startRoutify()
  const bundler = bundlers[options.bundler]
  bundler()
}

function build(options) {
  process.env.NODE_ENV = 'production'
  if(options.bundler === 'nollup') options.bundler = 'rollup'
  dev(options)
}

function startRoutify() {
  const options = {
    routifyDir: '_roxi/.routify',
    dynamicImports: true,
    singleBuild: process.env.NODE_ENV === 'production',
    plugins: {
      // [`${__dirname}/../shared/routify-plugins/routifyToRoxi.js`]: {}
    }
  }

  require(`@sveltech/routify/lib/services/interface`)
    .start(options)
}


module.exports = { dev, build }
