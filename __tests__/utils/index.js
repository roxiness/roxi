const { copySync, ensureDirSync, emptyDirSync, readFileSync, readdirSync, statSync, writeFileSync, existsSync, removeSync } = require('fs-extra')
const { execFileSync } = require('child_process')
const { resolve } = require('path')
const { hashElement } = require('folder-hash')
module.exports = { appFactory, waitForServer, clearCache }

const buildPath = resolve(__dirname, '..', 'temp', 'build')
const cachePath = resolve(__dirname, '..', 'temp', 'cache')

/**
 * @param {"basic"} template
 * @param {"pnpm"|"npm"} pkgmgr
 * @param {string} tag
 */
async function appFactory(template, pkgmgr, tag = "notag") {
  const from = resolve(__dirname, '..', '..', 'examples', template)
  const cache = resolve(cachePath, `${template}-${pkgmgr}-${tag}`)
  const to = resolve(buildPath, `${template}-${pkgmgr}-${tag}`)
  const chksmPath = resolve(cache, '__chksm')

  const fromChksm = folderChksm(from)
  const cacheChksm = existsSync(chksmPath) && readFileSync(chksmPath, 'utf-8')

  if (fromChksm !== cacheChksm) {
    console.log(`Cache is stale. Creating new cache at ${cache}`)
    removeSync(cache)
    copySync(from, cache, { filter: file => !file.match(/\/node_modules|\/dist/) })
    writeFileSync(chksmPath, fromChksm)
    const npmInstall = pkgmgr === 'pnpm' ? 'pnpm install .' : 'npm install'
    execFileSync(npmInstall, { cwd: cache, shell: true, stdio: 'inherit' })
  }

  removeSync(to)
  copySync(cache, to)
  return to
}

async function clearCache() {
  emptyDirSync(cachePath)
}



function folderChksm(folder, depth = 0) {
  const ignores = ['node_modules', '.history']
  const startStamp = Date.now()

  let str = ''
  const files = readdirSync(folder)
  files
    .filter(file => !ignores.includes(file))
    .forEach(file => {
      const stats = statSync(resolve(folder, file))
      const isDir = stats.isDirectory()
      const modified = stats.mtimeMs
      const isPackageJson = file === 'package.json'
      const line = `${''.padStart(depth, ' ')}${file} ${isDir || isPackageJson ? '' : modified}`
      str = `${str}${line}\n`
      if (isDir)
        str = `${str}${folderChksm(resolve(folder, file), depth + 2)}`
    })

  const duration = Date.now() - startStamp
  if (duration > 10)
    console.log(`folderChksm generation took longer than expected for ${folder} generated in ${duration} ms`)

  return str
}








async function waitForServer(page, url, timeout = 20000) {
  const startTime = Date.now()
  while (Date.now() - startTime < timeout) {
    try {
      const response = await page.goto(url, { timeout: 1000 })
      if (response.ok()) {
        return response
      }
      await new Promise(resolve => setTimeout(resolve, 100))
    } catch (err) { }
  }
  throw new Error('Server never started')
}

function setBundler() {

}
