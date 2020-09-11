/**
 * converts
 * [
 *   'foo',
 *   bar: {baz: 123}
 * ]
 * to
 * [
 *   {name: 'foo', params: {}},
 *   {name: 'bar', params: {baz: 123}},
 * ]
 * @param {(string|object)[]=} array
 * @returns {import("../shared/context").NamedObject[]}
 */
function normalizeYamlArray(array = []) {
  return array.map(entry => {
    const isObj = typeof entry === 'object'
    const name = isObj ? Object.keys(entry)[0] : entry
    const params = isObj ? entry[name] : {}
    return ({ name, params })
  })
}

module.exports = {
  normalizeYamlArray
}
