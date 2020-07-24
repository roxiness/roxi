const { resolve } = require('path')
const template = require('fs-extra').readFileSync(__dirname + '/../shared/main.template.js', 'utf-8')
const { mdsvex } = require('mdsvex');
const svite = require('svite');

const svitePlugin = svite({
  hot: false,
  svelte: {
    extensions: ['.svelte', '.md'],
    preprocess: [mdsvex({ extension: '.md' })]
  }
})

module.exports = {
  plugins: [svitePlugin],
  optimizeDeps: { include: ['roxi'] },
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
