<template>
  <div class="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
    <h2 class="text-2xl font-bold mb-6">用户登录</h2>
    <form @submit.prevent="handleLogin">
      <div class="mb-4">
        <label class="block mb-1">邮箱</label>
        <input v-model="email" type="email" class="w-full border px-3 py-2 rounded" required />
      </div>

      <div class="mb-6">
        <label class="block mb-1">密码</label>
        <input v-model="password" type="password" class="w-full border px-3 py-2 rounded" required />
      </div>

      <button type="submit" class="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">
        登录
      </button>

      <p v-if="message" class="mt-4 text-green-600">{{ message }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
//import axios from 'axios'
import api from '../api'

const email = ref('')
const password = ref('')
const message = ref('')

const handleLogin = async () => {
  console.log('🟢 提交登录表单:', { email: email.value, password: password.value })

  try {
    const response = await api.post('/users/login', {
      email: email.value,
      password: password.value
    })

    console.log('✅ 登录成功:', response.data)
    message.value = response.data.message

    // 保存 JWT token 到 localStorage
    localStorage.setItem('token', response.data.token)

    //登陆成功后调用受保护API
    await testProtected()
    
  } catch (err) {
    console.error('❌ 登录失败:', err)

    if (err.response && err.response.data) {
      message.value = err.response.data.message || '登录失败'
    } else {
      message.value = '网络错误或服务器未响应'
    }
  }
}

const testProtected = async() =>{
  try{
    const res = await api.get('/users/protected')
    console.log('受保护API返回',res.data)
  }catch(err){
    console.error('调用受保护API失败:',err.response ? err.response.data : err)
  }
}
</script>