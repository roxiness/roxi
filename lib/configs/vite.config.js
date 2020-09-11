const { resolve } = require('path')
const { readFileSync } = require('fs-extra')
const svite = require('svite');
const template = readFileSync(__dirname + '/../shared/main.template.js', 'utf-8')
const { mergeWithUserConfig: merge } = require('../../shared/userConfigs')

const svelteConfig = { preprocess: [] }

const sviteConfig = {
  svelte: merge('svelte', svelteConfig)
}

const viteConfig = {
  plugins: [svite(merge('svite', sviteConfig))],
  optimizeDeps: { include: ['roxi', 'svelte'] },
  transforms: [
    {
      test: matchesFile('src/main.js'),
      transform: ({ code }) => code.replace('self.__ROXI', template)
    }
  ]
}

module.exports = merge('vite', viteConfig)

function matchesFile(relativePath) {
  const fullPath = resolve(process.cwd(), relativePath)
  return ({ id }) => [fullPath, `/${relativePath}`].includes(id)
}
