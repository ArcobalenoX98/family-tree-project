import axios from 'axios'

const api = axios.create({
    baseURL:'http://localhost:3000/api',
})

//Request an interceptor, automatically loading the token --- 请求拦截器，自动装载token
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
    if(token){
        config.headers.Authorization = token
    }
    return config
},error => {
    return Promise.reject(error)
})

export default api