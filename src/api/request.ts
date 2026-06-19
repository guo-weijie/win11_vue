import axios from 'axios'

/** 主 API 实例（/api 前缀） */
export const request = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API || '/api',
  timeout: 10000,
})

request.interceptors.request.use(config => {
  return config
})

request.interceptors.response.use(
  res => res.data,
  err => Promise.reject(err),
)

/** 后台管理 API 实例（无前缀，直接使用 VITE_API_BASE_URL） */
export const adminApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
})

adminApi.interceptors.response.use(
  res => res.data,
  err => Promise.reject(err),
)
