import { createApp } from 'vue'
import App from './App.vue'
import './style/index.css'
import './style/nprogress.less'
import useAnt from './plugins/ant'
import SvgIcon from './components/svg-icon.vue'
import 'virtual:svg-icons-register'
import router from './router'
import { createPinia } from 'pinia'

const pinia = createPinia()

const app = createApp(App)

app.use(pinia)

useAnt(app)

app.component('SvgIcon', SvgIcon)

app.use(router)

import './permission'

app.mount('#app')
