/**
 * converts
 * [
 *   'foo',
 *   { bar: {baz: 123} }
 * ]
 * to
 * [
 *   {name: 'foo', params: {}},
 *   {name: 'bar', params: {baz: 123}},
 * ]
 * @param {(string|object)[]=} array
 */
function normalizeYamlArray(array = []) {
  return array.map(entry => {
    const isObj = typeof entry === 'object'
    const name = isObj ? Object.keys(entry)[0] : entry
    const params = isObj && entry[name] || {}
    return ({ name, params })
  })
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

module.exports = {
  normalizeYamlArray,
  isObject,
  deepAssign,
  ...require('./log')
}
