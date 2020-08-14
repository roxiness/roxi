const ora = require('ora')
const assert = require('assert')

/**
 * @typedef {Object} StepRunnerStep
 * @prop {String} name
 * @prop {WaitFor} [waitFor]
 * @prop {(StepRunnerPayload)=>{}} [condition]
 * @prop {StepRunnerCallback} callback
 * @prop {String=} idleMsg
 * @prop {String=} succeedMsg
 * @prop {Promise=} _promise
 * @prop {Boolean=} _printed
 *
 * @typedef {string|string[]|false} WaitFor
 *
 * @callback StepRunnerCallback
 * @param {StepRunnerPayload} payload
 * @returns {Promise|any}
 *
 * @typedef {Object} StepRunnerPayload
 * @prop {Object} state
 * @prop {Object} config

 * @prop {StepRunnerStep} prev
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
    prev: null
  }
  for (const step of steps) {
    const { name, waitFor, condition, callback } = step

    await resolveWaitFor(waitFor, steps, payload.prev)
    if (!condition || condition(payload)) {
      step._promise = callback(payload) || {}
      if (step._promise.then)
        step._promise.then(() => { step._promise['resolved'] = true })
      else
        step._promise['resolved'] = true
      payload.prev = step
    }
  }
}


/**
 *
 * @param {WaitFor} waitFor
 * @param {StepRunnerStep[]} steps
 */
async function resolveWaitFor(waitFor, steps, prev) {
    if (waitFor === false)
      return true
    else if (typeof waitFor === 'undefined')
      return prev && prev._promise
    else {
      const waitFors = [].concat(waitFor)
      const _steps = steps.filter(step => waitFors.includes(step.name))

      assert.equal(_steps.length, waitFors.length, 'step had missing promises')

      displayIdleMsg(_steps)
      await Promise.all(_steps.map(step => step._promise))
      return 'waitfors' + waitFors
    }
}

/**
 * Iterate through steps recursively
 * first print all resolveSteps' succeed msg first
 * then print unresolvedSteps' idle msg
 * @param {StepRunnerStep[]} steps
 */
async function displayIdleMsg([...steps]) {
  const resolvedStepIndex = steps.findIndex(step => step._promise['resolved'] && !step._printed && step.succeedMsg)
  const unresolvedStepIndex = steps.findIndex(step => !step._promise['resolved'] && !step._printed && step.idleMsg)

  // print all resolved steps first
  if (resolvedStepIndex > -1) {
    const step = steps.splice(resolvedStepIndex, 1)[0]
    ora(step.succeedMsg).start().succeed()
    step._printed = true
  }
  else if (unresolvedStepIndex > -1) {
    const step = steps.splice(unresolvedStepIndex, 1)[0]
    const spinner = ora(step.idleMsg).start()
    await step._promise
    spinner.succeed(step.succeedMsg)
    step._printed = true
  } else
    return true

  return displayIdleMsg(steps)
}


module.exports.stepRunner = stepRunner
