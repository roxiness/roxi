/**
 * @typedef {'start'|'before:config'|'config'
 * |'after:config'|'before:bundle'|'bundle'
 * |'after:bundle'|'router'|'end'} AppEvent
 *
 * @typedef {object} RoxiPlugin
 * @prop {string} name
 * @prop {RoxiPluginHook[]} hooks
 * @prop {Object.<string, Function>=} dependencies
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
 * @typedef {object} RoxiPluginConfig
 * @prop {string} name
 * @prop {Object.<string, any>} params
 *
 * @typedef {RoxiPlugin & RoxiPluginConfig} RoxiPluginConfigured
 *
 * @typedef {createApp['app']} RoxiApp
 */

