/// <reference path="../node_modules/roxi/typedef.js" />

/** @type {RoxiPlugin} */
module.exports.default = {
  hooks: [
    {
      event: 'config',
      action (app, params, ctx){
        // if (params.foo === 'bar') {
        //   app.config.rollup.someprop = 'foobar'
        // }
      }
    }
  ]
}
