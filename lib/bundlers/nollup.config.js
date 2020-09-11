
const devServer = require('nollup/lib/dev-server')
const path = require('path');

async function startNollup(options) {
  process.env.NOLLUP = "true"
  process.env.ROLLUP_WATCH = "true"

  devServer({
    port: options.port,
    contentBase: options.staticDir,
    ...options.nollup
  })
}

module.exports = { startNollup };
