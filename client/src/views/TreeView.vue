<!-- src/views/TreeView.vue -->
<template>
  <div style="text-align:center; margin: 16px;">
    <router-link to="/family/edit">
      <button style="padding: 8px 16px; background:#1976d2; color:#fff; border:none; border-radius:4px;">
        编辑家谱
      </button>
    </router-link>
  </div>
  <!-- 仅用于展示，不允许编辑 -->
  <FamilyChart :editable="false" />
</template>

<script>
import FamilyChart from '@/components/FamilyChart.vue';

export default {
  name: 'TreeView',
  components: { FamilyChart }
};
</script>

<style scoped></style>