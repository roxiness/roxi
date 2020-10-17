export default {
  hooks: [
    {
      event: 'start',
      action: async (app, params, ctx) => {
        app.merge({
          config: {
            svelte: {
              extensions: ['.svelte'],
              preprocess: {},
              preprocess$map: {}
            }
          }
        })
      }
    }
  ]
}
