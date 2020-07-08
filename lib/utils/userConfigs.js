require = require("esm")(module/*, options*/)
const { parse } = require('yaml')
const { readFileSync, existsSync } = require('fs-extra')

const wrappersPath = process.cwd() + '/_roxi/config.wrappers.js'
const roxiConfigPath = process.cwd() + '/_roxi/roxi.config.yaml'
const wrapperExists = existsSync(wrappersPath)
const roxiConfigExists = existsSync(roxiConfigPath)


module.exports = {
  wrappers: wrapperExists ? require(wrappersPath).default : {},
  roxi: roxiConfigExists ? parse(readFileSync(roxiConfigPath, 'utf-8')) : {}
}
