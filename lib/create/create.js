const { resolve } = require('path');
const cfonts = require('cfonts')
const { prompts } = require('../shared/prompts')

const { readdirSync, removeSync, ensureDirSync, statSync, copySync, writeFileSync } = require('fs-extra')
const execa = require('execa')
const { prompt } = require('enquirer')
const { stepRunner } = require('../shared/stepRunner')
const { cloneRepo, installDependencies } = require('./steps')
const { updateJSON } = require('../utils/updateJson')




async function create(options) {

  /**
   *  @type {import('../shared/stepRunner').StepRunnerStep[]}
   *  @description prefix prompt steps with "prompt". Eg. "name: 'promptPlugins'"
   * */
  const steps = [
    {
      name: 'setInitialConfig',
      callback: payload => {
        payload.config = {
          ...options,
          initialName: options.projectName || options.folder.replace(/\.\.\//g, ''),
          packageJsonConfig: {}
        }
      }
    },
    {
      name: 'greeting',
      waitFor: false,
      callback: () => cfonts.say('ROXI \n Get your rocks off', { align: 'center', gradient: ["#f66", "#55f"], font: 'tiny' })
    },
    {
      name: 'cloneRepo',
      idleMsg: 'cloning repo',
      succeedMsg: 'cloned repo',
      waitFor: false,
      callback: cloneRepo
    },
    {
      name: 'setInitialPackageJson',
      callback: ({ config }) => updateJSON(`${config.folder}/package.json`, json => (json.name = json.name + Date.now()) && json)
    },
    {
      name: 'promptPackageManager',
      waitFor: 'cloneRepo',
      condition: ({ config }) => !config.packageManager,
      callback: async ({ config }) => { config.packageManager = (await prompt(prompts.packageManager)).packageManager }
    },
    {
      name: 'setCmd',
      callback: ({ config }) => { config.cmd = config.packageManager.replace('yarn2', 'yarn') }
    },
    {
      name: 'installDeps',
      idleMsg: 'installing dependencies',
      succeedMsg: 'installed dependencies',
      callback: installDependencies
    },
    {
      name: 'promptGitHost',
      waitFor: 'setCmd',
      callback: async ({ config }) => { config.gitHost = (await prompt(prompts.gitHost)).gitHost }
    },
    {
      name: 'promptGitPackageConfig',
      condition: ({ config }) => config.gitHost !== 'none',
      callback: async ({ config }) => {
        const { gitHost: host, initialName: name } = config
        const { packageJsonConfigTemplate } = await prompt(await prompts.packageJsonConfig({ host, name }))
        config.packageJsonConfig = (JSON.parse(packageJsonConfigTemplate.result))
      }
    },
    {
      name: 'promptStartWhenReady',
      callback: async ({ config }) => { config.startWhenReady = await prompts.startNow(config.cmd) }
    },
    {
      name: 'updatePackageJson',
      callback: ({ config }) => {
        const path = resolve(process.cwd(), config.folder, 'package.json')
        const json = require(path)
        json.name = config.projectName
        writeFileSync(path, JSON.stringify(json, null, 2))
      }
    },
    {
      name: 'waitForInstall',
      waitFor: ['installDeps', 'promptStartWhenReady'],
      callback: x => x
    },
    {
      name: 'startDev',
      condition: ({ config }) => !!config.startWhenReady,
      callback: ({ config }) => execa(config.cmd, ['run', 'dev'], { cwd: config.folder, stdio: 'inherit' })
    }
  ]

  stepRunner(steps)
}

module.exports = { create }
