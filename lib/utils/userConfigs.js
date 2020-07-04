require = require("esm")(module/*, options*/)
const { parse } = require('yaml')
const { readFileSync } = require('fs-extra')

module.exports.wrappers = require(process.cwd() + '/_roxi/config.wrappers.js').default
module.exports.roxi = parse(readFileSync(process.cwd() + '/_roxi/roxi.config.yaml', 'utf-8'))
