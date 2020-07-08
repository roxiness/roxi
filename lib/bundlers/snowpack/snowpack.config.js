module.exports = {
  "extends": "@snowpack/app-scripts-svelte",
  "scripts": {
    "mount:root": "mount . --to /"
  },
  "plugins": [
    __dirname+"/plugin.js"
  ],
  installOptions: {
    rollup: {
      plugins: [require('rollup-plugin-svelte')()]
    }
  }
}
