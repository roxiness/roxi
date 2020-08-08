const { copySync, ensureDirSync, emptyDirSync, existsSync } = require('fs-extra')
const { resolve } = require('path')
module.exports = { copyATest, waitForServer }

const buildPath = resolve(__dirname, 'temp')

if (!process.env.reuse_build)
  emptyDirSync(resolve(buildPath))
ensureDirSync(buildPath)

function copyATest(name = 'basic', tag) {
  const from = resolve(__dirname, '..', 'examples', name)
  const path = resolve(buildPath, `${name}-` + tag)
  const exists = existsSync(path)
  console.log('from', from)
  copySync(from, path, { filter: file => !file.match(/\/node_modules|\/dist/) })
  return { path, exists }
}


async function waitForServer(page, url, timeout = 20000) {
  const startTime = Date.now()
  while (Date.now() - startTime < timeout) {
    try {
      const response = await page.goto(url)
      if (response.ok())
        return response
      await new Promise(resolve => setTimeout(resolve, 100))
    } catch (err) { }
  }
  throw new Error('Server never started')
}

function setBundler(){

}
