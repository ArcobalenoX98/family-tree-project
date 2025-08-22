import { defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) =>{
  const env = loadEnv(mode, process.cwd())
  console.log('Mode:',mode)
  console.log('VITE_API_BASE:',env.VITE_API_BASE)
  console.log('VITE_MEDIA_BASE:', process.env.VITE_MEDIA_BASE)

  return{
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
      },
      '/upload':{
        target:'http://localhost:3000',  // 媒体文件代理
        changeOrigin: true
      }
    }
  }
}})
