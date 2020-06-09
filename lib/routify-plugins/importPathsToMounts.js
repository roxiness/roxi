const path = require('path');
const { createNodeMiddleware } = require('@sveltech/routify/lib/utils/middleware')

module.exports = function (middlewares, payload, opts) {
  roxiProxy(middlewares)
  return middlewares
};
function roxiProxy(middlewares){
  middlewares.push({
    name: 'roxiProxy',
    middleware(payload){
      payload.template = payload.template.replace('@sveltech/routify/runtime/buildRoutes', 'roxi/routify')
      payload.template = payload.template.replace(/[./]+\/src\/pages/g, 'src/pages')
    }
  })
}
