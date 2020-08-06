
const devServer = require('nollup/lib/dev-server')
const path = require('path');

async function startNollup() {
  process.env.NOLLUP = "true"
  process.env.ROLLUP_WATCH = "true"

  devServer({
    port: 5000,
    config: path.resolve(__dirname, 'configs/rollup.config.js'),
    hot: true,
    contentBase: 'dist',
    publicPath: 'build',
    historyApiFallback: '/__app.html'
  })
}

module.exports = { startNollup };
