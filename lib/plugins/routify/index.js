module.exports.default = {
  name: 'routify',
  hooks: [
    {
      condition: 'router',
      action: async ctx => {
        const options = {
          routifyDir: '_roxi/.routify',
          dynamicImports: true,
          singleBuild: process.env.NODE_ENV === 'production'
        }
        await require(`@roxi/routify/lib/services/interface`).start(options)
      }
    }
  ]
}
