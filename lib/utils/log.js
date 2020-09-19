const chalk = require('chalk')
const prefix = chalk.magenta('[roxi]')

const levels = {
  0: 'all',
  1: 'debug',
  2: 'info',
  3: 'warn',
  4: 'error',
  5: 'fatal',
  6: 'off',
  7: 'trace'
}




function logger(msg, type = 'info') {
  console.log(prefix, msg)
}

const log = {
  all: msg => logger(msg, 'all'),
  debug: msg => logger(msg, 'debug'),
  info: msg => logger(msg, 'info'),
  warn: msg => logger(msg, 'warn'),
  error: msg => logger(msg, 'error'),
  fatal: msg => logger(msg, 'fatal'),
  off: msg => logger(msg, 'off'),
  trace: msg => logger(msg, 'trace')
}


module.exports = { log }
