const rollupPluginSvelte = require("rollup-plugin-svelte");

module.exports = {
  extends: "@snowpack/app-scripts-svelte",
  devOptions: {
    port: 5000,
    // dist: 'dist',
    // fallback: "public/index.html"
  },
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
