

function lifecycleTest({ bundler, pkgm, port }) {
  const ssrPort = port + 2
  const url = `http://localhost:${port}/`
  const ssrUrl = `http://localhost:${ssrPort}/`

  const { copyATest, appFactory, waitForServer } = require('../utils')
  const { execFileSync, spawn } = require('child_process')
  const kill = require('util').promisify(require('tree-kill'))
  const { resolve } = require('path')
  const { appendFileSync } = require('fs-extra')
  // const execa = require('execa')
  const { chromium } = require('playwright');

  let path
  let devProcess
  let browser
  /** @type {import('playwright').Page} */
  let page
  beforeEach(async () => page = await browser.newPage());
  afterEach(async () => await page.close());
  afterAll(async () => await browser.close())
  beforeAll(async () => {
    path = await appFactory('basic', pkgm, bundler)
    browser = await chromium.launch()
  })


  it('can start dev server', async () => {
    devProcess = spawn('pnpm', ['run', 'dev', '--', '--port', port], { cwd: path, shell: true, stdio: 'inherit' })
    const response = await waitForServer(page, url)
    expect(response.ok()).toBeTruthy()
  })

  it('can run example', async () => {
    await page.goto(url)
    await new Promise(resolve => setTimeout(resolve, 100))
    expect(await page.waitForSelector('"Example app"')).toBeTruthy()
  }, 25000)

  it('can update file', async () => {
    const stamp = (new Date).toISOString()
    const filePath = resolve(path, 'src/pages/index.svelte')
    await page.goto(url)
    await new Promise(resolve => setTimeout(resolve, 100))
    expect(await page.waitForSelector('"Example app"')).toBeTruthy()
    expect(await page.$(`"${stamp}"`)).toBeFalsy()
    appendFileSync(filePath, `\n<div>${stamp}</div>`)
    await new Promise(resolve => setTimeout(resolve, 100))
    expect(await page.waitForSelector(`"${stamp}"`)).toBeTruthy()
  }, 3000)

  it('can build and serve', async () => {
    await kill(devProcess.pid)
    execFileSync('pnpm run build', { cwd: path, shell: true, stdio: 'inherit' })
    const handle = spawn('pnpm', ['run', 'serve', '--', '--spa-port', port, '--ssr-port', ssrPort], { cwd: path, shell: true, stdio: 'inherit' })
    await page.goto(ssrUrl)
    expect(await page.$(`"Example app"`)).toBeTruthy()
    await kill(handle.pid)
  })
}

module.exports = { lifecycleTest }
