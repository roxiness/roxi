import { mdsvex } from 'mdsvex'

export default {
  svelte: config => ({
    ...config,
    preprocess: mdsvex({ extension: '.md' }),
    extensions: ['.svelte', '.md'],
  }),
  rollup: config => ({ ...config }),
  routify: config => ({ ...config })
}
