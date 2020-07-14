const autoPreprocess = require('svelte-preprocess')

export default {
  svelte: (config, ctx, options) => ({
    ...config,
    preprocess: [].concat(autoPreprocess(options)),
    extensions: ['.svelte', '.md'],
  }),
  rollup: config => ({ ...config }),
  routify: config => ({ ...config })
}
