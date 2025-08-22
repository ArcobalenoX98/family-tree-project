<template>
  <div class="profile-block">
    <h2>Personal Profile</h2>
    <div v-if="profile.name" class="profile-content">
      <img v-if="profile.avatar" :src="`${import.meta.env.VITE_MEDIA_BASE}${profile.avatar}`" class="avatar" />
      <div class="profile-info">
        <h3>{{ profile.name }}</h3>
        <p>{{ profile.bio }}</p>
      </div>
    </div>
    <p v-else>暂无个人简介</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import axios from 'axios'

export default defineComponent({
  name: 'ProfileBlock',
  setup() {
    const profile = ref<{name?: string; avatar?: string; bio?: string}>({})
    onMounted(async () => {
      try {
        const res = await axios.get(import.meta.env.VITE_API_BASE + '/profile')
        profile.value = res.data
      } catch (error) {
        console.error(error)
      }
    })
    return { profile }
  }
})
</script>

<style scoped>
.profile-block {
  box-sizing: border-box;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f9f9f9;
}
.profile-block h2 {
  margin-bottom: 1.5rem;
  font-size: 1.75rem;
}
.profile-content {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 1.5rem;
  width: 100%;
}
.avatar {
  width: 300px;
  height: 300px;
  border-radius: 5%;
  object-fit: cover;
  margin-left: 100px;   /*调整头像布局 */
}
.profile-info h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  margin-left: 200px;    /*调整标题布局 */
}
.profile-info p {
  margin: 0;
  line-height: 1.6;
  color: #555;
  margin-left: 200px;    /* 调整文字内容布局 */
}
@media (max-width: 768px) {
  .profile-content {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  .avatar {
    width: 120px;
    height: 120px;
  }
  .profile-block {
    padding: 1.5rem;
  }
}
</style>
