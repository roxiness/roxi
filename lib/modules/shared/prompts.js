const path = require('path')
const { Toggle } = require('enquirer');

const prompts = {
  projectName: {
    type: 'input',
    name: 'projectName',
    message: 'What is the name of your project?',
    initial: path.basename(process.cwd())
  },

  hosting: {
    type: 'multiselect',
    name: 'hosting',
    message: 'What hosting features should be enabled?',
    choices: [
      { name: 'SSR', value: 'ssr' },
      { name: 'Dynamic imports', value: 'dynamicImports' },
      { name: 'Static export', value: 'staticExports' }
    ]
  },

  packages: {
    type: 'multiselect',
    name: 'packages',
    message: 'Which packages should be installed?',
    choices: [
      { name: 'Svench', value: 'svench' },
      { name: 'PostCSS', value: 'postcss' }
    ]
  },

  packageManager: {
    type: 'select',
    name: 'packageManager',
    message: 'package manager',
    choices: [
      { message: 'Yarn 2', name: 'yarn2' },
      { message: 'Yarn', name: 'yarn' },
      { message: 'npm', name: 'npm' },
    ]
  },

  startNow: pkgMan => new Toggle({
    message: 'Want to start your app?',
    enabled: 'Yep!',
    disabled: 'Later',
    footer: `You can always start your app later with: ${pkgMan.startsWith('yarn') ? 'yarn dev': 'npm run dev'}`
  }).run()
}

module.exports = { prompts }
