import axios from 'axios'

const server = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API || '/api',
  timeout: 10000
})

// 请求拦截
server.interceptors.request.use(config => {
  return config
}, err => {
  return Promise.reject(err)
})

// 响应拦截
server.interceptors.response.use(res => {
  if (res.status === 200) {
    return res.data
  }
  return Promise.reject(res)
}, err => {
  return Promise.reject(err)
})

export default server