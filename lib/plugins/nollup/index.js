
const devServer = require('nollup/lib/dev-server')


module.exports.default = {
  name: 'nollup',
  hooks: [
    {
      event: 'after:bundle',
      action: async (app, params, ctx) => {
        devServer({
          port: params.port || app.config.roxi.port,
          contentBase: app.config.roxi.staticDir,
          ...app.config.nollup,
          config: app.config.rollup,
          hot: true,
          publicPath: 'build',
          historyApiFallback: '/__index.html'
        })
      }
    }
  ]
}
