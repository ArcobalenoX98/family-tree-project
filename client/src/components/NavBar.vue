<template>
  <a-layout-header class="nav-header">
    <div class="logo">Content FamilyTree</div>
    <a-menu
      theme="dark"
      mode="horizontal"
      :default-selected-keys="['home']"
      style="flex: 1"
    >
        <a-menu-item key="home">首页</a-menu-item>
        <a-menu-item key="biography brief">生平简介</a-menu-item>
        <a-menu-item key="inclination">喜好</a-menu-item>
        <a-menu-item key="familytree">家人</a-menu-item>
    </a-menu>
  </a-layout-header>
</template>

<script setup>
// 如有 props 或 composition API 逻辑，可在此处扩展
</script>

<style scoped>
.nav-header {
  display: flex;
  align-items: center;
  padding: 0 24px;
}
.logo {
  color: #fff;
  font-size: 1.5rem;
  margin-right: 32px;
  font-weight: bold;
}
</style>