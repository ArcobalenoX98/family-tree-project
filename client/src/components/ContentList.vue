<template>
  <div class="posts-grid">
    <div 
      v-for="post in posts" 
      :key="post._id" 
      class="card"
      @click="openDetail(post)"
    >
      <!-- 标题 + 日期 -->
      <div class="card-header">
        <h3 class="card-title">{{ post.title }}</h3>
        <p class="card-date">{{ formatDate(post.createdAt) }}</p>
      </div>

      <!-- 媒体预览 / 文本摘⽂ -->
      <div class="card-body">
        <template v-if="post.media && post.media.length">
          <img
            v-if="isImage(post.media[0])"
            :src="`${ mediaBase }${post.media[0].url}`"
            alt="封面"
            class="media-preview"
          />
          <video
            v-else
            :src="`${ mediaBase }${post.media[0].url}`"
            muted
            preload="metadata"
            class="media-preview"
          ></video>
        </template>
        <p v-else class="text-preview">
          {{ truncateText(post.content, 60) }}
        </p>
      </div>
    </div>

    <!-- 详情弹窗 -->
    <DetailModal 
      v-if="showModal" 
      :post="selectedPost" 
      @update="onUpdated"
      @close="showModal = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import DetailModal from './DetailModal.vue'

// 列表状态
const posts = ref([])
const showModal = ref(false)
const selectedPost = ref(null)
const mediaBase = import.meta.env.VITE_MEDIA_BASE

// 1.抽出一个fetchpost 方法，供初次加载和更新后重用
async function fetchPosts(){
  try{
    const { data } = await axios.get(import.meta.env.VITE_API_BASE + '/posts')
    posts.value = data
  }catch(err){
    console.error('加载帖子列表失败：',err)
  }
}

// 2.页面挂在时拉取一次
onMounted(fetchPosts)

// 3.打开DetalModal 
function openDetail(post){
  selectedPost.value = post
  showModal.value = true
}

// 4.编辑保存后出发：重新拉取列表 + 关闭弹窗
async function onUpdated(updatedPost){
  //直接替换单条也可以，只需要保证post已经是最新的数据就OK
  //这里选择重新拉取整表最为保险
  await fetchPosts()
  showModal.value = false
}

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

function isImage(media) {
  return media.mimeType.startsWith('image/')
}

function truncateText(html, maxLen = 60) {
  const txt = html.replace(/<\/?[^>]+>/g,'')   // 去 HTML
  return txt.length > maxLen ? txt.slice(0, maxLen) + '…' : txt
}

</script>

<style scoped>
.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  padding: 16px;
}

.card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.08);
  overflow: hidden;
  cursor: pointer;
  transition: transform .2s, box-shadow .2s;
}
.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.12);
}

.card-header {
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
}
.card-title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
}
.card-date {
  margin: 4px 0 0;
  font-size: 0.85rem;
  color: #888;
}

.card-body {
  position: relative;
  width: 100%;
  height: 368px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.media-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.text-preview {
  padding: 0 16px;
  color: #555;
  font-size: 0.95rem;
  line-height: 1.4;
  text-align: center;
}
</style>