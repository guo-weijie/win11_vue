<template>
  <div class="appContainer" ref="windowRef" v-show="!isHidden" @click.stop="bringToFront">
    <!-- 标题栏 -->
    <TitleBlock v-if="!$slots.titleLeft" :title="title" :bgColor="bgColor" />
    <TitleBlock v-else :title="title" :bgColor="bgColor">
      <slot name="titleLeft" />
    </TitleBlock>

    <!-- 应用主体 -->
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import TitleBlock from "@/components/titleBlock/index.vue";
import { useWindow } from "@/composables/useWindow";

const props = withDefaults(
  defineProps<{
    title: string;
    bgColor?: string;
  }>(),
  {
    bgColor: "#cdcdcd",
  }
);

// 窗口管理
const { windowRef, bringToFront, isHidden } = useWindow(props.title);

// 暴露 windowRef 给父组件（如 snake.vue 用于 ResizeObserver）
defineExpose({ windowRef });
</script>

<style lang="scss" scoped>
.appContainer {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: var(--set-bg-color);
  transition: all 100ms ease-in;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
</style>
