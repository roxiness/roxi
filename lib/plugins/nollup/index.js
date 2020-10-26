
const devServer = require('nollup/lib/dev-server')

module.exports.default = {
  dependencies: { 'rollup': () => require('../rollup') },
  hooks: [
    {
      name: 'set rollup.compileConfig to true',
      event: 'start',
      condition: 'development',
      // Nollup needs the Rollup config, so make sure Rollup compiles its config
      action: app => app.config.rollup.compileConfig = true
    },
    {
      name: 'start nollup server',
      event: 'after:bundle',
      condition: 'development',
      action: async (app, params, ctx) => {
        //start the nollup dev server
        devServer({
          port: params.port || app.config.roxi.port,
          contentBase: app.config.roxi.staticDir,
          config: app.config.rollup,
          hot: true,
          publicPath: 'build',
          historyApiFallback: '/__index.html',
          ...app.config.nollup
        })
      }
    }
  ]
}
