import { reactive, onMounted, onUnmounted } from 'vue'

/**
 * 格式化时间单位，小于10的数字前面补0
 * @param value 时间数值
 * @returns 格式化后的字符串
 */
const formatTimeUnit = (value: number): string => {
  return value < 10 ? `0${value}` : `${value}`
}

/**
 * 获取当前时间的 Composable
 * @returns 响应式的时间对象
 */
export function useCurrentTime() {
  // 当前时间状态
  const currentTime = reactive({
    year: 0,
    month: 0,
    day: 0,
    hour: 0,
    minute: '',
    second: ''
  })

  // 定时器引用
  let timerId: ReturnType<typeof setInterval> | null = null

  // 更新时间函数
  const updateTime = (): void => {
    const now = new Date()
    currentTime.year = now.getFullYear()
    currentTime.month = now.getMonth() + 1
    currentTime.day = now.getDate()
    currentTime.hour = now.getHours()
    currentTime.minute = formatTimeUnit(now.getMinutes())
    currentTime.second = formatTimeUnit(now.getSeconds())
  }

  // 组件挂载时启动定时器
  onMounted(() => {
    updateTime() // 立即执行一次
    timerId = setInterval(updateTime, 1000)
  })

  // 组件卸载时清理定时器
  onUnmounted(() => {
    if (timerId) {
      clearInterval(timerId)
      timerId = null
    }
  })

  return {
    currentTime
  }
}
