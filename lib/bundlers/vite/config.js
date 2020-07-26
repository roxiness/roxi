const { resolve } = require('path')
const { readFileSync } = require('fs-extra')
const template = readFileSync(__dirname + '/../shared/main.template.js', 'utf-8')
const userConfig = require('../../utils/userConfigs')
const svite = require('svite');
const { mergeConfigs } = require('../../utils/config');

const svitePlugin = svite({
  hot: false,
  svelte: mergeConfigs('svelte', {}, userConfig)
})


const viteConfig = {
  plugins: [svitePlugin],
  optimizeDeps: { include: ['roxi', 'svelte'] },
  alias: {
    // '/main.js': resolve(process.cwd(), 'src/main.js')
  },
  transforms: [
    {
      // transform main.js
      test: matchesFile('src/main.js'),
      transform: ({ code }) => code.replace('self.__ROXI', template)
    }
  ]
}


function matchesFile(relativePath) {
  return function ({ id }) {
    const fullPath = resolve(process.cwd(), relativePath)
    return [fullPath, `/${relativePath}`].includes(id)
  }
}


module.exports = mergeConfigs('vite', viteConfig, userConfig)
