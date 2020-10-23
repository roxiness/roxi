const chalk = require('chalk')
const prefix = chalk.magenta('[roxi]')
const color = {
  error: msg => chalk.bgRed.white(msg)
}

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
  msg = color[type] && color[type](msg) || msg
  msg = msg.replace(/--([^-]+)--/g, chalk.yellowBright('$1'))
  msg = msg.replace(/__([^_]+)__/g, chalk.italic('$1'))
  msg = msg.replace(/\*\*([^*]+)\*\*/g, chalk.bold('$1'))
  console.log(`${prefix}`, msg)
}

const log = {
  all: msg => logger(msg, 'all'),
  debug: msg => logger(msg, 'debug'),
  info: msg => logger(msg, 'info'),
  warn: msg => logger(chalk.yellow('[warn] ')+msg, 'warn'),
  error: msg => logger(msg, 'error'),
  fatal: msg => logger(msg, 'fatal'),
  off: msg => logger(msg, 'off'),
  trace: msg => logger(msg, 'trace')
}


module.exports = { log }
