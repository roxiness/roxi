module.exports = ctx => ({

  dev: !ctx.state.production, // run-time checks
  // Extract component CSS — better performance
  css: css => {
    css.write(`${ctx.config.roxi.buildDir}/bundle.css`);
  },
  hot: ctx.config.roxi.bundler === 'nollup',
  preprocess: [],
  extensions: ['.svelte']
})
