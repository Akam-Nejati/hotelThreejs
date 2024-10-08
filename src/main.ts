import { createApp } from 'vue'
import App from './App.vue'

import { createPinia } from 'pinia'

import './assets/css/style.css'
import "./assets/css/tailwind.css";


const app = createApp(App)

const pinia = createPinia()
app.use(pinia)

app.mount('#app')
