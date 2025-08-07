<template>
  <a-layout style="min-height: 100vh">
    <!-- 引入独立的全局导航 -->
    <NavBar />

    <a-layout-content
      ref="scrollArea"
      style="padding: 0; overflow-y: auto; height: 100vh"
      class="main-content"
    >
      <!-- 这里将来会渲染不同页面组件 -->
      <router-view />
    </a-layout-content>

    <a-layout-footer style="text-align: center">
      Content FamilyTree  ©2025
    </a-layout-footer>
  </a-layout>
</template>

<script setup lang="ts">
import NavBar from '@/components/NavBar.vue'

</script>

<style>
html {
  scroll-behavior: smooth;
}
/* 防止全局横向滚动 */
body {
  overflow-x: hidden;
}
</style>