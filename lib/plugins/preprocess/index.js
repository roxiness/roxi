import autoPreprocess from 'svelte-preprocess'

export default {
  hooks: [
    {
      event: 'start',
      action: app => {
        app.merge({
          config: {
            svelte: {
              preprocess$options: { autoPreprocess: {} },
              preprocess$map: { autoPreprocess }
            }
          }
        })
      }
    }
  ]
}
