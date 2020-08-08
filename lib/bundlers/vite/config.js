const { resolve } = require('path')
const { readFileSync } = require('fs-extra')
const svite = require('svite');
const template = readFileSync(__dirname + '/../shared/main.template.js', 'utf-8')
const {mergeWithUserConfig} = require('../../shared/userConfigs')

const svitePlugin = svite({
  svelte: mergeWithUserConfig('svelte', { preprocess: [] })
})


const viteConfig = {
  plugins: [svitePlugin],
  optimizeDeps: { include: ['roxi', 'svelte'] },
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


module.exports = mergeWithUserConfig('vite', viteConfig)
