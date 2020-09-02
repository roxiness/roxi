const { lifecycleTest } = require('./lifecycle')

describe('pnpm vite', () => {
  lifecycleTest({ bundler: 'vite', pkgm: 'pnpm', port: 5200 })
})

describe('pnpm nollup', () => {
  lifecycleTest({ bundler: 'nollup', pkgm: 'pnpm', port: 5100 })
})
