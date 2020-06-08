module.exports = {
  "pages": "src/pages",
  "sourceDir": "public",
  "routifyDir": "_roxi/.routify",
  "ignore": "",
  "dynamicImports": false,
  "singleBuild": false,
  "noHashScroll": false,
  "extensions": [
    "html",
    "svelte",
    "md"
  ],
  "distDir": "dist",
  "plugins": {
    "../lib/routify-plugins/importPathsToMounts.js": {}
  },
  "started": "2020-06-08T20:37:28.968Z"
}