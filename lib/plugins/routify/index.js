module.exports.default = {
  name: 'routify',
  hooks: [
    {
      event: 'before:bundle',
      action: async (app, params) => {
        const options = {
          routifyDir: '_roxi/.routify',
          dynamicImports: true,
          singleBuild: process.env.NODE_ENV === 'production',
          ...params
        }
        await require(`@roxi/routify/lib/services/interface`).start(options)
      }
    }
  ]
}
