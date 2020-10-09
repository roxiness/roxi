export default {
  hooks: [
    {
      condition: 'start',
      action: app => app.config.autoPreprocess = {}
    },
    {
      condition: 'before:bundle',
      action: async (app, params) => {
        const autoPreprocess = (await import('svelte-preprocess')).default

        app.merge({
          config: {
            svelte: {
              preprocess: [
                autoPreprocess(app.config.autoPreprocess)
              ]
            }
          }
        })
      }
    }
  ]
}
