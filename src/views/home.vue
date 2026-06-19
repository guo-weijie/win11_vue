<template>
  <!-- 桌面端：Win11 布局 -->
  <div v-if="!isMobile" class="home-container" :data-theme="theme" :style="{ backgroundImage: backgroundStyle }">
    <Desktop />
    <Taskbar :currentTime="currentTime" />
  </div>

  <!-- 移动端：WP8.1 磁贴界面 + 应用窗口 -->
  <template v-else>
    <AppWindows />
    <WpShell />
  </template>
</template>

<script lang="ts" setup>
import { computed, watch } from "vue";
import Desktop from "./desktop/index.vue";
import Taskbar from "./taskbar/index.vue";
import WpShell from "./mobile/wpShell.vue";
import AppWindows from "./desktop/appWindows.vue";
import { useCurrentTime } from "@/composables/useCurrentTime";
import { useMobile } from "@/composables/useMobile";
import { userStore } from "@/store/user";
import { storeToRefs } from "pinia";

// 使用 Composable 获取当前时间
const { currentTime } = useCurrentTime();

// 移动端检测
const { isMobile } = useMobile();

// Store
const store = userStore();
const { backgroundImgUrl, theme } = storeToRefs(store);

// 动态加载壁纸资源
const images = import.meta.glob<{ default: string }>("/src/assets/wallpaper/**/*.jpg", { eager: true });

// 背景图片样式计算
const backgroundStyle = computed(() => {
  try {
    for (const path in images) {
      if (path.includes(backgroundImgUrl.value)) {
        return `url(${images[path].default})`;
      }
    }
  } catch (error) {
    console.error("Failed to load background image:", error);
    return "";
  }
});

// 主题切换监听
watch(theme, (newTheme: string) => {
  document.documentElement.setAttribute('data-theme', newTheme);
}, { immediate: true });
</script>

<style lang="scss" scoped>
@use "@/style/responsive" as *;

.home-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  user-select: none;
  position: relative;

  background: {
    repeat: no-repeat;
    position: center center;
    size: cover;
  }

  @include mobile {
    display: none;
  }
}
</style>