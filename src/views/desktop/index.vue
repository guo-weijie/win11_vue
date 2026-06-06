<template>
  <div class="desktop" @click="closeAllTaskbarPopups">
    <!-- 桌面应用图标 -->
    <div class="desktopAppContainer">
      <div v-for="item in desktopApps" :key="item.name" class="desktopApp" @dblclick="openApp(item)">
        <img :src="item.url" :alt="item.name" />
        <p>{{ item.name }}</p>
      </div>
    </div>

    <!-- 应用窗口 - 动态渲染 -->
    <component v-for="app in openedApps" :key="app.name" :is="getAppComponent(app.name)" />
  </div>
</template>

<script lang="ts" setup>
import { computed, type Component } from "vue";
import { appStore, type appItem } from "@/store/app";
import bus from "@/utils/bus";

// 导入所有应用组件
import Edge from "./app/edge.vue";
import Setup from "@/views/setUp/index.vue";
import Photo from "./app/photo.vue";
import Snake from "./app/snake.vue";

const store = appStore();

/**
 * 应用组件映射表
 */
const appComponentMap: Record<string, Component> = {
  Edge: Edge,
  设置: Setup,
  照片: Photo,
  贪吃蛇: Snake,
};

/**
 * 获取桌面应用列表
 */
const desktopApps = computed(() => store.getTypeApp("isDesktop"));

/**
 * 获取已打开且可见的应用列表
 */
const openedApps = computed(() => store.getApp.filter((app: appItem) => app.open && !app.hidden));

/**
 * 根据应用名称获取对应的组件
 * @param appName 应用名称
 * @returns 组件或 null
 */
const getAppComponent = (appName: string): Component | null => {
  return appComponentMap[appName] || null;
};

/**
 * 打开应用或从最小化状态恢复
 * @param app 应用项
 */
const openApp = (app: appItem) => {
  if (app.mini) {
    // 应用处于最小化状态，恢复显示并置顶
    store.changeAppStatus({
      name: app.name,
      key: "hidden",
      value: false,
    });
    store.changeAppStatus({
      name: app.name,
      key: "mini",
      value: false,
    });
    store.changeAppStatus({
      name: app.name,
      key: "isTop",
      value: true,
    });
  } else if (!app.open) {
    // 应用未打开，则打开（openApp 内部已设置 isTop=true）
    store.changeAppStatus({
      name: app.name,
      key: "open",
      value: true,
    });
  } else if (!app.isTop) {
    // 应用已打开但不在顶层，则置顶
    store.changeAppStatus({
      name: app.name,
      key: "isTop",
      value: true,
    });
  }
};

/**
 * 点击桌面时关闭所有任务栏弹窗
 */
const closeAllTaskbarPopups = () => {
  bus.emit("closeTaskbar");
};
</script>

<style lang="scss" scoped>
@use "@/style/public" as *;

.desktop {
  position: relative;
  height: calc(100% - 48px);
}

.desktopAppContainer {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  @include flex(flex-start, flex-start, column);

  .desktopApp {
    text-align: center;
    padding: 3px;
    margin: 6px 0 22px 1px;

    &:active {
      border-top-right-radius: 2px;
      border-bottom-left-radius: 2px;
      background-color: rgba(255, 255, 255, 0.1);
    }

    img {
      height: 50px;
    }

    p {
      width: 80px;
      line-height: 16px;
      padding: 0;
      margin: 0;
      font-size: 12px;
      color: #ffffff;
    }
  }
}

.appContainer {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: var(--set-bg-color);
  transition: all 100ms ease-in;
  :deep(.appBody) {
    width: 100%;
    height: calc(100% - 40px);
  }
}

.dragStyle {
  width: 50%;
  height: 60%;
}

// 应用窗口样式
.halfOnLeft {
  width: 50%;
}

.halfOnRight {
  width: 50%;
  left: 50%;
}

.moreOnLeft {
  width: 60%;
}

.moreOnRight {
  width: 40%;
  left: 60%;
}

.thirdOnLeft {
  width: 33%;
}

.thirdOnCenter {
  width: 33%;
  left: 33%;
}

.thirdOnRight {
  width: 33%;
  left: calc(100% - 33%);
}

.thirdOnTop {
  width: 50%;
  height: 50%;
  left: 50%;
}

.thirdOnBottom {
  width: 50%;
  height: 50%;
  left: 50%;
  top: 50%;
}

.quarterOnLeftTop {
  width: 50%;
  height: 50%;
}

.quarterOnLeftBottom {
  width: 50%;
  height: 50%;
  top: 50%;
}

.moreThirdLeft {
  width: 25%;
}

.moreThirdCenter {
  width: 50%;
  left: 25%;
}

.moreThirdRight {
  width: 25%;
  left: 75%;
}

.centerCenter {
  width: 50%;
  height: 60%;
  left: 25%;
  top: 20%;
}
</style>
