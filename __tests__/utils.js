const { copySync, ensureDirSync, emptyDirSync } = require('fs-extra')
const { resolve } = require('path')

const buildPath = 'temp'


function copyATest() {
  const guid = (Date.now() + (Math.random() * 10e5)).toString(36)
  const from = resolve(__dirname, '..', 'example')
  const path = resolve(__dirname, buildPath, 'example-' + guid)
  ensureDirSync(buildPath)
  copySync(from, path, { filter: file => !file.match(/example.node_modules/) })
  return { path }
}

function clearTemp() {
  emptyDirSync(resolve(__dirname, buildPath))
}

module.exports = { copyATest, clearTemp }
