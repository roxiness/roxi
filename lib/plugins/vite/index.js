const vite = require('vite')
const svite = require('svite');
const { matchesFile, resolvePlugins } = require('./utils')
const { readFileSync, writeFileSync, ensureDirSync } = require('fs-extra')
const { parse } = require('node-html-parser')
const template = readFileSync(__dirname + '/../../shared/main.template.js', 'utf-8')

module.exports.default = {
  name: 'vite',
  hooks: [
    {
      event: 'start',
      action: (app, params, ctx) => ({
        config: {
          svite: {},
          vite: {
            plugins: [],
            optimizeDeps: { include: ['roxi', 'svelte'] },
            transforms: [
              {
                test: matchesFile('src/main.js'),
                transform: ({ code }) => code.replace('self.__ROXI', template)
              }
            ]
          }
        }
      })
    },
    {
      event: 'bundle',
      action: app => {
        const svelte = app.config.svelte
        app.config.vite.plugins.push(svite({ ...app.config.svite, svelte }))
      }
    },
    {
      event: 'bundle',
      action: async (app, params, ctx) => {
        const body = readFileSync('public/__index.html', 'utf-8')
        const port = params.port || app.config.roxi.port
        const config = resolvePlugins(app.config.vite)

        await vite.createServer({
          ...config,
          configureServer: [
            ...config.configureServer,
            ({ app }) => app.use(async (ctx, next) => {
              await next()
              if (ctx.url === '/index.html') {
                const html = parse(body)
                html.querySelector('#__ROXI').setAttribute('src', '/src/main.js')
                ctx.body = html.toString()
                ctx.status = 200
              }
            })
          ],
        })
          .listen(port)
        console.log('[Roxi] serving on http://localhost:' + port)
      }
    }
  ]
}
