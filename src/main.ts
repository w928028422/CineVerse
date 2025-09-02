import './style.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { setupTDesign } from './plugins/tdesign'

const app = createApp(App)

app.use(createPinia())
app.use(router)
setupTDesign(app)

app.mount('#app')
