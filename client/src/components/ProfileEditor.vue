<template>
    <a-modal
    v-model:visible="visible"
    title="编辑生平"
    width="600px"
    @cancel="$emit('update:visible', false)"
    >
    <div class="profile-editor">
      <h2>Profile Editor</h2>
      <form @submit.prevent="updateProfile" class="form-gird">
        <div>
          <label>Name</label>
          <input v-model="profile.name" type="text" required class="input-text"/>
        </div>
        <div>
          <label>头像</label>
          <FileUploader
            v-model="files"
            :allowMultiple="false"
            label="+ 上传头像"
          />
        </div>
        <div>
          <label>Brief Introduction</label>
          <textarea v-model="profile.bio" rows="3" required class="input-text"></textarea>
        </div>
        <button type="submit" class="btn-primary">Submit</button>
      </form>
    </div>  
  </a-modal>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import axios from 'axios'
import FileUploader from '@/components/FileUploader.vue'

export default defineComponent({
  name: 'ProfileEditor',
  components: { FileUploader },
  setup() {
    const files = ref<File[]>([])

    const profile = ref({ name: '', avatar: '', bio: '' })

    async function fetchProfile() {
      const res = await axios.get(import.meta.env.VITE_API_BASE + '/profile')
      Object.assign(profile.value, res.data || {})
    }

    async function updateProfile() {
      // 构建 FormData，同时上传头像并更新其他字段
      const profileForm = new FormData()
      profileForm.append('name', profile.value.name)
      profileForm.append('bio', profile.value.bio)

      // 如果选择了新头像则上传，否则保留原 avatar 字段
      if (files.value.length) {
        profileForm.append('avatar', files.value[0])
      } else {
        profileForm.append('avatar', profile.value.avatar)
      }

      // 一次请求完成文件上传和资料更新
      const res = await axios.put(import.meta.env.VITE_API_BASE + '/profile', profileForm, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      
      // 更新本地数据并清除文件选择
      profile.value = res.data
      files.value = []
      alert('保存成功')
    }

    onMounted(fetchProfile)
    return { profile, files, updateProfile }
  }
})
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as*;

.profile-editor {
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