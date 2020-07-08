const vite = require('vite')
const svite = require('svite')
const template = require('fs-extra').readFileSync(__dirname + '/main.template.js', 'utf-8')
module.exports.startVite = startVite

const plugins = [
  {
    transform (id, code){
      console.log(id)
    }
  }
]

async function startVite(options) {
  console.log('hello from vite')
  const mode = process.env.NODE_ENV
  const config = await vite.resolveConfig(mode, __dirname + '/config.js')
  if (mode === 'development') createServer(options, config)
  else build(options, config)
}

async function createServer(options, config) {
  vite.createServer({
    ...config,
    // configureServer: [roxiPlugin, ...config.configureServer],
  })
    .listen(3000)
}

async function build(options, config) {
  vite.build({
    ...config,
    // rollupInputOptions: { plugins },
    rollupOutputOptions: { plugins }
  })
}



// function roxiPlugin({ app, root }) {
//   app.use(async (ctx, next) => {
//     console.log('PATH', ctx.path)
//     // if(ctx.path.match('/_roxi'))
//     await next()
//   })
// }
