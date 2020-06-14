async function updateJSON(_path, callback) {
  const { writeFileSync, existsSync } = require('fs-extra')
  const path = require('path').resolve(_path)
  const oldJSON = existsSync(path) ? require(path) : {}
  const newJSON = await callback(oldJSON)
  writeFileSync(path, JSON.stringify(newJSON, null, 2))
}

module.exports = { updateJSON }
