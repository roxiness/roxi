const { resolve } = require('path')

function startSnowpack() {
  process.argv.push('--config', resolve(__dirname, 'snowpack.config.js'))
  process.argv.push('--reload')
  require('snowpack/dist-node/index.bin')
}

module.exports = { startSnowpack }
