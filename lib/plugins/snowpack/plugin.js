// "@prefresh/snowpack": This plugin adds automatic HMR for Preact applications.
module.exports = function createPlugin(snowpackConfig, pluginOptions) {
  return {
    /**
     * transform() - Transform web assets (JS, CSS, or HTML). Useful for
     * post-processing or adding functionality into your web app.
     */
    async transform({ contents, urlPath, isDev }) {
      console.log(urlPath)
      if (urlPath === '/') {
        return { result: contents.replace('/src/main.js', '/_dist_/main.js') }
      }
      if (urlPath = '/_dist_/main.js') {
        const template = require('fs-extra').readFileSync(__dirname + '../shared/main.template.js', 'utf-8')
        return { result: contents.replace('self.__ROXI', template) }
      }
      if (urlPath.match('routes.js')) {
        console.log('matches routes.js')
        return {
          result: contents.replace(
            '@roxi/routify/runtime/buildRoutes',
            'roxi/routify'
          )
        }
      }
    },
  };
};
