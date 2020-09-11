module.exports = ctx => ({
  serveSpa: true,
  serveSsr: true,
  spaPort: ctx.config.roxi.port,
  ssrPort: (Number(ctx.config.roxi.port) + 5).toString()
})
