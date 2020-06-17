function dev(options) {
  const bundlers = {
    nollup: () => require('./bundlers/nollup').startNollup(),
    rollup: () => require('./bundlers/rollup').startRollup(),
    vite: '',
    snowpack: () => require('./bundlers/snowpack').startSnowpack()
  }

  startRoutify()
  const bundler = bundlers[options.bundler]
  bundler()


  console.log('foo')
  // if(options.bundler === 'rollup') {
  // }
}


function startRoutify() {
  const options = {
    routifyDir: '_roxi/.routify',
    plugins: {
      // [`${__dirname}/routify-plugins/importPathsToMounts.js`]: {}
      [`${__dirname}/routify-plugins/sveltechToRoxi.js`]: {}
    }
  }

  require(`@sveltech/routify/lib/services/interface`)
    .start(options)
}




module.exports = { dev }
