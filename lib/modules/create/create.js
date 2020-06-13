const { resolve } = require('path');
const cfonts = require('cfonts')
const { prompts } = require('../shared/prompts')
const axios = require('axios')
const { createWriteStream } = require('fs')
const admZip = require('adm-zip')
const { readdirSync, removeSync, ensureDirSync, statSync, copySync, writeFileSync } = require('fs-extra')
const execa = require('execa')
const ora = require('ora')
const { prompt } = require('enquirer')
let spin

const repo = 'https://github.com/sveltech/roxi-template'
const suffix = '/archive/master.zip'
const url = repo + suffix

async function create(options) {
  const { folder } = options

  const initialName = options.projectName || folder.replace(/\.\.\//g, '')
  cfonts.say('ROXI \n Get your rocks off', { align: 'center', gradient: ["#f66", "#55f"], font: 'tiny' })

  const { projectName } = options.projectName || await prompt({ ...prompts.projectName, initial: initialName });
  const { packageManager } = options.packageManager || await prompt(prompts.packageManager);
  const cmd = packageManager.startsWith('yarn') ? 'yarn' : 'npm'

  await cloneRepo(folder)
  await updatePackageJson(folder, projectName)
  await installDependencies(folder, packageManager, cmd)

  const startNow = await prompts.startNow(cmd)

  if (startNow) startDev(cmd, folder)
}

module.exports = { create }

function startDev(cmd, cwd) { execa(cmd, ['roxi', 'dev'], { cwd, stdio: 'inherit' }) }

/**
 * Download and unpack repo
 * @param {string} folder
 */
async function cloneRepo(folder) {
  const tempDir = folder + '-tmp'
  const tempPath = resolve(tempDir, 'roxi-template.zip')
  await ensureDirSync(tempDir)
  spin = ora('Downloading template').start()
  await download(url, tempPath)
  spin.succeed('Downloaded')
  const zip = new admZip(tempPath)
  spin = ora('Unpacking template').start()
  await zip.extractAllTo(tempDir)
  const unpackedBasename = readdirSync(tempDir).find(file => statSync(resolve(tempDir, file)).isDirectory())
  copySync(resolve(tempDir, unpackedBasename), folder)
  removeSync(tempDir)
  spin.succeed('Unpacked')
}

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

/**
 * Write name into package.json
 * @param {string} folder
 * @param {string} projectName
 */
async function updatePackageJson(folder, projectName) {
  const path = resolve(process.cwd(), folder, 'package.json')
  const json = require(path)
  json.name = projectName

  writeFileSync(path, JSON.stringify(json, null, 2))
}

/**
 * @param {string} folder
 * @param {'yarn'|'yarn2'|'npm'} pkgManager
 * @param {'yarn'|'npm'} cmd
 */
async function installDependencies(folder, pkgManager, cmd) {
  spin = ora('Installing dependencies - could be a while').start()
  const npm = require('npm')  // // const {execSync} = require('child_process')
  const cwd = resolve(process.cwd(), folder)

  if (pkgManager === 'yarn2')
    await execa('yarn', ['set', 'version', 'berry'], { cwd })

  const childProcess = execa(cmd, ['install'], { cwd })
  // childProcess.stdout.pipe(process.stdout)
  await childProcess

  spin.succeed('Installed dependencies')
}
