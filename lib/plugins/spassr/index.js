/// <reference path="../../../typedef.js" />

/** @type {RoxiPlugin} */
module.exports.default = {
  name: 'spassr',
  hooks: [
    {
      event: 'start',
      condition: 'development',
      action: app => {
        const { production } = app.state
        const { staticDir, port, template, host, script } = app.config.roxi
        const spassr = {
          assetsDir: staticDir,
          entrypoint: template,
          ssrOptions: {
            inlineDynamicImports: true,
            dev: !production
          },
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

        const conf = {
          ...app.config.spassr,
          ...params
        }
        require('spassr').spassr(conf)
      }
    }
  ]
}
