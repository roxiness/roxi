const rollup = require('rollup')
import rollupTemplate from './rollup.template'

export default {
  name: 'rollup',
  hooks: [
    {
      event: 'start',
      order: { first: true },
      action: rollupTemplate
    },
    {
      event: 'bundle',
      condition: app => app.state.production || app.config.rollup.writeConfig,
      action: async (app, params, ctx) => {
        const options = { ...app.config.rollup }
        delete options.compileConfig
        delete options.writeConfig

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
