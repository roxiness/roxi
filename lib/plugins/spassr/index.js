/// <reference path="../../../typedef.js" />

/** @type {RoxiPlugin} */
module.exports.default = {
  name: 'spassr',
  hooks: [
    {
      event: 'start',
      condition: 'development',
      action: app => {
        const { staticDir, port, template, host, script } = app.config.roxi
        const spassr = {
          assetsDir: staticDir,
          entrypoint: template,
          inlineDynamicImports: true,
          port,
          host,
          script,
          ssr: false
        }
        // save the spassr defaults to to app.config.spassr
        app.merge({ config: { spassr } })

        // tell the rollup plugin that we need to write a bundle
        app.config.rollup.writeConfig = true

        // save to this to help typescript / jsdoc
        this.template = spassr
      }
    },
    {
      event: 'after:bundle',
      condition: 'development',
      action: (app, params) => {
        // run spassr. Params are from roxi.config.yaml

        require('spassr').spassr({

          ...app.config.spassr,
          ...params
        })
      }
    }
  ]
}
