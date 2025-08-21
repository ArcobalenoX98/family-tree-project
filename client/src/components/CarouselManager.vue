<template>
    <a-modal
    v-model:visible="visible"
    title="编辑轮播图"
    width="600px"
    @cancel="$emit('update:visible', false)"
  >
      <div class="carousel-manager" >
      <h2>Carousel Manager</h2>
      <form @submit.prevent="createSlide" class="form-gird">
        <div>
          <label>Title</label>
          <input v-model="form.title" type="text" required class="input-text" />
        </div>
        <div>
          <label>轮播图</label>
          <FileUploader
            v-model="files"
            :allowMultiple="true"
            label="+ 上传轮播图片"
          />
        </div>
        <div>
          <label>顺序：</label>
          <input v-model.number="form.order" type="number" min="0" required class="input-text"/>
        </div>
        <button type="submit" class="btn-primary">Submit</button>
      </form>

      <ul>
        <li v-for="slide in slides" :key="slide._id">
          {{ slide.order }} - {{ slide.title }}
          <button @click="deleteSlide(slide._id)">删除</button>
        </li>
      </ul>
    </div>
  </a-modal>

</template>

<script lang="ts">
import { defineComponent, ref, defineProps, defineEmits,onMounted } from 'vue'
import axios from 'axios'
import FileUploader from '@/components/FileUploader.vue'
const props = defineProps({ visible: Boolean })
const emit  = defineEmits(['update:visible'])

export default defineComponent({
  name: 'CarouselManager',
  components: { FileUploader },
  setup() {
    const files = ref<File[]>([])

    const slides = ref<{ _id: string; title: string; imageUrl: string; order: number }[]>([])
    const form = ref({ title: '', imageUrl: '', order: 0 })

    async function fetchSlides() {
      const res = await axios.get(import.meta.env.VITE_API_BASE + '/slides')
      slides.value = res.data
    }

    async function createSlide() {
      //1、确保选择了图片
      if (!files.value.length) {
        return alert('请先选择图片');
      }   

      //2、上传图片到通用接口，获取URL列表
      const formData = new FormData()
      formData.append('title', form.value.title)
      formData.append('order', form.value.order)
      files.value.forEach(f => formData.append('image', f))
      await axios.post(import.meta.env.VITE_API_BASE + '/slides', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })


      //重置表单
      form.value = { title: '', imageUrl: '', order: 0 }
      files.value = []
      fetchSlides()
    }

    async function deleteSlide(id: string) {
      await axios.delete(import.meta.env.VITE_API_BASE + `/slides/${id}`)
      fetchSlides()
    }

    onMounted(fetchSlides)
    return { slides, form, files, createSlide, deleteSlide }
  }
})
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as*;

.carousel-manager {
  background: white;
  padding: $space-lg;
  border-radius: $border-radius;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);

  .title {
    margin-bottom: $space-md;
    font-size: 1.5rem;
  }
  .form-grid {
    display: grid;
    grid-gap: $space-md;
  }
  .input-text {
    width: 100%;
    padding: $space-sm;
    border: 1px solid rgba($color-text, 0.4);
    border-radius: $border-radius;
  }
  .btn-primary {
    padding: $space-sm $space-lg;
    background: $color-primary;
    color: white;
    border-radius: $border-radius;
    &:hover { background: darken($color-text, 10%); } 
  }

  .upload-area {
    margin-top: 1rem;
  }

  .upload-btn {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 80px;
    height: 80px;
    border: 2px dashed #ccc;
    border-radius: 8px;
    cursor: pointer;
    font-size: 2rem;
    transition: all 0.3s;
  }

  .upload-btn:hover {
    border-color: #42b983;
    background: #f8f8f8;
  }

  .preview-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 10px;
    margin-top: 10px;
  }

  .preview-item {
    position: relative;
    width: 100px;
    height: 100px;
  }

  .preview-img, .preview-video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 4px;
  }

  .remove-btn {
    position: absolute;
    top: -10px;
    right: -10px;
    width: 24px;
    height: 24px;
    background: #ff5252;
    color: white;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    font-weight: bold;
  } 
}
</style>