#!/usr/bin/env node

runCli()

async function runCli() {
  const program = require('commander')
  const { create } = require('./create/create')
  const { dev, build } = require('./bundlers')
  const ctx = await require('./context').createContext()
  const defaults = ctx.config.roxi


  program
    .command('dev')
    .option('-d, --debug', 'extra debugging')
    .option('-p, --port <port>', 'path/to/pages', defaults.port)
    .option('-b, --bundler <bundler>', 'rollup|nollup|vite', defaults.bundler)
    .action(program => {
      ctx.config.roxi = {...ctx.config.roxi, ...program.opts()}
      dev(ctx)
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
}
