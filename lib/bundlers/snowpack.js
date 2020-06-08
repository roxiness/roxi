function startSnowpack() {
  process.argv.push('--config', '_roxi/snowpack.config.js')
  require('snowpack/dist-node/index.bin')
}

module.exports = { startSnowpack }
