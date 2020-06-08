const rollupPluginSvelte = require("rollup-plugin-svelte");

module.exports = {
  extends: "@snowpack/app-scripts-svelte",
  devOptions: { port: 5000 },
  scripts: { "mount:_roxi": "mount _roxi", },
  installOptions: {
    rollup: {
      plugins: [
        rollupPluginSvelte({
          dev: process.env.NODE_ENV !== "production",
        }),
      ],
    },
  },
};
