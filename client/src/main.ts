import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'

//引入Vue组件和样式
import VueTree from '@ssthouse/vue3-tree-chart'
import '@ssthouse/vue3-tree-chart/dist/vue3-tree-chart.css'


createApp(App).mount('#app')

const app = createApp(App)

app.component('vue-tree',VueTree)
app.use(router)
app.mount('#app')

