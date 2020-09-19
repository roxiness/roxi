function matchesFile(relativePath) {
  const { resolve } = require('path')
  const fullPath = resolve(process.cwd(), relativePath)
  return ({ id }) => [fullPath, `/${relativePath}`].includes(id)
}

function resolvePlugins(config) {
  for (const plugin of config.plugins || []) {
    config = resolvePlugin(config, plugin);
  }
  return config
}

// copied from vite/dist/node/config
function resolvePlugin(config, plugin) {
  return {
    ...config,
    ...plugin,
    alias: {
      ...plugin.alias,
      ...config.alias
    },
    define: {
      ...plugin.define,
      ...config.define
    },
    transforms: [...(config.transforms || []), ...(plugin.transforms || [])],
    resolvers: [...(config.resolvers || []), ...(plugin.resolvers || [])],
    configureServer: [].concat(config.configureServer || [], plugin.configureServer || []),
    rollupInputOptions: mergeObjectOptions(config.rollupInputOptions, plugin.rollupInputOptions),
    rollupOutputOptions: mergeObjectOptions(config.rollupOutputOptions, plugin.rollupOutputOptions),
  }
}

// copied from vite/dist/node/config
function mergeObjectOptions(to, from) {
  if (!to)
    return from;
  if (!from)
    return to;
  const res = { ...to };
  for (const key in from) {
    const existing = res[key];
    const toMerge = from[key];
    if (Array.isArray(existing) || Array.isArray(toMerge)) {
      res[key] = [].concat(existing, toMerge).filter(Boolean);
    }
    else {
      res[key] = toMerge;
    }
  }
  return res;
}

module.exports = { matchesFile, resolvePlugins }
