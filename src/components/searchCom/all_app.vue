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
import settingsIcon from "@/assets/icon/appIcon/settings.png";
import explorerIcon from "@/assets/icon/appIcon/explorer.png";
import storeIcon from "@/assets/icon/appIcon/store.png";
import edgeIcon from "@/assets/icon/appIcon/edge.png";
import photosIcon from "@/assets/icon/appIcon/photos.png";

// 类型定义
interface AppItem {
  name: string;
  url: string;
}

// Props 定义
const props = defineProps<{
  title?: string;
}>();

// 应用列表数据
const appList: AppItem[] = [
  {
    name: "设置",
    url: settingsIcon,
  },
  {
    name: "文件资源管理器",
    url: explorerIcon,
  },
  {
    name: "Microsoft Store",
    url: storeIcon,
  },
  {
    name: "Edge",
    url: edgeIcon,
  },
  {
    name: "照片",
    url: photosIcon,
  },
];

// 打开应用
const openApp = (data: AppItem) => {
  if (data.name === "Edge") {
    bus.emit("appStatus", { name: data.name, flag: "open" });
    bus.emit("changeOpenStatus", { name: data.name, flag: "open" });
  }
};
</script>

<style lang="scss" scoped>
.appBox {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: 92px;
  align-items: center;
  grid-column-gap: 6px;

  &Title {
    padding: 27px 0 18px;
    margin-bottom: 8px;
    font-size: 12px;
    font-weight: bold;
  }

  .itemBox {
    width: 100%;
    height: 100%;
    border-radius: 5px;
    border: 1px solid #d2e1ec;
    background-color: #f6f8fe;
    display: grid;
    justify-items: center;
    align-content: center;
    cursor: pointer;

    &:hover {
      background-color: #ebf1f9;
    }

    img {
      height: 32px;
      margin-bottom: 10px;
    }

    div {
      color: #383839;
      font-size: 12px;
    }
  }
}
</style>
