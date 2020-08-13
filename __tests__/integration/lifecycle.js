

function lifecycleTest({ bundler, pkgm, port }) {
  const ssrPort = port + 2
  const url = `http://localhost:${port}/`
  const ssrUrl = `http://localhost:${ssrPort}/`

  const { copyATest, waitForServer } = require('../utils')
  const { execFileSync, spawn } = require('child_process')
  const kill = require('tree-kill')
  const { resolve } = require('path')
  const { appendFileSync } = require('fs-extra')
  require('jest-playwright-preset')

  // copy test
  const { path, exists } = copyATest('basic', pkgm)
  const { chromium } = require('playwright');

  let devProcess
  let browser
  /** @type {import('playwright').Page} */
  let page
  beforeEach(async () => page = await browser.newPage());
  afterEach(async () => await page.close());
  afterAll(async () => await browser.close())
  beforeAll(async () => { browser = await chromium.launch() })


  itIf(!exists)('can install example', async () => {
    if (pkgm === 'pnpm')
      execFileSync('pnpm install .', { cwd: path, shell: true, stdio: 'inherit' })
    else if (pkgm === 'npm')
      execFileSync('pnpm install', { cwd: path, shell: true, stdio: 'inherit' })
  }, 60000)

  it('can start dev server', async () => {
    devProcess = spawn('pnpm', ['run', 'dev', '--', '--port', port], { cwd: path, shell: true, stdio: 'inherit' })
    const response = await waitForServer(page, url)
    expect(response.ok()).toBeTruthy()
  })

  it('can run example', async () => {
    await page.goto(url)
    expect(await page.waitForSelector('"Example app"')).toBeTruthy()
  }, 25000)

  it('can update file', async () => {
    const stamp = (new Date).toISOString()
    const filePath = resolve(path, 'src/pages/index.svelte')
    await page.goto(url)
    expect(await page.waitForSelector('"Example app"')).toBeTruthy()
    expect(await page.$(`"${stamp}"`)).toBeFalsy()
    appendFileSync(filePath, `\n<div>${stamp}</div>`)
    expect(await page.waitForSelector(`"${stamp}"`)).toBeTruthy()
    kill(devProcess.pid)
  }, 3000)

  it('can build and serve', async () => {
    execFileSync('pnpm run build', { cwd: path, shell: true, stdio: 'inherit' })
    const handle = spawn('pnpm', ['run', 'serve', '--', '--spa-port', spaPort, '--ssr-port', ssrPort], { cwd: path, shell: true, stdio: 'inherit' })
    await page.goto(ssrUrl)
    expect(await page.$(`"Example app"`)).toBeTruthy()
    kill(handle.pid)
  })





  function itIf(condition) { return condition ? it : it.skip }
}

module.exports = { lifecycleTest }
