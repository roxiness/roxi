function startSnowpack() {
  process.argv.push('--config', '_roxi/snowpack.config.js')
  process.argv.push('--reload')
  require('snowpack/dist-node/index.bin')
}

module.exports = { startSnowpack }
