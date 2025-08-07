import { createRouter, createWebHistory } from 'vue-router'
import RegisterView from '@/views/RegisterView.vue'
import TreeView from '@/views/TreeView.vue'
import Homepage from '@/views/Homepage.vue'
import ContentDisplayView   from '@/views/ContentDisplayView.vue'
import ContentManagementView from '@/views/ContentManagementView.vue'
import FamilyEditView from '@/views/FamilyEditView.vue';




const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path:'/',
      redirect:'/display'
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/family',
      name: 'TreeView',
      component: TreeView
    },
    {
      path: '/family/edit',    // 编辑页面
      name: 'FamilyEdit',
      component: FamilyEditView
    },
    {
      path:'/home',
      name:'home',
      component:Homepage
    },
    {
      path: '/display', 
      name:'display',
      component:ContentDisplayView},
    {
      path: '/management', 
      name:'manage',
      component:ContentManagementView}
  ]
})

export default router