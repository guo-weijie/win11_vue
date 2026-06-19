<template>
  <div class="app-windows-overlay">
    <component
      v-for="app in openedApps"
      :key="app.name"
      :is="getAppComponent(app.name)"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, type Component } from "vue";
import { appStore, type appItem } from "@/store/app";

import Edge from "./app/edge.vue";
import Setup from "@/views/setUp/index.vue";
import Photo from "./app/photo.vue";
import Snake from "./app/snake.vue";
import Paint from "./app/paint.vue";

const appComponentMap: Record<string, Component> = {
  Edge,
  设置: Setup,
  照片: Photo,
  贪吃蛇: Snake,
  画图: Paint,
};

const store = appStore();

const openedApps = computed(() => store.getApp.filter((app: appItem) => app.open));

const getAppComponent = (appName: string): Component | null => {
  return appComponentMap[appName] || null;
};
</script>

<style lang="scss" scoped>
.app-windows-overlay {
  position: fixed;
  inset: 0;
  z-index: 4000;
  pointer-events: none;

  > * {
    pointer-events: auto;
  }
}
</style>
