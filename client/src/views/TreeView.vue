<template>
  <div class="tree-view-page">
    <div style="background:yellow;color:black;padding:10px;">
      🚀 TreeView Loaded 🚀
    </div>
    <FamilyTreeD3 :root-id="rootId" />
  </div>
</template>

<script setup>
// 从路由中接收 rootId 
import { useRoute } from 'vue-router'
import  FamilyChart  from 'family-chart'

const route = useRoute()
const rootId = route.query.rootId || ''
</script>

<style scoped>
.tree-view-page {
  width: 100%;
  height: 100vh; /* 让容器撑满视口高度 */
  overflow: auto;
}
</style>