<template>
  <a-modal
    v-model:visible="visible"
    title="发布新内容"
    width="600px"
    @cancel="$emit('update:visible', false)"
  >
    <div class="post-editor">
      <h2>Post Content</h2>
      <form @submit.prevent="handleSubmit" class="form-gird">
        <div>
          <label>Title:</label>
          <input v-model="title" type="text" required class="input-text"/>
        </div>
        <div>
          <label>Content</label>
          <textarea v-model="content" rows="4" required class="input-text"></textarea>
        </div>

        <FileUploader
          v-model="files"
          :allowMultiple="true"
          label="+ 上传图片"
        />
        
        <!-- 提交按钮：上传中禁用并显示百分比 -->
        <button
          type="submit"
          class="btn-primary"
          :disabled="isLoading"
        >
          {{ isLoading ? `上传中 ${uploadProgress}%` : 'Submit' }}
        </button>

        <!-- 上传进度条 -->
        <div v-if="isLoading" class="progress-wrap">
          <progress :value="uploadProgress" max="100"></progress>
          <span>{{ uploadProgress }}%</span>
        </div>
      </form>
    </div>
  </a-modal>  
</template>

<script lang="ts">
import { defineComponent, ref ,defineProps , defineEmits} from 'vue'
import axios from 'axios'
import FileUploader from '@/components/FileUploader.vue'
const props = defineProps({ visible: Boolean })
const emit  = defineEmits(['update:visible'])

export default defineComponent({
  name: 'PostEditor',
  components: { FileUploader },
  setup({ emit}) {
    const title = ref('')
    const type = ref<'text'|'image-text'|'video-text'>('text')
    const content = ref('')
    const files = ref<File[]>([])

    //上传中状态与进度
    const isLoading = ref(false)
    const uploadProgress = ref(0)

    //自动检测内容类型
    const detectContentType = (): 'text' | 'image-text' | 'video-text' => {
      if (!files.value.length) return 'text';
      
      const firstFile = files.value[0];
      if (firstFile.type.startsWith('image/')) return 'image-text';
      if (firstFile.type.startsWith('video/')) return 'video-text';
      
      return 'text';
    }    

    // Automatically update type when files change
    // We can use a watcher or just update type before submit
    // Here we update type whenever files change via a watch or effect
    // But since we removed onFileChange, let's add a watch
    // However, to keep minimal changes, let's just update type in handleSubmit

    async function handleSubmit() {
      //1. 先更新type
      type.value = detectContentType();

      //2.切换到“上传中”状态
      isLoading.value = true
      uploadProgress.value = 0

      //3.构造FormData
      const form = new FormData()
      form.append('title', title.value)
      form.append('type', type.value)
      form.append('content', content.value)
      files.value.forEach(f => form.append('media', f))

      try {
        //4.发请求时加onUploadProgress
        const res = await axios.post('/api/posts', form, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        console.log('创建成功：', res.data)
        
        //5.成功后重置表单
        title.value = ''
        content.value = ''
        files.value = []
        type.value = 'text'
        
        //6. 通知父组件刷新列表单
        emit('refresh-posts')

        // TODO: 重置表单或给出提示
        const createdPost = res.data;
        createdPost.media.forEach((mediaItem,index) =>{
          files.value[index] = Object.assign(files.value[index],{
            persistenUrl:mediaItem.url
          });
        });
      } catch (err) {
        console.error('创建失败：', err)
      }finally{
        //7.恢复进度条的初始状态
        isLoading.value = false
        uploadProgress.value = 0
      }
    }

    return { title, type, content, files,isLoading,uploadProgress, handleSubmit }
  }
})
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as*;

.post-editor {
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

  .progress-wrap {
    margin: 8px 0;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  progress {
    width: 200px;
    height: 12px;
  }
}


</style>