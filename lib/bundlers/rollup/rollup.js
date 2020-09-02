const rollup = require('rollup')
const path = require('path');
const loadConfigFile = require('rollup/dist/loadConfigFile');



async function startRollup() {
  const production = process.env.NODE_ENV === 'production'
  if (production) process.env.ROLLUP_WATCH = "true"
  // load the config file next to the current script;
  // the provided config object has the same effect as passing "--format es"
  // on the command line and will override the format of all outputs
  loadConfigFile(path.resolve(__dirname, 'configs/rollup.config.js'), { format: 'es' })
    .then(async ({ options, warnings }) => {
      // "warnings" wraps the default `onwarn` handler passed by the CLI.
      // This prints all warnings up to this point:
      console.log(`We currently have ${warnings.count} warnings`);

      // This prints all deferred warnings
      warnings.flush();

      // options is an "inputOptions" object with an additional "output"
      // property that contains an array of "outputOptions".
      // The following will generate all outputs and write them to disk the same
      // way the CLI does it:
      options.forEach(async options => {
        const bundle = await rollup.rollup(options);
        await Promise.all(options.output.map(bundle.write));

        if (!production) {
          const watcher = rollup.watch(options);
          watcher.on('event', event => {
            if (event.code === 'BUNDLE_START')
              console.log('bundles...')
            if (event.code === 'BUNDLE_END')
              console.log(`bundle finished in ${event.duration} ms`)
          })
        }

      })
    })
}

module.exports = { startRollup }


