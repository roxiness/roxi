const { resolve } = require('path');
const { prompt } = require('enquirer');
const cfonts = require('cfonts')
const { prompts } = require('../shared/prompts')
const axios = require('axios')
const { createWriteStream } = require('fs')
const admZip = require('adm-zip')
const { readdirSync, removeSync, rmdirSync, ensureDirSync, statSync, moveSync, renameSync, copySync } = require('fs-extra')
const signale = require('signale')

const repo = 'https://github.com/sveltech/roxi-template'
const suffix = '/archive/master.zip'
const url = repo + suffix

async function create(options) {
  const folder = options.command
  const initialName = options.projectName || folder
  cfonts.say('ROXI \n Get your rocks off', { align: 'center', gradient: ["#f66", "#55f"], font: 'tiny' })


  const projectName = await prompt({ ...prompts.projectName, initial: initialName });
  const response = await prompt(prompts.packageManager);

  cloneRepo(folder)
}

module.exports = { create }



async function cloneRepo(folder) {
  const tempDir = folder + '-tmp'
  const tempPath = resolve(tempDir, 'roxi-template.zip')
  await ensureDirSync(tempDir)
  signale.wait('Downloading template')
  await download(url, tempPath)
  const zip = new admZip(tempPath)
  signale.wait('Unpacking template')
  await zip.extractAllTo(tempDir)
  const unpackedBasename = readdirSync(tempDir).find(file => statSync(resolve(tempDir, file)).isDirectory())
  copySync(resolve(tempDir, unpackedBasename), folder)
  removeSync(tempDir)
}



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

async function unzip(from, to) {
  yauzl
}
