<template>
  <div class="otherFnBox">
    <n-icon size="80" color="#7e848c" :component="iconName"></n-icon>
    <div class="bigTitle">搜索 {{ props.title }}</div>
    <div class="smallTitle">开始键入以搜索 {{ props.title }}</div>
  </div>
</template>

<script lang="ts" setup>
import { NIcon } from "naive-ui";
import {
  GlobeSearch20Regular,
  Document20Regular,
  Mail20Regular,
  People20Regular,
  Settings20Regular,
  Video20Regular,
  Folder20Regular,
  MusicNote220Regular,
  Image20Regular,
} from "@vicons/fluent";
import { computed, type Component } from "vue";

// Props 定义
const props = defineProps<{
  title?: string;
}>();

// 图标映射表
const iconMap: Record<string, Component> = {
  文档: Document20Regular,
  网页: GlobeSearch20Regular,
  电子邮件: Mail20Regular,
  人员: People20Regular,
  设置: Settings20Regular,
  视频: Video20Regular,
  文件夹: Folder20Regular,
  音乐: MusicNote220Regular,
};

// 默认图标
const defaultIcon = Image20Regular;

// 计算属性：根据标题获取对应图标
const iconName = computed(() => {
  return props.title ? iconMap[props.title] || defaultIcon : defaultIcon;
});
</script>

<style lang="scss" scoped>
.otherFnBox {
  width: 100%;
  height: 100%;
  @include flex(center, center, column);
}

.n-icon {
  margin-bottom: 40px;
}

.bigTitle {
  font-size: 28px;
  font-weight: bold;
  color: #181a1b;
  margin-bottom: 20px;
}

.smallTitle {
  font-size: 12px;
  color: #181a1b;
}
</style>
