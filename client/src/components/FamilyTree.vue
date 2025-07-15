<template>
  <div ref="chartContainer" class="chart-container"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
// 从刚才安装的包里 import 整个命名空间
import * as f3 from 'family-chart'

// 接收一个数组 prop，后面我们会用静态数据测试
const props = defineProps({
  data: {
    type: Array,
    required: true
  }
})

const chartContainer = ref(null)

onMounted(() => {
  // 1. 用你的数据创建一个 store
  const store = f3.createStore({ nodes: props.data })

  // 2. 创建一个 SVG 渲染上下文，尺寸可根据需要调整
  const svg = f3.createSvg({
    container: chartContainer.value,
    width: 800,
    height: 600
  })

  // 3. 调用 view，传入 store、svg 以及内置的 elements
  f3.view({
    store,
    svg,
    elements: f3.elements
  })
})
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 600px;
}
</style>