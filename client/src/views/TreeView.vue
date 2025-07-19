<template>
  <div class="tree-view-page">
    <FamilyChart v-if="treeData.length" :data="treeData" />
  </div>
</template>

<script setup>
// 从路由中接收 rootId 
import { useRoute } from 'vue-router'
import  FamilyChart  from '../components/FamilyChart.vue'
import { ref,onMounted } from 'vue'
import axios from 'axios'
const treeData = ref([])

onMounted(async() =>{
  const res = await axios.get('/api/family')
  treeData.value = res.data
})

const route = useRoute()
const rootId = route.query.rootId || ''
</script>

<style scoped>
.tree-view-page {
  width: 100%;
  height: 100%; /* 让容器撑满视口高度 */
  overflow: auto;
}
</style>