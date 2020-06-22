const { buildATest, clearTemp } = require('./utils')
const { execFileSync, spawnSync } = require('child_process')


clearTemp()
const { path } = buildATest()
execFileSync('pnpm install', { cwd: path, shell: true, stdio: 'inherit' })
execFileSync('pnpm install roxi', { cwd: path, shell: true, stdio: 'inherit' })
spawnSync('pnpm', ['run', 'dev'], { cwd: path, shell: true, stdio: 'inherit' })
