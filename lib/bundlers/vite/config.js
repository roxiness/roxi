const { resolve } = require('path')
const template = require('fs-extra').readFileSync(__dirname + '/main.template.js', 'utf-8')
const svite = require('svite');

const svitePlugin = svite({
  logLevel: 'debug',
  useTransformCache: false
})

module.exports = {
  plugins: [svitePlugin],
  optimizeDeps: {
    include: [
      '@sveltech/routify/runtime/plugins/tree',
      '@sveltech/routify/runtime/plugins/assignAPI',
      '@sveltech/routify/runtime',
    ],
  },
  alias: {
    '/main.js': resolve(process.cwd(), 'src/main.js')
  },
  transforms: [
    {
      // transform main.js
      test: matchesFile('src/main.js'),
      transform: ({ code }) => code.replace('self.__ROXI', template)
    },
    {
      test: matchesFile('index.html'),
      transform: ({ code }) => code.replace('__SCRIPT__', '<script type="module" src="/src/main.js"></script>')
    }
  ]
};


function matchesFile(relativePath) {
  return function ({ id }) {
    const fullPath = resolve(process.cwd(), relativePath)
    // console.log(id)
    // console.log(fullPath)
    return [fullPath, `/${relativePath}`].includes(id)
  }
}
