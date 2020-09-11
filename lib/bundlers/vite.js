const { readFileSync } = require('fs-extra')
const vite = require('vite')
const body = readFileSync('public/__index.html', 'utf-8')
module.exports = { startVite }

async function startVite(options) {
  const mode = process.env.NODE_ENV
  const config = await vite.resolveConfig(mode, __dirname + '/config.js')
  await createServer(options, config)
}

async function createServer(options, config) {
  await vite.createServer({
    ...config,
    configureServer: [
      ...config.configureServer,
      ({ app }) => app.use(async (ctx, next) => {
        await next()
        if (ctx.url === '/index.html') {
          ctx.body = body.replace('__SCRIPT__', `<script type="module" defer src="/src/main.js"></script>`)
          ctx.status = 200
        }
      })
    ],
  })
    .listen(options.port)
  console.log('[Roxi] serving on http://localhost:' + options.port)
}
