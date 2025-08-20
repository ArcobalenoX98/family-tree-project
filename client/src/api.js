// src/api.js
import axios from 'axios'

// ✅ 用环境变量控制后端地址（构建期注入）
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE, // ← 不要再写死 localhost
  timeout: 15000,
  // 如果你用 Cookie 鉴权，改成 true，并确保服务端 cors({ credentials:true })
  withCredentials: false
})

// ✅ 请求拦截器：自动挂 Token（统一 Bearer 前缀）
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = token.startsWith('Bearer ')
        ? token
        : `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

export default api