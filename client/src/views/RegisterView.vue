<template>
  <div class="register-container">
    <h2>Create Account</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="email">Email</label>
        <input 
          type="email" 
          id="email" 
          v-model="form.email" 
          required
          placeholder="Enter your email"
        />
      </div>
      
      <div class="form-group">
        <label for="password">Password</label>
        <input 
          type="password" 
          id="password" 
          v-model="form.password" 
          required
          placeholder="At least 8 characters with letters and numbers"
        />
      </div>
      
      <div class="form-group">
        <label for="nickname">Nickname (Optional)</label>
        <input 
          type="text" 
          id="nickname" 
          v-model="form.nickname" 
          placeholder="How should we call you?"
        />
      </div>
      
      <button type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? 'Registering...' : 'Register' }}
      </button>
      
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
      
      <div v-if="successMessage" class="success-message">
        {{ successMessage }} <router-link to="/login">Login now</router-link>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();

const form = ref({
  email: '',
  password: '',
  nickname: ''
});

const isSubmitting = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const handleSubmit = async () => {
  errorMessage.value = '';
  isSubmitting.value = true;
  
  try {
    const response = await axios.post('http://localhost:3000/api/users/register', form.value);
    
    if (response.status === 201) {
      successMessage.value = 'Registration successful!';
      // 重置表单
      form.value = { email: '', password: '', nickname: '' };
      // 2秒后跳转到登录
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    }
  } catch (error) {
    if (error.response) {
      errorMessage.value = error.response.data.message || 'Registration failed';
    } else {
      errorMessage.value = 'Network error. Please try again later.';
    }
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.register-container {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  border: 1px solid #e1e1e1;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

button {
  width: 100%;
  padding: 0.75rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
}

button:disabled {
  background-color: #a8d8bb;
  cursor: not-allowed;
}

.error-message {
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: #ffeaea;
  color: #ff5252;
  border-radius: 4px;
}

.success-message {
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: #eaffea;
  color: #42b983;
  border-radius: 4px;
}
</style>