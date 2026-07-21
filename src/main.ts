import { createApp } from 'vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import './assets/styles/main.css'

import App from './App.vue'
import router from './router'
import store from './store'
import i18n, { currentLocale } from './i18n'
import { setUnauthorizedHandler } from './api'

document.documentElement.setAttribute('lang', currentLocale())

// On any 401 from the API — clear session and send the user to login.
setUnauthorizedHandler(() => {
  store.dispatch('auth/logout')
  if (router.currentRoute.value.name !== 'login') {
    router.push({ name: 'login' })
  }
})

createApp(App).use(store).use(router).use(i18n).mount('#app')
