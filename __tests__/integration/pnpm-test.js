
const { copyATest, waitForServer } = require('../utils')
const { execFileSync, spawn } = require('child_process')
const kill = require('tree-kill')
const { resolve } = require('path')
const { appendFileSync } = require('fs-extra')
require('jest-playwright-preset')

const { path, exists } = copyATest('pnpm')
const { chromium } = require('playwright');
let url = 'http://localhost:5000'
let handle
let browser
/** @type {import('playwright').Page} */
let page
beforeEach(async () => page = await browser.newPage());
afterEach(async () => await page.close());
afterAll(async () => await browser.close())
beforeAll(async () => { browser = await chromium.launch() })

describe('pnpm', () => {
  itIf(!exists)('can install example', async () => {
    execFileSync('pnpm install', { cwd: path, shell: true, stdio: 'inherit' })
    execFileSync('pnpm install roxi', { cwd: path, shell: true, stdio: 'inherit' })
  }, 60000)

  it('can start dev server', async () => {
    handle = spawn('pnpm', ['run', 'dev'], { cwd: path, shell: true, stdio: 'inherit' })
    const response = await waitForServer(page, url)
    expect(response.ok()).toBeTruthy()
  })

  it('can run example', async () => {
    await page.goto('http://localhost:5000/')
    const result = await page.waitForSelector('"Example app"');
    expect(result).toBeTruthy()
    kill(handle.pid)
  }, 25000)

  it('can update file', async () => {
    const stamp = (new Date).toISOString()
    const filePath = resolve(path, 'src/pages/index.svelte')

    await page.goto('http://localhost:5000/')
    const result = await page.$(`"${stamp}"`);
    expect(result).toBeFalsy()
    appendFileSync(filePath, `\n<div>${stamp}</div>`)
    const result2 = await page.waitForSelector(`"${stamp}"`);
    expect(result2).toBeTruthy()

  })
})




function itIf(condition) { return condition ? it : it.skip }
