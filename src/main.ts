import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'

const saved = localStorage.getItem('holistics-theme-mode') || 'light'
document.documentElement.setAttribute('data-theme', saved)

const app = createApp(App)
app.use(router)
app.mount('#app')
