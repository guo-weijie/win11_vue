<template>
  <div>
    <div class="appBoxTitle">{{ props.title }}</div>
    <div class="appBox">
      <div class="itemBox" v-for="item in appList" :key="item.name" @click.stop="openApp(item)" :title="item.name">
        <img :src="item.url" :alt="item.name" />
        <div>{{ item.name }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import bus from "@/utils/bus";
import { appStore, type StatusObjType } from "@/store/app";
import settingsIcon from "@/assets/icon/appIcon/settings.png";
import explorerIcon from "@/assets/icon/appIcon/explorer.png";
import storeIcon from "@/assets/icon/appIcon/store.png";
import edgeIcon from "@/assets/icon/appIcon/edge.png";
import photosIcon from "@/assets/icon/appIcon/photos.png";

// ==================== 类型定义 ====================
interface AppItem {
  name: string;
  url: string;
}

// ==================== Props ====================
const props = defineProps<{
  title?: string;
}>();

// ==================== Store ====================
const aStore = appStore();

// ==================== 应用列表 ====================
const appList: AppItem[] = [
  { name: "设置", url: settingsIcon },
  { name: "文件资源管理器", url: explorerIcon },
  { name: "Microsoft Store", url: storeIcon },
  { name: "Edge", url: edgeIcon },
  { name: "照片", url: photosIcon },
];

// ==================== 打开应用 ====================
const openApp = (data: AppItem) => {
  const app = aStore.getMyApp(data.name);

  if (!app) return;

  if (!app.open) {
    // 未打开：打开应用
    aStore.changeAppStatus({
      name: data.name,
      key: "open",
      value: true,
    } as StatusObjType);
  } else if (app.mini) {
    // 已最小化：恢复并置顶
    aStore.changeAppStatus({
      name: data.name,
      key: "mini",
      value: false,
    } as StatusObjType);
  }

  bus.emit("closeTaskbar");
  bus.emit(data.name);
};
</script>

<style lang="scss" scoped>
.appBox {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  grid-auto-rows: 92px;
  align-items: center;
  gap: 6px;

  &Title {
    padding: 27px 0 18px;
    margin-bottom: 8px;
    font-size: 13px;
    font-weight: 600;
    color: #1a1a1a;
  }

  .itemBox {
    width: 100%;
    height: 100%;
    border-radius: 6px;
    border: 1px solid #e4e4e8;
    background-color: #fafbfc;
    display: grid;
    justify-items: center;
    align-content: center;
    cursor: pointer;
    transition: background-color 150ms ease, transform 100ms ease;
    user-select: none;

    &:hover {
      background-color: var(--start-hover-bg-color);
    }

    &:active {
      transform: scale(0.95);
    }

    img {
      height: 32px;
      margin-bottom: 8px;
    }

    div {
      color: #1a1a1a;
      font-size: 12px;
      font-weight: 500;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 90%;
    }
  }
}
</style>
