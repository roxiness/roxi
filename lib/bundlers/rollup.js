const rollup = require('rollup')
const path = require('path');
const esm = require('esm')

async function startRollup(ctx) {
  const { rollup: options } = ctx.config
  const production = process.env.NODE_ENV === 'production'
  if (production) process.env.ROLLUP_WATCH = "true"

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


  //todo BUILD ROLLUP CONFIG
  console.log('ctx', ctx)

  // const configs = await esm(module)(path.resolve(__dirname, '..', 'configs/rollup.config.js'))
  // console.log(configs)







  // loadConfigFile(path.resolve(__dirname, '..', 'configs/rollup.config.js'), { format: 'es' })
  //   .then(async ({ options, warnings }) => {
  //     console.log(options)
  //     // "warnings" wraps the default `onwarn` handler passed by the CLI.
  //     // This prints all warnings up to this point:
  //     console.log(`We currently have ${warnings.count} warnings`);

  //     // This prints all deferred warnings
  //     warnings.flush();

  //     // options is an "inputOptions" object with an additional "output"
  //     // property that contains an array of "outputOptions".
  //     // The following will generate all outputs and write them to disk the same
  //     // way the CLI does it:
  //     options.forEach(async options => {
  //       const bundle = await rollup.rollup(options);
  //       await Promise.all(options.output.map(bundle.write));

  //       if (!production) {
  //         const watcher = rollup.watch(options);
  //         watcher.on('event', event => {
  //           if (event.code === 'BUNDLE_START')
  //             console.log('bundles...')
  //           if (event.code === 'BUNDLE_END')
  //             console.log(`bundle finished in ${event.duration} ms`)
  //         })
  //       }

  //     })
  //   })
}

module.exports = { startRollup }


