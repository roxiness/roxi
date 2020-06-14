/**
 * @typedef {Object} StepRunnerStep
 * @prop {String} name
 * @prop {WaitFor} [waitFor]
 * @prop {(StepRunnerPayload)=>{}} [condition]
 * @prop {StepRunnerCallback} callback
 *
 * @typedef {string|string[]|false} WaitFor
 *
 * @callback StepRunnerCallback
 * @param {StepRunnerPayload} payload
 * @returns {Promise|any}
 *
 * @typedef {Object} NamedPromise
 * @prop {String} name
 * @prop {Promise} promise
 *
 * @typedef {Object} StepRunnerPayload
 * @prop {Object} state
 * @prop {Object} config
 * @prop {NamedPromise[]} promises
 */

/**
 *
 * @param {StepRunnerStep[]} steps
 */
async function stepRunner(steps) {
  /** @type {StepRunnerPayload} */
  let payload = {
    state: {},
    config: {},
    promises: []
  }
  for (const step of steps) {
    const { name, waitFor, condition, callback } = step
    await resolveWaitFor(waitFor, payload.promises)
    const shouldRunStep = !condition || condition(payload)
    const promise = shouldRunStep && callback(payload)
    payload.promises.push({ name, promise })
  }
}

/**
 *
 * @param {WaitFor} waitFor
 * @param {NamedPromise[]} promises
 */
function resolveWaitFor(waitFor, promises) {
  const assert = require('assert')
  if (Array.isArray(waitFor)) {
    const matchingPromises = promises.filter(p => waitFor.includes(p.name)).map(p => p.promise)
    assert(matchingPromises.length === waitFor.length, 'step had missing promises')
    return Promise.all(matchingPromises)
  }
  if (typeof waitFor === 'string') {
    const matchingPromise = promises.find(p => p.name === waitFor)
    assert(matchingPromise, 'no matching promise was found for ' + waitFor)
    return matchingPromise.promise
  }
  if (waitFor === false)
    return true
  else if (promises.length)
    return promises[promises.length - 1].promise
}


module.exports.stepRunner = stepRunner
