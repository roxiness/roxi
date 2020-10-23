
export default {
  dependencies: {
    'preprocess': () => import('../preprocess')
  },
  hooks: [
    {
      event: 'start',
      action: async (app, params) => {
        const postcssImport = (await import('postcss-import')).default
        const postcss = (await import('rollup-plugin-postcss')).default

        const postcssConfig = {
          plugins$map: { postcssImport },
          plugins$options: {
            postcssImport: {},
          }
        }

        app.merge({
          config: {
            // add postcss to the config
            postcss: postcssConfig,

            // rollup needs access
            rollup: {
              plugins$options: { postcss: postcssConfig },
              plugins$map: { postcss }
            },

            // and so does svelte preprocess
            svelte: {
              preprocess$options: {
                autoPreprocess: {
                  _postcss: postcssConfig,
                  defaults: { style: 'postcss' }
                }
              }
            }
          }
        })
      }
    }
  ]
}

