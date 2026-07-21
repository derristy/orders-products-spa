import { createApp } from 'vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import './assets/styles/main.css'

import App from './App.vue'
import router from './router'
import store from './store'
import i18n, { currentLocale } from './i18n'
import { setUnauthorizedHandler } from './api'
import { initAccent } from './utils/theme'

document.documentElement.setAttribute('lang', currentLocale())
initAccent()

// On any 401 from the API — clear session and send the user to login.
setUnauthorizedHandler(() => {
  store.dispatch('auth/logout')
  if (router.currentRoute.value.name !== 'login') {
    router.push({ name: 'login' })
  }
})

const app = createApp(App).use(store).use(router).use(i18n)

// Mount only after the router resolved the initial route, so the correct
// layout (public vs authenticated) renders on the first tick. Otherwise the
// authenticated layout + its Socket.io connection would flash on /login and
// get torn down mid-handshake ("WebSocket is closed before…").
router.isReady().then(() => app.mount('#app'))
