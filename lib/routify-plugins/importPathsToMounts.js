const path = require('path');
const { createNodeMiddleware } = require('@sveltech/routify/lib/utils/middleware')

module.exports = function (middlewares, payload, opts) {
  rootRelativeImportPath(middlewares)
  roxiProxy(middlewares)
  return middlewares
};

function rootRelativeImportPath(middlewares) {
  const middleware = createNodeMiddleware(({ file }) => {
    if (file.importPath) {
      file.importPath = path.relative(path.resolve(process.cwd()), file.absolutePath).replace(/\\/g, '/');
    }
  });

  const name = 'rootRelativeImportPath'
  const index = middlewares.findIndex((mw) => mw.name === 'generateFileTree');
  middlewares.splice(index + 1, 0, { name, middleware });
}

function roxiProxy(middlewares){
  middlewares.push({
    name: 'roxiProxy',
    middleware(payload){
      payload.template = payload.template.replace('@sveltech/routify/runtime', 'roxi/routify')
    }
  })
}
