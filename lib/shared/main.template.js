import { hmr } from 'roxi/routify'
import { Router } from 'roxi/routify'
import { routes } from '../_roxi/.routify/routes'
import App from './App.svelte'

const app = hmr(App, { target: document.body, props: { Router, routes } }, 'routify-app')
