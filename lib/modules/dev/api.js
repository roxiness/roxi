function app(options) {
  startRoutify()
  require('./bundlers/snowpack').startSnowpack()
  //  require('../bundlers/nollup').startNollup()
}


function startRoutify() {
  const options = {
    routifyDir: '_roxi/.routify',
    plugins: {
      [`${__dirname}/routify-plugins/importPathsToMounts.js`]: {}
    }
  }

  require(`@sveltech/routify/lib/services/interface`)
    .start(options)
}

module.exports = { app }
