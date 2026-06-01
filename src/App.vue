<template>
  <div class="app" :data-theme="theme" :style="{ backgroundImage: backgroundStyle }">
    <router-view></router-view>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { userStore } from "@/store/user";
import { storeToRefs } from "pinia";

const store = userStore();
const { backgroundImgUrl, theme } = storeToRefs(store);
const images = import.meta.glob<{ default: string }>("/src/assets/wallpaper/**/*.jpg", { eager: true });

const backgroundStyle = computed(() => {
  try {
    for (const path in images) {
      if (path.includes(backgroundImgUrl.value)) {
        return `url(${images[path].default})`;
      }
    }
  } catch (error) {
    return "";
  }
});
</script>

<style lang="scss" scoped>
.app {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  user-select: none;

  background: {
    repeat: no-repeat;
    position: center center;
    size: cover;
  }
}
</style>
