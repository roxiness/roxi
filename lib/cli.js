#!/usr/bin/env node

const program = require('commander')
const { create } = require('./create/create')
const { dev, build } = require('./bundlers')
const { optionsToEnv } = require('./utils/config')
const config = require('./shared/userConfigs').roxi

const defaults = {
  port: "5000",
  bundler: "nollup",
  staticDir: 'public',
  distDir: 'dist',
  ...config
}

program
  .command('dev')
  .option('-d, --debug', 'extra debugging')
  .option('-p, --port <port>', 'path/to/pages', defaults.port)
  .option('-b, --bundler <bundler>', 'rollup|nollup|vite', defaults.bundler)
  .action(program => {
    const options = {...defaults, ...program.opts()}
    optionsToEnv(options)
    dev(options)
  })

program
  .command('build')
  .option('-b, --bundler <bundler>', 'rollup|nollup|vite', defaults.bundler)
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
