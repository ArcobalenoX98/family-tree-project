<template>
  <div>
    <h1>内容管理</h1>
    <PostEditor />
    <hr>
    <CarouselManager />
    <hr>
    <ProfileEditor />
    <!-- 后续还会加 CarouselManager、ProfileEditor -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import PostEditor from '@/components/PostEditor.vue'
import CarouselManager from '@/components/CarouselManager.vue';
import ProfileEditor from '@/components/ProfileEditor.vue';


export default defineComponent({
  name: 'ContentManagementView',
  components: { PostEditor,CarouselManager,ProfileEditor }
})
</script>