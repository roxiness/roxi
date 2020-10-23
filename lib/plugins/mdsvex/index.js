/// <reference path="../../../typedef.js" />

import { mdsvex } from 'mdsvex'

/** @type {RoxiPlugin} */
module.exports.default = {
  name: 'mdsvex',
  hooks: [
    {
      event: 'start',
      action: (app, params) => {
        const extension = params.extension || '.md'

        //provide an mdsvex object for developers to modify
        const conf = { extension, ...params }


        app.merge({
          config: {
            mdsvex: conf,
            svelte: {
              preprocess$options: { mdsvex: conf },
              preprocess$map: { mdsvex },
              extensions: [extension]
            }
          }
        })
      }
    },
  ]
}
