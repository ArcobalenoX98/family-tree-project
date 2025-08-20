import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'ant-design-vue/dist/reset.css' 
import Antd from 'ant-design-vue'
import '@/styles/global.scss'

//引入Vue组件和样式

const app = createApp(App)
//console.log('🔧 VITE_API_BASE =', import.meta.env.VITE_API_BASE)

app.use(Antd)
app.use(router)
app.mount('#app')

