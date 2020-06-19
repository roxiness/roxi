const { buildATest, clearTemp } = require('./utils')
const { execFileSync, spawnSync } = require('child_process')



const { path } = buildATest()
execFileSync('npm install', { cwd: path, shell: true })
spawnSync('npm', ['run', 'dev'], { cwd: path, shell: true })
