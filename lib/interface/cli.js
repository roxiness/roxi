#!/usr/bin/env node

const program = require('commander')
const { init } = require('./cli/init')
const { app } = require('./api')
const stdio = 'inherit'

const defaults = {
  devSPAPort: "5000"
}

program
  .command('dev')
  .option('-d, --debug', 'extra debugging')
  .option('-p, --port <port>', 'path/to/pages', defaults.devSPAPort)
  .action(program => {
    const options = program.opts()
    app(options)
  })

  .command('build')
  .action(program => {
    const options = program.opts()
    app(options)
  })

  .command('install')
  .action(program => {
    const options = program.opts()
    app(options)
  })

program
  .command('init')
  .action(async program => {
    const options = program.opts()
    const response = await init()
    console.log(response)
  })


program.parse(process.argv)
