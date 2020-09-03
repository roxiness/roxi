/**
 * converts
 * [
 *   'foo',
 *   bar: {baz: 123}
 * ]
 * to
 * [
 *   {name: 'foo', fields: {}},
 *   {name: 'bar', fields: {baz: 123}},
 * ]
 * @param {(string|object)[]=} array
 * @returns {import("../shared/userConfigs").NamedObject[]}
 */
function normalizeYamlArray(array = []) {
  return array.map(entry => {
    const isObj = typeof entry === 'object'
    const name = isObj ? Object.keys(entry)[0] : entry
    const fields = isObj ? entry[name] : {}
    return ({ name, fields })
  })
}

module.exports = {
  normalizeYamlArray
}
