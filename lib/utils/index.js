/// <reference path="../../typedef.js" />

/**
 * converts 'foo' to
 *   { name: 'foo', params: {} }
 * and { bar: { baz: 123 } } to
 *   { name: 'bar', params: { baz: 123 } }
 * @param {string|object=} entry
 * @return {RoxiPluginConfig}
 */
function normalizePluginConfig(entry) {
  const isObj = typeof entry === 'object'
  const name = isObj ? Object.keys(entry)[0] : entry
  const params = isObj && entry[name] || {}
  return ({ name, params })
}

const isObject = v => v && typeof v === 'object' && !['Array', 'Date', 'Regexp'].includes(v.constructor.name)

/**
 * @template {{}} T
 * @template {{}} T2
 * @param {T} target
 * @param  {...T2} sources
 * @return {T&Partial<T2>} //jsdoc unaware of mutation - incorrectly wants partial T2
 */
function deepAssign(target, ...sources) {
  for (const source of sources) {
    for (const key of Reflect.ownKeys(source)) {
      const values = [source[key], target[key]]

      if (values.every(Array.isArray)) {
        target[key].push(...source[key])
      }
      else if (values.every(isObject)) {
        deepAssign(target[key], source[key])
      }
      else
        target[key] = source[key]
    }
  }
  return target
}

async function keysAsFunctions(obj, map) {
  const { log } = require('./log')
  const promises = Object.entries(obj).map(([key, value]) => {
    const isFn = !key.startsWith('_')
    const fnName = key.split('.')[0]
    const fn = map[fnName]

    if (!fn && isFn) log.info(
      `there's no map method named ${key}. Available methods: ${Object.keys(map)}.` +
      `\nRenaming to "_${key}" will hide this message.`
    )
    return fn ? fn(value) : value
  })
  return Promise.all(promises)
}

module.exports = {
  normalizePluginConfig,
  isObject,
  deepAssign,
  keysAsFunctions,
  ...require('./log')
}
