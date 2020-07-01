function dev(options) {
  const bundlers = {
    nollup: () => require('./nollup').startNollup(),
    rollup: () => require('./rollup').startRollup(),
    vite: '',
    // snowpack: () => require('./bundlers/snowpack').startSnowpack()
  }

  startRoutify()
  const bundler = bundlers[options.bundler]
  bundler()
}


function startRoutify() {
  const options = {
    routifyDir: '_roxi/.routify',
    plugins: {
      // [`${__dirname}/../shared/routify-plugins/routifyToRoxi.js`]: {}
    }
  }

  require(`@sveltech/routify/lib/services/interface`)
    .start(options)
}


module.exports = { dev }
