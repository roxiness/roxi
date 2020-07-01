
const { copyATest, clearTemp } = require('../utils')
const { execFileSync, spawn } = require('child_process')
const kill = require('tree-kill')
require('jest-playwright-preset')


const { chromium } = require('playwright');
let browser;
let page;
beforeAll(async () => {
  browser = await chromium.launch();
});
beforeEach(async () => {
  page = await browser.newPage();
});
afterEach(async () => {
  await page.close();
});
afterAll(async () => {
  await browser.close()
})

it('can install example', async () => {
  clearTemp()
  const { path } = copyATest()
  execFileSync('pnpm install', { cwd: path, shell: true, stdio: 'inherit' })
  execFileSync('pnpm install roxi', { cwd: path, shell: true, stdio: 'inherit' })
  const handle = spawn('pnpm', ['run', 'dev'], { cwd: path, shell: true, stdio: 'inherit' })

  await require('util').promisify(setTimeout)(10000)
  await page.goto('http://dev.local:5000/')

  const result = await page.waitForSelector('"Example app"');
  expect(result).toBeTruthy()
  kill(handle.pid)

}, 40000)
