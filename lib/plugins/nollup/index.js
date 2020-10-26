
const devServer = require('nollup/lib/dev-server')
const hmr = require('rollup-plugin-hot')

module.exports.default = {
  dependencies: { 'rollup': () => require('../rollup') },
  hooks: [
    {
      name: 'set rollup.compileConfig to true',
      event: 'start',
      condition: 'development',
      // Nollup needs the Rollup config, so make sure Rollup compiles its config

      action: (app, params) => {
        app.merge({
          config: {
            rollup: { compileConfig: true },
            nollup: {
              port: params.port || app.config.roxi.port,
              contentBase: app.config.roxi.staticDir,
              hot: true,
              publicPath: 'build',
              historyApiFallback: '/__index.html',
            }
          }
        })
      }
    },
    {
      name: 'start nollup server',
      event: 'after:bundle',
      condition: 'development',
      action: async (app, params, ctx) => {
        const { staticDir } = app.config.roxi

        //start the nollup dev server
        devServer({
          port: params.port || app.config.roxi.port,
          contentBase: app.config.roxi.staticDir,
          config: {
            ...app.config.rollup,
            plugins: [
              ...app.config.rollup.plugins.filter(plugin => plugin.name !== 'hot'),
              hmr({ inMemory: true, public: staticDir, compatNollup: true })
            ]
          },
          hot: true,
          publicPath: 'build',
          historyApiFallback: '/__index.html',
          ...app.config.nollup
        })
      }
    }
  ]
}
