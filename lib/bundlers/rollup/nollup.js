
const devServer = require('nollup/lib/dev-server')
const path = require('path');

async function startNollup(options) {
  process.env.NOLLUP = "true"
  process.env.ROLLUP_WATCH = "true"

  devServer({
    port: options.port,
    config: path.resolve(__dirname, 'configs/rollup.config.js'),
    hot: true,
    contentBase: options.distDir,
    publicPath: 'build',
    historyApiFallback: '/__app.html'
  })
}

module.exports = { startNollup };
