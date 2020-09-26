/// <reference path="../../../typedef.js" />
const { spassr } = require('spassr')

/** @type {RoxiPlugin} */
module.exports.default = {
  name: 'spassr',
  hooks: [
    {
      event: 'start',
      condition: 'development',
      action: app => app.config.rollup.writeConfig = true
    },
    {
      event: 'after:bundle',
      condition: 'development',
      action: (app, params) => {
        const { staticDir, port, template, host, script } = app.config.roxi

        spassr({
          assetsDir: staticDir,
          port: params.port || port,
          entrypoint: template,
          inlineDynamicImports: true,
          host: params.host || host,
          script,
          ssr: params.ssr
        })
      }
    }
  ]
}
