import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'
import '../index.css'
import { registerSW } from "virtual:pwa-register";

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

if ("serviceWorker" in navigator) {
    // && !/localhost/.test(window.location)) {
    registerSW();
}

const app = createApp(App)
    .use(router)
    .use(pinia)
    .mount('#app')
