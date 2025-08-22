<template>
  <div class="carousel-display">
    <div v-if="slides.length">
      <Carousel :items-to-show="1" :autoplay="3000" :wrap-around="true">
        <Slide v-for="slide in slides" :key="slide._id">
          <div class="slide" style="position: relative; text-align: center;">
            <!-- 新增：渲染图片 -->
            <img 
              :src="`${mediaBase}${slide.imageUrl}`" 
              :alt="slide.title" 
              style="width: 100%; height: 100%; display: block; margin: 0 auto;"
            />
            <!-- 保留标题 -->
            <p style="margin-top: 8px;">{{ slide.title }}</p>
          </div>
        </Slide>
        <template #addons>
          <Navigation /> <!-- 添加左右导航按钮 -->
          <Pagination /> <!-- 添加分页器（小圆点指示器） -->
        </template>
      </Carousel>
    </div>
    <p v-else>暂无轮播内容</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import axios from 'axios'
// 导入 vue3-carousel 组件
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'
import 'vue3-carousel/dist/carousel.css' // 导入默认样式（基础样式）


export default defineComponent({
  name: 'CarouselDisplay',
  components: {
    Carousel,
    Slide,
    Pagination,
    Navigation
  },
  setup() {
    const slides = ref<{ _id:string; title:string; imageUrl:string; order:number }[]>([])
    const mediaBase = import.meta.env.VITE_MEDIA_BASE //将环境变量链接接入
    async function fetch() {
      const res = await axios.get(import.meta.env.VITE_API_BASE + '/slides')
      // 👉 在这里打印整个响应，检查 status / data / headers
      console.log('Slides response:', res)
      slides.value = res.data.sort((a:any,b:any)=>a.order-b.order) // 保持排序逻辑
    }
    onMounted(fetch)
    return { slides ,mediaBase}
  }
})
</script>