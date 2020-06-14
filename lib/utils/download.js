
const { createWriteStream } = require('fs')
const axios = require('axios')

/**
 * @param {string} url
 * @param {string} path
 */
async function download(url, path) {
  const writer = createWriteStream(path)

  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream'
  })

  response.data.pipe(writer)

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve)
    writer.on('error', reject)
  })
}


module.exports = { download }
