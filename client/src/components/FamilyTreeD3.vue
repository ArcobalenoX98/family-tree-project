<template>
  <div class="tree-container">
    <vue-tree
      :dataset="treeData"
      :config="{
        nodeWidth: 120,
        nodeHeight: 100,
        levelHeight: 150,
        orientation: 'vertical'
      }"
    >
      <template #node="{ node }">
        <div style="border:1px solid #333; padding:5px; border-radius:4px;">
          <div>{{ node.name }}</div>
          <div style="font-size:10px;">{{ node.gender }}</div>
        </div>
      </template>
    </vue-tree>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import VueTree from '@ssthouse/vue3-tree-chart'
import '@ssthouse/vue3-tree-chart/dist/vue3-tree-chart.css'

const props = defineProps({
  rootId: { type: String, required: true }
})

const treeData = ref(null)
const config = {
  nodeWidth: 120,
  nodeHeight: 60,
  levelHeight: 200
}

onMounted(async () => {
  console.log('🔥 FamilyTreeD3.vue onMounted triggered')
  try {
    const res = await axios.get(`/api/members/${props.rootId}/tree`)
    console.log('API response:',res.data)
    treeData.value = buildTree(res.data)
  } catch (err) {
    console.error('加载家谱树失败', err)
  }
})

// 构建树形结构
function buildTree(data) {
  const nodes = {}

  // 本体节点
  nodes[data._id] = {
    name: data.name,
    label: data.name,
    gender: data.gender,
    children: []
  }

  // 后代节点初始化
  data.descendants.forEach(item => {
    nodes[item._id] = {
      name: item.name,
      label: item.name,
      gender: item.gender,
      children: []
    }
  })

  // 连接后代层级关系
  data.descendants.forEach(item => {
    item.children.forEach(childId => {
      if (nodes[item._id] && nodes[childId]) {
        nodes[item._id].children.push(nodes[childId])
      }
    })
  })

  // 将根节点挂接第一代子女
  data.children.forEach(childId => {
    if (nodes[data._id] && nodes[childId]) {
      nodes[data._id].children.push(nodes[childId])
    }
  })

  // 构建祖先节点（初始化）
  const ancestorMap = {}
  data.ancestors.forEach(anc => {
    ancestorMap[anc._id] = {
      name: anc.name,
      label: anc.name,
      gender: anc.gender || '',
      children: []
    }
  })

  // 所有祖先的下级中，找到孩子节点为 root 的人，把 root 挂在他们的 children 上
  data.ancestors.forEach(anc => {
    if (data.parents && data.parents.includes(anc._id)) {
      ancestorMap[anc._id].children.push(nodes[data._id])
    }
  })

  // 构建顶层包裹节点
  const rootWrapper = {
    name: '祖先根',
    label: 'root',
    children: Object.values(ancestorMap)
  }

  return rootWrapper
}
</script>

<style scoped>
.tree-container {
  width: 100%;
  height: 100%;
  overflow: auto;
}
</style>