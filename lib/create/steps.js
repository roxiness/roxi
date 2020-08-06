

async function cloneRepo({ config }) {
  const { resolve } = require('path');
  const { download } = require('../utils/download')
  const { readdirSync, removeSync, ensureDirSync, statSync, copySync } = require('fs-extra')
  const admZip = require('adm-zip')

  const repo = 'https://github.com/roxiness/roxi-template'
  const suffix = '/archive/master.zip'
  const url = repo + suffix

  const { folder } = config
  const tempDir = folder + '-tmp'
  const tempPath = resolve(tempDir, 'roxi-template.zip')
  await ensureDirSync(tempDir)
  await download(url, tempPath)
  const zip = new admZip(tempPath)
  await zip.extractAllTo(tempDir)
  const unpackedBasename = readdirSync(tempDir).find(file => statSync(resolve(tempDir, file)).isDirectory())
  copySync(resolve(tempDir, unpackedBasename), folder)
  removeSync(tempDir)
}


async function installDependencies({ config, state }) {
  const execa = require('execa')
  const { resolve } = require('path');
  const { folder, pkgManager, cmd } = config
  const cwd = resolve(process.cwd(), folder)

  try {
    if (pkgManager === 'yarn2')
      await execa('yarn', ['set', 'version', 'berry'], { cwd })
    await execa(cmd, ['install'], { cwd })
  } catch (err) {
    setTimeout(process.exit, 0)
    throw (err.message)
  }
}



module.exports = { cloneRepo, installDependencies }

