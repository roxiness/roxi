
import svelte from 'rollup-plugin-svelte-hot'

export default {
  hooks: [
    {
      event: 'start',
      action: async (app, params, ctx) => {
        const { production } = app.state

        const config = {
          dev: !production, // run-time checks
          hot: !production && { optimistic: true, noPreserveState: false },
          extensions: ['.svelte'],
          preprocess$options: {},
          preprocess$map: {}
        }

        app.merge({
          config: {
            svelte: config,
            rollup: {
              plugins$options: { svelte: config },
              plugins$map: { svelte }
            }
          }
        })
      }
    }
  ]
}
