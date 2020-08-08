const { lifecycleTest } = require('./lifecycle')


describe('pnpm vite', () => {
  // lifecycleTest({ bundler: 'vite', pkgm: 'pnpm' })
  lifecycleTest({ bundler: 'nollup', pkgm: 'pnpm', port: 5100 })
})
