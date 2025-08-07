<template>
  <a-layout-header class="nav-header">
    <!-- 左侧 Logo 区 -->
    <div class="logo">Content FamilyTree</div>

    <!-- 中间菜单 -->
    <a-menu
      class="nav-menu"
      theme="dark"
      mode="horizontal"
      :default-selected-keys="['home']"
    >
      <a-menu-item key="home">
        <a href="#carousel-display">Home</a>
      </a-menu-item>
      <a-menu-item key="profile-brief">
        <a href="#profile-block">Biography Brief</a>
      </a-menu-item>
      <a-menu-item key="inclination">
        <a href="#content-list">Inclination</a>
      </a-menu-item>
      <a-menu-item key="familychart">
        <a href="#family-chart">FamilyChart</a>
      </a-menu-item>
    </a-menu>

    <!-- 右侧操作区 -->
    <div class="nav-actions">
      <a-space size="middle">
        <!-- 发布内容 + 按钮 -->
        <a-tooltip title="发布新内容">
          <a-button
            type="primary"
            shape="circle"
            size="large"
            @click="showPostEditor = true"
          >
            <PlusOutlined />
          </a-button>
        </a-tooltip>

        <!-- 管理下拉：Avatar + 菜单 -->
        <a-dropdown trigger="click" placement="bottomRight">
          <template #overlay>
            <a-menu>
              <a-menu-item key="profile" @click="showProfileEditor = true">
                编辑个人简介
              </a-menu-item>
              <a-menu-item key="carousel" @click="showCarouselManager = true">
                编辑轮播图
              </a-menu-item>
            </a-menu>
          </template>
          <!-- 触发器 -->
          <a-avatar size="large" style="cursor: pointer;">
            <UserOutlined />
          </a-avatar>
        </a-dropdown>
      </a-space>
    </div>
  </a-layout-header>

  <!-- 三个弹窗组件 -->
  <PostEditor v-model:visible="showPostEditor" />
  <ProfileEditor v-model:visible="showProfileEditor" />
  <CarouselManager v-model:visible="showCarouselManager" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Ant Design Vue 组件 & 图标
import { Button, Layout, Menu, Dropdown, Space, Tooltip, Avatar } from 'ant-design-vue'
import { PlusOutlined, UserOutlined } from '@ant-design/icons-vue'

// 你的编辑组件
import PostEditor       from '@/components/PostEditor.vue'
import ProfileEditor    from '@/components/ProfileEditor.vue'
import CarouselManager  from '@/components/CarouselManager.vue'

// 控制弹窗显示
const showPostEditor      = ref(false)
const showProfileEditor   = ref(false)
const showCarouselManager = ref(false)
</script>

<style scoped>
.nav-header {
  position: fixed;
  top: 0; left: 0; right: 0;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;  /* 左 logo，右操作区 */
  padding: 0 24px;
  background: #001529;
  z-index: 1000;
}

.logo {
  color: #fff;
  font-size: 1.5rem;
  font-weight: bold;
}

.nav-menu {
  flex: 1;             /* 占据中间剩余空间 */
  margin: 0 24px;
}

.nav-actions {
  display: flex;
  align-items: center;
}

.nav-actions .ant-btn {
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-actions .ant-avatar {
  background: #fff;
}
</style>