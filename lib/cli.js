#!/usr/bin/env node

const program = require('commander')
const { init } = require('./modules/init/init')
const { create } = require('./modules/create/create')
const { dev } = require('./modules/dev/dev')
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
    dev(options)
  })

program
  .command('build')
  .action(program => {
    const options = program.opts()
    app(options)
  })

program
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

program
  .command('create <folder>')
  .option('-n --project-name <name>', 'name of project')
  .action((command, program) => {
    const options = program.opts()
    create({...options, folder: command})
  })


program.parse(process.argv)
