const rollup = require('rollup')
import rollupTemplate from './rollup.template'
import rollupCompile from './rollup.compile'

export default {
  name: 'rollup',
  hooks: [
    {
      event: 'start',
      action: rollupTemplate
    },
    {
      event: 'bundle',
      action: rollupCompile
    },
    {
      event: 'bundle',
      condition,
      action: async (app, params, ctx) => {

        const options = app.config.rollup
        const bundle = await rollup.rollup(options);
        bundle.write(options.output)


        if (!app.state.production) {
          const watcher = rollup.watch(options);
          watcher.on('event', event => {
            if (event.code === 'BUNDLE_START')
              console.log('bundles...')
            if (event.code === 'BUNDLE_END')
              console.log(`bundle finished in ${event.duration} ms`)
          })
        }
      }
    }
  ]
}


function condition(app, params, ctx) {
  const runDev = !app.state.production && params.dev
  const runProd = app.state.production && params.prod !== false
  return runDev || runProd
}
