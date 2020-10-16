/// <reference path="../../../typedef.js" />

import { mdsvex } from 'mdsvex'
const extension = ['.md', '.svx', '.svelte']

/** @type {RoxiPlugin} */
module.exports.default = {
  name: 'mdsvex',
  hooks: [
    {
      event: 'start',
      action: app => app.config.mdsvex = {}, //provide an mdsvex object for developers to modify
    },
    {
      event: 'before:bundle',
      action: (app, params) => {
        app.merge({
          config: {
            svelte: {
              preprocess: [
                mdsvex({
                  ...app.config.mdsvex,
                  ...params
                })
              ],
              extensions: params.extension
                || app.config.mdsvex.extension
                || extension
            }
          }
        })
      }
    }
  ]
}
