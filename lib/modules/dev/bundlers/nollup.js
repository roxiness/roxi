async function startNollup() {
  process.env.NOLLUP = true
  process.env.ROLLUP_WATCH = true
  const {input, output} = require('../overlay/rollup.config').default
  const bundle = await require('nollup')(input)
  await bundle.generate(output);

  // let nollupDevServer = require('nollup/lib/dev-middleware');
  // let config = require('./rollup.config.js');

  // // Your express code
  // const app = express()
  // app.use(nollupDevServer(app, config, {
  //   watch: './src',
  //   hot: true,
  //   verbose: false
  // }));
}

module.exports = { startNollup }
