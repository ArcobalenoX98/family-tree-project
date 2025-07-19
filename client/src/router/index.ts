import { createRouter, createWebHistory } from 'vue-router'
import RegisterView from '@/views/RegisterView.vue'
import TreeView from '@/views/TreeView.vue'

const routes = [
  {path: '/' ,name:'home',components:RegisterView},
  {path: '/tree',name:'tree',components:TreeView}
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path:'/',
      redirect:'/register'
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    // 添加其他路由...
    {
      path: '/tree',
      name: 'tree',
      component: TreeView
    }
  ]
})

export default router