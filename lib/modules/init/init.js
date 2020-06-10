const path = require('path');
const { prompt } = require('enquirer');
const cfonts = require('cfonts')
const { prompts } = require('../shared/prompts')

module.exports.init = async function () {
  cfonts.say('ROXI - Get your rocks off', { align: 'center', gradient: ["#f66", "#55f"], font: 'tiny' })

  const response = await prompt([
    prompts.projectName
  ]);

  return response
}
