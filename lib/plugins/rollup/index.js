const rollup = require('rollup')
import rollupTemplate from './rollup.template'
import rollupCompile from './rollup.compile'
import { spassr } from 'spassr'

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
      action: async (app, params) => {
        const { production } = app.state
        const options = app.config.rollup
        const isNollup = app.config.roxi.bundler === 'nollup'

        const bundle = await rollup.rollup(options);

        if (!production) {
          const watcher = rollup.watch(options);
          watcher.on('event', event => {
            if (event.code === 'BUNDLE_START')
              console.log('bundles...')
            if (event.code === 'BUNDLE_END')
              console.log(`bundle finished in ${event.duration} ms`)
          })
        }

        if (!production && !isNollup)
          spassr(app.config.spassr)
      }
    }
  ]
}


function condition(app, params, ctx) {
  const runDev = !app.state.production && params.dev
  const runProd = app.state.production && params.prod
  return runDev || runProd
}
