import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve:{
    alias:{
      '@':path.resolve(__dirname,'./src')
    }
  },
  server:{
    proxy:{
      //将/api请求代理到后端
      '/api':{
        target:'http://localhost:3000', //你的后端服务器地址
        changeOrigin:true,
        rewrite:path => path.replace(/^\/api/,'/api')
      }
    }
  }
})
