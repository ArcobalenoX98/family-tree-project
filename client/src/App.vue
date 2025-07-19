<template>
  <a-layout style="min-height: 100vh">
    <!-- 引入独立的全局导航 -->
    <NavBar />

    <a-layout-content style="padding: 24px">
      <!-- 这里将来会渲染不同页面组件 -->
      <router-view />
    </a-layout-content>

    <a-layout-footer style="text-align: center">
      示例 ©2025
    </a-layout-footer>
  </a-layout>
</template>

<script setup lang="ts">
import NavBar from '@/components/NavBar.vue'
</script>