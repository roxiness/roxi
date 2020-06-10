const path = require('path')

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
    type: 'multiselect',
    name: 'package manager',
    choices: [
      {name: 'Yarn 2', value: 'yarn2'},
      {name: 'Yarn', value: 'yarn'},
      {name: 'npm', value: 'npm'},
    ]
  }
}

module.exports = { prompts }
