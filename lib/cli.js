#!/usr/bin/env node

const program = require('commander')
const { create } = require('./create/create')
const { dev, build } = require('./bundlers')
const { bundler } = require('./shared/userConfigs').roxi
const stdio = 'inherit'

const defaults = {
  devSPAPort: "5000",
  bundler: "nollup",
  staticDir: 'public',
}

program
  .command('dev')
  .option('-d, --debug', 'extra debugging')
  .option('-p, --port <port>', 'path/to/pages', defaults.devSPAPort)
  .option('-b, --bundler <bundler>', 'rollup|nollup|vite', bundler)
  .action(program => {
    const options = {...defaults, ...program.opts()}
    dev(options)
  })

program
  .command('build')
  .option('-b, --bundler <bundler>', 'rollup|nollup|vite', bundler)
  .action(program => {
    const options = program.opts()
    build(options)
  })

program
  .command('install')
  .action(program => {
    const options = program.opts()
    app(options)
  })


program
  .command('create <folder>')
  .option('-n --project-name <name>', 'name of project')
  .action((command, program) => {
    const options = program.opts()
    create({ ...options, folder: command })
  })

program
  .command('serve')
  .option('-b, --serve-spa', 'serve spa', true)
  .option('-s, --serve-ssr', 'serve SSR', true)
  .option('-B, --spa-port [port]', 'port serving spa app', '5000')
  .option('-S, --ssr-port [port]', 'port serving SSR app', '5005')
  .option('-q, --silent', 'port serving SSR app', false)
  .option('-a, --app [app]', 'app location', 'build/bundle.js')
  .action((program) => {
    require('spassr').spassr(program.opts())
  })

program.parse(process.argv)
