<template>
  <div>
    <h2 style="text-align:center; color:#fff; margin: 16px 0;">家谱编辑模式</h2>
    <!-- editable 默认为 true，可省略 -->
    <FamilyChart :editable="true" />
  </div>
</template>

<script>
import FamilyChart from '@/components/FamilyChart.vue';

export default {
  name: 'FamilyEditView',
  components: { FamilyChart }
};
</script>

<style scoped>
/* 你可以在这里加一些编辑页面专属的样式 */
</style>