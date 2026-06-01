<template>
  <Desktop />
  <Taskbar :currentTime="currentTime" />
</template>

<script lang="ts" setup>
import Desktop from "./desktop/index.vue"
import Taskbar from './taskbar/index.vue'
import { useCurrentTime } from '@/composables/useCurrentTime'

// 使用 Composable 获取当前时间
const { currentTime } = useCurrentTime()
</script>