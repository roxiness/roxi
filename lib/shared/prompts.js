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
      { message: 'pnpm', name: 'pnpm' },
      { message: 'npm', name: 'npm' },
      { message: 'Yarn', name: 'yarn' },
      { message: 'Yarn 2', name: 'yarn2' },
    ]
  },

  startNow: pkgMan => new Toggle({
    message: 'Want to start your app?',
    enabled: 'Yep!',
    disabled: 'Later',
    footer: `You can always start your app later with: ${pkgMan.startsWith('yarn') ? 'yarn dev' : 'npm run dev'}`
  }).run(),

  gitHost: {
    type: 'select',
    name: 'gitHost',
    message: 'Select a repo to configure',
    choices: [
      { message: 'Github', name: 'github' },
      { message: 'Gitlab', name: 'gitlab' },
      { message: 'none', name: 'none' },
    ]
  },

  packageJsonConfig: async ({ host, name }) => {
    const info = await getGitInfo()
    return {
      name: 'packageJsonConfigTemplate',
      type: 'snippet',
      message: 'Fill out package.json',
      footer: 'use arrow up and down to navigate fields',
      fields: [
        { name: 'name', initial: name },
        { name: 'description', initial: 'A Roxi app' },
        { name: 'gitName', initial: name },
        { name: 'version', initial: "1.0.0" },
        { name: 'author_name', initial: info['user.name'] },
        { name: 'author_email', initial: info['user.email'] },
      ],
      template: `{
      "name": "\${name}",
      "description": "\${description}",
      "version": "\${version}",
      "homepage": "https://${host}.com/\${username}/\${gitName}",
      "repository": "\${username}/\${gitName}",
      "author": "\${author_name} \${author_email} (https://${host}.com/\${username})",
      "license": "\${license:ISC}"
      }`
    }
  }
}

module.exports = { prompts }



function getGitInfo() {
  try {
    const config = {}
    const info = require('child_process').execSync('git config --list').toString()
    info.split("\n").map(line => line.split('=')).forEach(([key, val]) => config[key] = val)
    return config
  } catch (err) { return {} }
}
