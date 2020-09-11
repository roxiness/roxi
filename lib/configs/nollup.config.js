
const devServer = require('nollup/lib/dev-server')
const path = require('path');

module.exports = ctx => ({
  port: ctx.config.roxi.port,
  config: path.resolve(__dirname, 'configs/rollup.config.js'),
  hot: true,
  contentBase: ctx.config.roxi.distDir,
  publicPath: 'build',
  historyApiFallback: '/__app.html'
}
)
