const rollup = require('rollup')
import rollupTemplate from './rollup.template'
import rollupCompile from './rollup.compile'
import { spassr } from 'spassr'

export default {
  name: 'rollup',
  hooks: [
    {
      condition: 'start',
      action: rollupTemplate
    },
    {
      condition: 'end',
      action: rollupCompile
    },
    {
      condition: 'end',
      action: async (ctx, params) => {
        const { production } = ctx.state
        const options = ctx.config.rollup
        const isNollup = ctx.config.roxi.bundler === 'nollup'

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
          spassr(ctx.config.spassr)
      }
    }
  ]
}
