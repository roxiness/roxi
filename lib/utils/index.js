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

async function keysAsFunctionsRecursive(obj, suffix = '$map') {
  const maps = []

  // process all descendants' maps first
  const children = Object.entries(obj).map(([mapKey, value]) => {
    if (isObject(value)) {
      if (mapKey.endsWith(suffix))
        maps.push({ mapKey, value })
      else
        return keysAsFunctionsRecursive(value, suffix)
    }
  })
  await Promise.all(children)

  // process own maps. Need map instead of forEach for `await`
  await Promise.all(maps.map(async ({ mapKey, value }) => {
    const key = mapKey.substr(0, mapKey.length - suffix.length)
    const optionsKey = `${key}$options`
    const result = await keysAsFunctions(obj[optionsKey], value, key)
    delete obj[mapKey]
    delete obj[optionsKey]
    obj[key] = result
  }))

  return obj
}

/**
 * converts objects to arrays
 * each field value is parsed through a function from the map which corresponds to the field's key
 * map = { aPlugin: val => val + 'bar' }
 * obj = { aPlugin: 'foo', _n: 123 }
 * keysAsFunctions(obj, map) // ['foobar', 123]
 * @param {object} obj
 * @param {Object.<string, function>} map
 */
async function keysAsFunctions(obj, map, name) {
  if (!isObject(obj))
    throw new Error(`expected an object for "${name}", but got ${JSON.stringify(obj, null, 2)}`)
  const { log } = require('./log')
  const promises = Object.entries(obj).map(([key, value]) => {
    const isFn = !key.startsWith('_')
    const fnName = key.split('.')[0]
    const fn = map[fnName]

    if (!fn && isFn) log.info(
      `there's no map method named ${key}. Available methods: ${Object.keys(map)}.` +
      `\nRenaming to "_${key}" will hide this message.` +
      `\nvalue: ${JSON.stringify(value, null, 2)}` +
      `\nobj: ${JSON.stringify(obj, null, 2)}`
    )
    return fn && value ? fn(value) : value
  })
  return Promise.all(promises)
}


/** @param {{plugin: RoxiPlugin, hook: RoxiPluginHook}[]} hooks  */
function sortHooks(hooks) {
  const sortedHooks = []
  let lastLength = null
  let obstacles = []

  while (hooks.length) {
    if (hooks.length === lastLength)
      throw new Error('infinite loop in hook orderings ' + JSON.stringify(obstacles, null, 2))
    lastLength = hooks.length

    for (const index in hooks) {
      const hook = hooks[index]
      const pluginName = hook.plugin.name
      const orderings = [].concat(hook.hook.order || {})
      const isFirst = orderings.find(order => order.first)
      const isLast = orderings.find(order => order.last)
      const runAfter = orderings.map(order => order.after).filter(Boolean)
      const befores = orderings.map(order => order.before).filter(Boolean)

      const obstacle = hooks.find((obstacleHook, _index) => {
        // don't check against self (typeof index is string)
        if (index == _index) return false

        const obstacleOrderings = [].concat(obstacleHook.hook.order || {})
        const obstacleIsLast = obstacleOrderings.find(order => order.last)
        const obstacleIsFirst = obstacleOrderings.find(order => order.first)
        const obstaclerunsAfter = obstacleOrderings.map(order => order.after).filter(Boolean)

        if (
          runAfter.includes(obstacleHook.plugin.name)
          || (isLast && !obstacleIsLast && !obstaclerunsAfter.includes(pluginName))
          || (obstacleIsFirst && !isFirst && !befores.includes(obstacleHook.plugin.name))
          || obstacleOrderings.find(order => order.before === pluginName)
        )
          return true
    })

    if (obstacle) {
      obstacles.push({
        plugin: hook.plugin.name,
        obstacle: obstacle.plugin.name
      })
    } else {
      sortedHooks.push(hooks.splice(index, 1)[0])
      break;
    }
  }
}
return sortedHooks
}


module.exports = {
  sortHooks,
  normalizePluginConfig,
  isObject,
  deepAssign,
  keysAsFunctions,
  keysAsFunctionsRecursive,
  ...require('./log')
}
