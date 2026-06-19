import { adminApi } from '../request'

/** 获取登录页背景图（返回二进制图片 Blob） */
export function getLoginBg() {
  return adminApi.get<Blob>('/user/loginBg', { responseType: 'blob' })
}
