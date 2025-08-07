<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-container">
      <header class="modal-header">
        <div v-if="!editMode">
          <h2>{{ post.title }}</h2>
          <p class="modal-date">{{ formatDate(post.createdAt) }}</p>
        </div>
        <div v-else>
          <input v-model="form.title" class="edit-title" placeholder="编辑标题" />
          <select v-model="form.type">
            <option value="text">text</option>
            <option value="text-image">text-image</option>
            <option value="video-text">video-text</option>
            <!-- 视你的 type 枚举而定 -->
          </select>          
        </div>
        <button class="close-btn" @click="close">×</button>
      </header>

      <!-- 可滑动的媒体轮播 -->
      <div v-if="post.media.length" class="media-carousel">
        <div 
          class="media-item" 
          v-for="(m,i) in post.media" 
          :key="i"
        >
          <img v-if="isImage(m)" :src="m.url" alt="" />
          <video 
            v-else 
            :src="m.url" 
            controls 
            preload="metadata"
          ></video>
        </div>
      </div>

      <!-- 文字内容 -->
      <div class="modal-content">
        <div v-if="!editMode" v-html="post.content"></div>
        <div v-else>
          <textarea v-model="form.content" rows="6" placeholder="编辑内容"></textarea>
        </div>
      </div>

      <!-- 操作按钮 -->
      <footer class="modal-footer">
        <!-- 查看模式下的按钮 -->
        <button v-if="!editMode" @click="enterEditMode" class="btn">Edit</button>
        <button v-if="!editMode" @click="handleDelete" class="btn-destructive">Delete</button>

        <!-- 编辑模式下的按钮 -->
        <button v-if="editMode" @click="cancelEdit" class="btn">Cancel</button>
        <button v-if="editMode" @click="handleEdit" :disabled="loading" class="btn-primary">
          {{ loading ? '保存中...' : '保存' }}
        </button>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits ,reactive ,ref ,watch} from 'vue'
import axios from 'axios'


//Props 和事件定义
const props = defineProps({
  post: { type: Object, required: true }
})
const emit = defineEmits(['close'])

//本地状态
const editMode = ref(false)
const loading = ref(false)
const form = reactive({
  title:props.post.title,
  content:props.post.content,
  type:props.post.type
})

//当post 变化时，重置表单和模式
watch(
  () => props.post,
  (newPost) => {
    form.title = newPost.title
    form.content = newPost.content
    form.type = newPost.type
    editMode.value = false
  }
)

//关闭模态弹窗
function close() {
  if(!loading.value) emit('close')
}

// 1、进入编辑模式
function enterEditMode() {
  editMode.value = true
}

// 2、取消编辑
function cancelEdit(){
  editMode.value = false
  form.title =props.post.title
  form.content = props.post.content
}

// 3、提交编辑
async function handleEdit() {
  loading.value = true
  try {
    const payload = new FormData()
    payload.append('title',form.title)
    payload.append('type',form.type)
    payload.append('content',form.content)

    const { data } = await axios.put(`/api/posts/${props.post._id}`, payload,{ headers:{'Content-Type':'multipart/form-data'} })

    // 1）通知父组件更新列表
    emit('update', data)
    // 2）关闭模态框
    emit('close')
    // 3）退出编辑模式（
    editMode.value = false
  } catch (error) {
    console.error('编辑失败，后端返回：', error.response?.data || error)
    // 可根据项目使用全局通知组件
  } finally {
    loading.value = false
  }
}

// 删除帖子
async function handleDelete() {
  if (loading.value) return
  if (!confirm('确认删除此帖子？此操作不可恢复。')) return
  loading.value = true
  try {
    await axios.delete(`/api/posts/${props.post._id}`)
    emit('delete', props.post._id)
    emit('close')
  } catch (error) {
    console.error('删除失败', error)
    // 可根据项目使用全局通知组件
  } finally {
    loading.value = false
  }
}

//格式化日期
function formatDate(dateStr) {
  const d = new Date(dateStr)
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

//判断媒体类型
function isImage(media) {
  return media.mimeType.startsWith('image/')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-container {
  background: #fff;
  width: 90vw;
  max-width: 600px;
  max-height: 90vh;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  position: relative;
  padding: 16px;
  border-bottom: 1px solid #eee;
}
.modal-header h2 {
  margin: 0;
  font-size: 1.3rem;
}
.modal-date {
  margin-bottom: 0px;
  font-size: 0.85rem;
  color: #999;
}
.close-btn {
  position: absolute;
  top: 12px; right: 12px;
  background: none; border: none;
  font-size: 1.4rem; cursor: pointer;
}

.media-carousel {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
}
.media-item {
  flex: 0 0 100%;
  scroll-snap-align: start;
  position: relative;
}
.media-item img,
.media-item video {
  width: 100%;
  height: auto;
  display: block;
}

.modal-content {
  padding: 16px;
  overflow-y: auto;
  flex: 1;
  line-height: 1.6;
  color: #333;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 16px;
  border-top: 1px solid #eee;
}
.btn,
.btn-primary,
.btn-destructive {
  margin-left: 8px;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.btn {
  background: #f0f0f0;
}
.btn-primary {
  background: #007bff;
  color: white;
}
.btn-destructive {
  background: #dc3545;
  color: white;
}
.edit-title {
  width: 100%;
  font-size: 1.3rem;
  margin-bottom: 4px;
}
textarea {
  width: 100%;
  font-size: 1rem;
  resize: vertical;
}
</style>