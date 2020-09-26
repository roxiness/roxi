/**
 * @typedef {import('./lib/app').RoxiApp} RoxiApp
 *
 * @typedef {object} RoxiPlugin
 * @prop {string} name
 * @prop {RoxiPluginHook[]} hooks
 *
 * @typedef {object} RoxiPluginHook
 * @prop {string} event
 * @prop {RoxiPluginHookFunction|string=} condition
 * @prop {RoxiPluginHookFunction} action
 *
 * @callback RoxiPluginHookFunction
 * @param {RoxiApp} app
 * @param {object} params
 * @param {object} ctx
 *
 * */
