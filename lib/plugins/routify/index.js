module.exports.default = {
  name: 'routify',
  hooks: [
    {
      event: 'before:bundle',
      action: async (app, params) => {
        const options = {
          routifyDir: '_roxi/.routify',
          dynamicImports: true,
          singleBuild: app.state.production,
          ...params
        }
        await require(`@roxi/routify/lib/services/interface`).start(options)
      }
    }
  ]
}
