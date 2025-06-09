import axios from 'axios'

// 创建 axios 实例
const service = axios.create({
    baseURL: '/api', // 通过 Vite 代理指向本地后端
    timeout: 5000
})

// 请求拦截器
service.interceptors.request.use(
    config => {
        // 可以统一加 token 之类的请求头
        // config.headers.Authorization = 'Bearer ' + token
        return config
    },
    error => {
        console.error('请求拦截器错误:', error)
        return Promise.reject(error)
    }
)

// 响应拦截器
service.interceptors.response.use(
    response => {
        // 统一处理响应数据
        return response.data
    },
    error => {
        console.error('响应拦截器错误:', error)
        return Promise.reject(error)
    }
)

export default service
