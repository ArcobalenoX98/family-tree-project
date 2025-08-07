<template>
  <!-- —— 全屏英雄区（固定全屏，不再动画） —— -->
  <section id="carousel-display" class="hero-container">
    <div class="hero-section">
      <CarouselDisplay class="hero-carousel" />
    </div>
  </section>

  <!-- —— 后续常规内容 —— -->
  <div class="content-display container">
    <section id="profile-block" class="profile-section">
      <ProfileBlock />
    </section>
    <section id="content-list" class="posts-section">
      <ContentList />
    </section>
    <section id="family-chart" class="family-chart">
    <FamilyChart />
    </section>
  </div>
</template>

<script setup lang="ts">
import CarouselDisplay from '@/components/CarouselDisplay.vue'
import ProfileBlock     from '@/components/ProfileBlock.vue'
import ContentList      from '@/components/ContentList.vue'
import FamilyChart from '@/components/FamilyChart.vue'

// **移除了所有滚动监听、计算、绑定样式的逻辑**
</script>

<style scoped lang="scss">
/*==== 1. 全屏英雄区 ====*/
.hero-container {
  width: 100vw;
  height: 100vh;       /* 只占一屏高度 */
  margin: 0 auto;
  position: relative;
  overflow: hidden;
}

.hero-section {
  /* 依然用 sticky 保证一屏都在顶部，但不再缩放 */
  position: sticky;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 10;
}

/* 轮播图本身无动画，仅撑满父容器 */
.hero-carousel {
  width: 100%;
  height: 100%;
}

/*==== 2. 常规内容区 ====*/
.content-display {
  display: flex;
  flex-direction: column;
  gap: 20px;

  .profile-section,
  .posts-section,
  .family-chart {
    padding: 24px;
    padding-top: 84px;
  }
}

/*==== 3. 防止横向滚动 ====*/
body {
  overflow-x: hidden;
}
</style>