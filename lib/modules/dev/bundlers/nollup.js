
const devServer = require('nollup/lib/dev-server')
const path = require('path');

async function startNollup() {
  process.env.NOLLUP = true
  process.env.ROLLUP_WATCH = true

  devServer({
    port: 8080,
    config: path.resolve(__dirname, 'rollup.config.js'),
    hot: true,
    contentBase: 'static',
    publicPath: 'build',
    proxy: {
      '/': 'http://localhost:5000',
    },
  })
}

module.exports = { startNollup };
