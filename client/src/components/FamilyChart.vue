<template>
  <div ref="container" class="family-chart-wrapper"></div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import FamilyChart from 'family-chart'

const props = defineProps({
  rootId: { type: String, required: true }
})

const container = ref(null)
let chart

async function loadTree() {
  const { data } = await axios.get(`/api/members/${props.rootId}/tree`)
  const formatted = formatForFamilyChart(data)
  if (!chart) {
    chart = new FamilyChart({ container: container.value, options: { /* 可定制样式 */ } })
    chart.load(formatted)
    chart.render()
  } else {
    chart.load(formatted)
    chart.render()
  }
}

onMounted(loadTree)
watch(() => props.rootId, loadTree)

// 格式转换函数
function formatForFamilyChart(data) {
  return {
    id: data._id,
    name: data.name,
    gender: data.gender,
    spouses: [],
    parents: data.ancestors.map(a => a._id),
    children: data.children.concat(data.descendants.map(d => d._id)),
    items: [data, ...data.ancestors, ...data.descendants]
    // 若 ancestors/descendants 没包括 parents field，需补全数据关联
  }
}
</script>

<style>
.family-chart-wrapper {
  width: 100%;
  height: 100%;
}
</style>