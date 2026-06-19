<template>
  <div class="appContainer" ref="windowRef" v-show="!isHidden" @click.stop="bringToFront">
    <!-- 标题栏：移动端不显示 -->
    <template v-if="!isMobile">
      <TitleBlock v-if="!$slots.titleLeft" :title="title" :bgColor="bgColor" />
      <TitleBlock v-else :title="title" :bgColor="bgColor">
        <slot name="titleLeft" />
      </TitleBlock>
    </template>

    <!-- 应用主体 -->
    <div class="appContent">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import TitleBlock from "@/components/titleBlock/index.vue";
import { useWindow } from "@/composables/useWindow";
import { useMobile } from "@/composables/useMobile";

const props = withDefaults(
  defineProps<{
    title: string;
    bgColor?: string;
  }>(),
  {
    bgColor: "#cdcdcd",
  }
);

// 移动端检测
const { isMobile } = useMobile();

// 窗口管理
const { windowRef, bringToFront, isHidden } = useWindow(props.title);

// 暴露 windowRef 给父组件（如 snake.vue 用于 ResizeObserver）
defineExpose({ windowRef });
</script>

<style lang="scss" scoped>
@use "@/style/responsive" as *;

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

  @include mobile {
    width: 100vw;
    height: calc(100vh - 56px);
    position: fixed;
    z-index: 5000;
    left: 0;
    top: 0;
    bottom: auto;
  }
}

.appContent {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}
</style>
