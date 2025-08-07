<template>
  <div class="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
    <h2 class="text-2xl font-bold mb-6">用户注册</h2>
    <form @submit.prevent="handleRegister">
      <div class="mb-4">
        <label class="block mb-1">邮箱</label>
        <input v-model="email" type="email" class="w-full border px-3 py-2 rounded" required />
      </div>

      <div class="mb-4">
        <label class="block mb-1">密码</label>
        <input v-model="password" type="password" class="w-full border px-3 py-2 rounded" required />
      </div>

      <div class="mb-6">
        <label class="block mb-1">昵称</label>
        <input v-model="nickname" type="text" class="w-full border px-3 py-2 rounded" />
      </div>

      <button type="submit" class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
        注册
      </button>

      <p v-if="message" class="mt-4 text-green-600">{{ message }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
console.log('axios loaded:',axios)

const email = ref('')
const password = ref('')
const nickname = ref('')
const message = ref('')


const handleRegister = async () => {
  console.log('🟢 提交注册表单:', { email: email.value, password: password.value, nickname: nickname.value })

  //axios 调用
  try {
    const response = await axios.post('http://localhost:3000/api/users/register',{
        email:email.value,
        password:password.value,
        nickname:nickname.value
    })

    console.log('regist success',response.data)
    message.value = response.data.message
  } catch (err) {
    console.log('Axios Error:',err)
    console.error('regist fail',err)

    if(err.response && err.response.data){
        message.value = err.response.data.message|| 'regist fail' 
    }else{
        message.value = '网络错误或服务器未响应'
    }
  }
}
</script>