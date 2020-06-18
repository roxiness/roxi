const rollup = require('rollup')
const nollup = require('nollup')
const path = require('path');
const loadConfigFile = require('rollup/dist/loadConfigFile');

async function startNollup() {
  process.env.NOLLUP = true
  process.env.ROLLUP_WATCH = true
  // load the config file next to the current script;
  // the provided config object has the same effect as passing "--format es"
  // on the command line and will override the format of all outputs
  loadConfigFile(path.resolve(__dirname, 'rollup.config.js'), { format: 'es' })
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
        const bundle = await nollup(options)
        await bundle.generate(options.output);
      })
    })
}
  module.exports = { startNollup }
