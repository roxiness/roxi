
const devServer = require('nollup/lib/dev-server')


module.exports.default = {
  name: 'nollup',
  hooks: [
    {
      event: 'start',
      condition: 'development',
      action: app => app.config.rollup.compileConfig = true
    },
    {
      event: 'after:bundle',
      condition: 'development',
      action: async (app, params, ctx) => {
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
