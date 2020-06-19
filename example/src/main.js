import { hmr } from 'roxi/routify'
import App from './App.svelte';

console.log('hmr', hmr)

const app = hmr(App, { target: document.body }, 'routify-app')




// if ('serviceWorker' in navigator) {
//     import('workbox-window').then(async ({ Workbox }) => {
//         const wb = new Workbox('/sw.js')
//         const registration = await wb.register()
//         wb.addEventListener('installed', () => (console.log('installed service worker')))
//         wb.addEventListener('externalinstalled', () => (console.log('installed service worker')))
//     })
// }