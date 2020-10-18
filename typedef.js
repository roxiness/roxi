/**
 * @typedef {'*'|'init'|'start'|'before:config'|'config'
 * |'after:config'|'before:bundle'|'bundle'
 * |'after:bundle'|'router'|'end'} AppEvent
 *
 * @typedef {object} HookOrder
 * @prop {string=} before
 * @prop {string=} after
 * @prop {boolean=} first
 * @prop {boolean=} last
 *
 * @typedef {object} RoxiPlugin
 * @prop {string=} name
 * @prop {RoxiPluginHook[]} hooks
 * @prop {Object.<string, Function>=} dependencies
 *
 * @typedef {object} RoxiPluginHook
 * @prop {AppEvent} event
 * @prop {string=} name
 * @prop {RoxiPluginHookFunction|string=} condition
 * @prop {HookOrder|HookOrder[]=} order
 * @prop {RoxiPluginHookFunction} action
 *
 * @callback RoxiPluginHookFunction
 * @param {RoxiApp} app
 * @param {Object.<string, any>} params
 * @param {{event: AppEvent} & Object.<string, any>} ctx
 *
 * @typedef {object} RoxiPluginConfig
 * @prop {string} name
 * @prop {Object.<string, any>} params
 *
 * @typedef {RoxiPlugin & RoxiPluginConfig} RoxiPluginConfigured
 *
 * @typedef {import('./lib/app.js')['App']['prototype']} RoxiAppInstance
 * @typedef {RoxiAppInstance & {config: Partial<RoxiAppConfig>}} RoxiApp
 *
 * @typedef {object} RoxiAppConfig
 * @prop {import('./lib/plugins/rollup/rollup.template').default['template']['rollup']} rollup
 * @prop {import('./lib/plugins/routify')['template']['routify']} routify
 * @prop {import('./lib/roxi')['template']['roxi']} roxi
 * @prop {import('./lib/plugins/vite')['template']['svite']} svite
 * @prop {import('./lib/plugins/vite')['template']['vite']} vite
 * @prop {import('./lib/plugins/spassr')['template']} spassr
 *
 * @callback ErrorHandler
 * @param {Error} error
 * @param {RoxiApp} app
 * @returns {any}
 *
 * @callback HookHandler
 * @param {RoxiApp} app
 * @param {RoxiPluginHook} hook
 * @param {RoxiPlugin} plugin
 * @param {object} ctx
 * @returns {Promise}
 **/
