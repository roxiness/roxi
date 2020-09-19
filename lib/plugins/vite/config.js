const { resolve } = require('path')
const { readFileSync } = require('fs-extra')
const svite = require('svite');
const template = readFileSync(__dirname + '/../../shared/main.template.js', 'utf-8')


const svelteConfig = { preprocess: [] }

const sviteConfig = {
  svelte: svelteConfig
}

const viteConfig = {
  plugins: [svite(sviteConfig)],
  optimizeDeps: { include: ['roxi', 'svelte'] },
  transforms: [
    {
      test: matchesFile('src/main.js'),
      transform: ({ code }) => code.replace('self.__ROXI', template)
    }
  ]
}

module.exports = viteConfig

function matchesFile(relativePath) {
  const fullPath = resolve(process.cwd(), relativePath)
  return ({ id }) => [fullPath, `/${relativePath}`].includes(id)
}
