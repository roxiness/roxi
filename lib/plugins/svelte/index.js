export default {
  hooks: [
    {
      event: 'start',
      action: async (app, params, ctx) => {
        app.config.svelte = {
          extensions: []
        }
      }
    }
  ]
}
