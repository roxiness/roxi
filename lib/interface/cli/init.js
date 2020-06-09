const path = require('path');
const { prompt, MultiSelect } = require('enquirer');
const cfonts = require('cfonts')

module.exports.init = async function () {
  cfonts.say('ROXI', { align: 'center', gradient: ["#f66", "#55f"], font: 'tiny' })

  const response = await prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'What is the name of your project?',
      initial: path.basename(process.cwd())
    }, {
      type: 'multiselect',
      name: 'hosting',
      message: 'What hosting features should be enabled?',
      choices: [
        { name: 'SSR', value: 'ssr' },
        { name: 'Dynamic imports', value: 'dynamicImports' },
        { name: 'Static export', value: 'staticExports' }
      ]
    }, {
      type: 'multiselect',
      name: 'packages',
      message: 'Which packages should be installed?',
      choices: [
        { name: 'Svench', value: 'svench' },
        { name: 'PostCSS', value: 'postcss' }
      ]
    }
  ]);

  return response
}
