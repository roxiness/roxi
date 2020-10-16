
export default {
  dependencies: {
    'preprocess': () => import('../preprocess')
  },
  hooks: [
    {
      event: 'start',
      action: async (app, params) => {
        const postcssImport = (await import('postcss-import')).default
        app.merge({
          config: {
            postcss: {
              pluginsMap: { postcssImport },
              plugins: {
                postcssImport: {}
              }
            }
          }
        })
      }
    },
    {
      event: 'before:bundle',
      action: async (app, params) => {
        const { keysAsFunctions } = (await import('../../utils'))
        const { plugins, pluginsMap } = app.config.postcss
        const postcss = (await import('rollup-plugin-postcss')).default
        const autoPreprocess = (await import('svelte-preprocess')).default
        app.config.postcss.plugins = await keysAsFunctions(plugins, pluginsMap)
        delete app.config.postcss.pluginsMap

        app.merge({
          config: {
            rollup: {
              pluginsMap: { postcss },
              plugins: {
                postcss: app.config.postcss
              }
            },
            svelte: {
              preprocess: [
                autoPreprocess({
                  postcss: app.config.postcss,
                  defaults: { style: 'postcss' }
                })
              ]
            }
          }
        })
      }
    }
  ]
}

