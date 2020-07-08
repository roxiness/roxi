

async function cloneRepo({ config }) {
  require('ora')('Downloading template in background').start().succeed()
  const { resolve } = require('path');
  const { download } = require('../utils/download')
  const { readdirSync, removeSync, ensureDirSync, statSync, copySync } = require('fs-extra')
  const admZip = require('adm-zip')

  const repo = 'https://github.com/sveltech/roxi-template'
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


async function installDependencies({ config }) {
  const execa = require('execa')
  const { resolve } = require('path');
  const ora = require('ora')

  const { folder, pkgManager, cmd } = config

  let spinner = ora('Installing dependencies in background').start().succeed()

  const cwd = resolve(process.cwd(), folder)

  try {
    if (pkgManager === 'yarn2')
      await execa('yarn', ['set', 'version', 'berry'], { cwd })
    await execa(cmd, ['install'], { cwd })
    spinner = ora('Installeded dependencies').start().succeed()
  } catch (err) {
    console.log("")
    spinner.fail('Could not install dependencies:');
    spinner.fail(err.shortMessage);
    setTimeout(process.exit, 0)
    throw (err.message)
  }
}



module.exports = { cloneRepo, installDependencies }

