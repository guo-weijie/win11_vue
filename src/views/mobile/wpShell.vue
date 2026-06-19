<template>
  <!-- Shell 主体（不含底部栏） -->
  <div class="wp-shell">
    <!-- 状态栏 -->
    <div class="wp-statusBar">
      <span class="wp-statusTime">{{ statusTime }}</span>
      <span class="wp-statusIcons">
        <!-- 信号强度：WP8.1 五格竖条 -->
        <svg class="wp-signal" viewBox="0 0 16 10" width="14" height="10">
          <rect x="0" y="8" width="2" height="2" rx="0.3" fill="currentColor" />
          <rect x="3" y="6" width="2" height="4" rx="0.3" fill="currentColor" />
          <rect x="6" y="3.5" width="2" height="6.5" rx="0.3" fill="currentColor" />
          <rect x="9" y="1.5" width="2" height="8.5" rx="0.3" fill="currentColor" />
          <rect x="12" y="0" width="2" height="10" rx="0.3" fill="currentColor" />
        </svg>
        <!-- WiFi：WP8.1 同心弧 -->
        <svg class="wp-wifi" viewBox="0 0 16 12" width="14" height="12">
          <path d="M8 1.5 C12.5 1.5 16 3.5 16 5" stroke="currentColor" stroke-width="1.2" fill="none" stroke-linecap="round" />
          <path d="M8 4 C10.7 4 13.2 5.3 14.5 6.7" stroke="currentColor" stroke-width="1.2" fill="none" stroke-linecap="round" />
          <path d="M8 6.5 C9.8 6.5 11.4 7.3 12.3 8.2" stroke="currentColor" stroke-width="1.2" fill="none" stroke-linecap="round" />
          <circle cx="8" cy="10" r="1.2" fill="currentColor" />
        </svg>
        <!-- 电池：WP8.1 电池轮廓 -->
        <svg class="wp-battery" viewBox="0 0 18 10" width="16" height="10">
          <rect x="0" y="0" width="14" height="10" rx="1.5" stroke="currentColor" stroke-width="1" fill="none" />
          <rect x="14" y="3" width="2" height="4" rx="0.5" fill="currentColor" />
          <rect x="1.5" y="1.5" width="11" height="7" rx="1" fill="currentColor" />
        </svg>
      </span>
    </div>

    <!-- Pivot 导航主体 -->
    <div class="wp-body" :style="{ transform: `translateX(-${currentPage * (100 / 3)}%)` }">
      <!-- 页面1: 磁贴主页 -->
      <div
        class="wp-page wp-tilesPage"
        :style="tileBackground ? { backgroundImage: `url(${tileBackground})` } : {}"
        @touchstart="onSwipeStart"
        @touchend="onSwipeEnd"
      >
        <div class="wp-tiles" ref="tilesContainer">
          <!-- 大磁贴 -->
          <div class="wp-tile wp-tile--large" :style="{ backgroundColor: accentColors[0] }" @click="openAppTile('Edge')">
            <div class="wp-tileContent">
              <img :src="edgeIcon" alt="Edge" class="wp-tileIcon--large" />
              <span class="wp-tileLabel">Edge</span>
            </div>
          </div>

          <!-- 中等磁贴 2x1 -->
          <div class="wp-tile wp-tile--wide" :style="{ backgroundColor: accentColors[1] }" @click="openAppTile('文件资源管理器')">
            <div class="wp-tileContent wp-tileContent--wide">
              <img :src="explorerIcon" alt="文件资源管理器" class="wp-tileIcon" />
              <span class="wp-tileLabel">资源管理器</span>
            </div>
          </div>

          <!-- 小磁贴 3列 -->
          <div class="wp-tile wp-tile--small" :style="{ backgroundColor: accentColors[2] }" @click="openAppTile('设置')">
            <div class="wp-tileContent">
              <img :src="settingsIcon" alt="设置" class="wp-tileIcon--small" />
              <span class="wp-tileLabel--small">设置</span>
            </div>
          </div>
          <div class="wp-tile wp-tile--small" :style="{ backgroundColor: accentColors[3] }" @click="openAppTile('Microsoft Store')">
            <div class="wp-tileContent">
              <img :src="storeIcon" alt="Store" class="wp-tileIcon--small" />
              <span class="wp-tileLabel--small">Store</span>
            </div>
          </div>
          <div class="wp-tile wp-tile--small" :style="{ backgroundColor: accentColors[4] }" @click="openAppTile('照片')">
            <div class="wp-tileContent">
              <img :src="photosIcon" alt="照片" class="wp-tileIcon--small" />
              <span class="wp-tileLabel--small">照片</span>
            </div>
          </div>

          <!-- 更多应用磁贴 -->
          <div
            v-for="(app, idx) in otherApps"
            :key="app.name"
            class="wp-tile wp-tile--small"
            :style="{ backgroundColor: accentColors[(idx + 5) % accentColors.length] }"
            @click="openAppTile(app.name)"
          >
            <div class="wp-tileContent">
              <img :src="app.url" :alt="app.name" class="wp-tileIcon--small" />
              <span class="wp-tileLabel--small">{{ app.name }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 页面2: 所有应用列表 -->
      <div
        class="wp-page wp-appListPage"
        @touchstart="onSwipeStart"
        @touchend="onSwipeEnd"
      >
        <div class="wp-pageHeader">
          <div class="wp-title">应用</div>
        </div>
        <div class="wp-appList">
          <div
            v-for="app in allAppsForMobile"
            :key="app.name"
            class="wp-listItem"
            @click="openAppTile(app.name)"
          >
            <img :src="app.url" :alt="app.name" class="wp-listIcon" />
            <div class="wp-listText">
              <span class="wp-listTitle">{{ app.name }}</span>
              <span class="wp-listDesc">{{ app.desc || '' }}</span>
            </div>
            <svg viewBox="0 0 24 24" class="wp-listArrow"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" fill="currentColor"/></svg>
          </div>
        </div>
      </div>

      <!-- 页面3: 搜索页 -->
      <div class="wp-page wp-searchPage">
        <div class="wp-pageHeader">
          <div class="wp-title">搜索</div>
        </div>
        <div class="wp-searchInput">
          <svg viewBox="0 0 24 24" class="wp-searchIcon--large"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" fill="currentColor"/></svg>
          <input
            v-model="searchText"
            type="text"
            placeholder="在此键入进行搜索"
            class="wp-searchField"
          />
        </div>
        <div class="wp-searchResults" v-if="searchText">
          <div
            v-for="app in filteredApps"
            :key="app.name"
            class="wp-listItem"
            @click="openAppTile(app.name)"
          >
            <img :src="app.url" :alt="app.name" class="wp-listIcon" />
            <span class="wp-listTitle">{{ app.name }}</span>
          </div>
          <div v-if="filteredApps.length === 0" class="wp-noResults">
            没有找到相关应用
          </div>
        </div>
        <div v-else class="wp-searchHint">
          <span>输入关键词搜索应用、文档和网页</span>
        </div>
      </div>
    </div>
  </div>

  <!-- WP8.1 底部应用栏 — 独立堆叠上下文，始终置顶 -->
  <div class="wp-appBar">
    <div
      class="wp-appBarBtn"
      :class="{ 'wp-appBarBtn--disabled': currentPage === 0 && !isAppOpen }"
      @click="onAppBarBack"
    >
      <!-- 后退箭头 -->
      <svg viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" fill="currentColor"/></svg>
    </div>
    <div
      class="wp-appBarBtn"
      :class="{ 'wp-appBarBtn--active': currentPage === 0 }"
      @click="onAppBarHome"
    >
      <!-- Windows 徽标 -->
      <img :src="winLogo" alt="Win" class="wp-winLogo" />
    </div>
    <div
      class="wp-appBarBtn"
      :class="{ 'wp-appBarBtn--active': currentPage === 2 }"
      @click="onAppBarSearch"
    >
      <!-- 搜索 -->
      <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" fill="currentColor"/></svg>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import bus from "@/utils/bus";
import { appStore, type StatusObjType } from "@/store/app";
import { useCurrentTime } from "@/composables/useCurrentTime";
import { getLoginBg } from "@/api";

// ==================== 图标资源 ====================
import edgeIcon from "@/assets/icon/appIcon/edge.png";
import explorerIcon from "@/assets/icon/appIcon/explorer.png";
import settingsIcon from "@/assets/icon/appIcon/settings.png";
import storeIcon from "@/assets/icon/appIcon/store.png";
import photosIcon from "@/assets/icon/appIcon/photos.png";
import alarmIcon from "@/assets/icon/appIcon/alarm.png";
import codeIcon from "@/assets/icon/appIcon/code.png";
import terminalIcon from "@/assets/icon/appIcon/terminal.png";
import snakeIcon from "@/assets/icon/appIcon/snake.jpg";
import PaintIcon from "@/assets/icon/appIcon/paint.png";
import cortanaIcon from "@/assets/icon/appIcon/cortana.png";
import winLogo from "@/assets/icon/systemIcon/winLogo.png";

// ==================== Store ====================
const aStore = appStore();

// ==================== 时间 ====================
const { currentTime } = useCurrentTime();

// ==================== 导航状态 ====================
const currentPage = ref(0);
const searchText = ref("");

// ==================== 磁贴页背景图片 ====================
const tileBackground = ref<string>("");

const fetchTileBackground = async () => {
  try {
    const blob = await getLoginBg() as unknown as Blob;
    tileBackground.value = URL.createObjectURL(blob);
  } catch (e) {
    console.warn("Failed to fetch tile background:", e);
  }
};

onMounted(() => {
  fetchTileBackground();
});

// ==================== WP8.1 强调色 ====================
const accentColors = [
  "#0078d7", // 蓝
  "#107c10", // 绿
  "#d83b01", // 橙
  "#8661c5", // 紫
  "#e81123", // 红
  "#00b7c3", // 青
  "#767676", // 灰
  "#e74856", // 粉
  "#ff8c00", // 琥珀
  "#00cf64", // 翠绿
];

// ==================== 应用列表 ====================
interface MobileApp {
  name: string;
  url: string;
  desc?: string;
}

const otherApps: MobileApp[] = [
  { name: "时钟", url: alarmIcon, desc: "闹钟与世界时钟" },
  { name: "Visual Studio Code", url: codeIcon, desc: "代码编辑器" },
  { name: "终端", url: terminalIcon, desc: "命令行终端" },
  { name: "贪吃蛇", url: snakeIcon, desc: "经典游戏" },
  { name: "画图", url: PaintIcon, desc: "创意画板" },
  { name: "cortana", url: cortanaIcon, desc: "语音助手" },
];

const allAppsForMobile = computed<MobileApp[]>(() => {
  return [
    { name: "Edge", url: edgeIcon, desc: "浏览器" },
    { name: "文件资源管理器", url: explorerIcon, desc: "文件和文件夹" },
    { name: "Microsoft Store", url: storeIcon, desc: "应用商店" },
    { name: "设置", url: settingsIcon, desc: "系统设置" },
    { name: "照片", url: photosIcon, desc: "照片图库" },
    ...otherApps,
  ];
});

const filteredApps = computed(() => {
  if (!searchText.value) return [];
  const q = searchText.value.toLowerCase();
  return allAppsForMobile.value.filter(
    (app) =>
      app.name.toLowerCase().includes(q) ||
      (app.desc && app.desc.toLowerCase().includes(q))
  );
});

// ==================== 计算：状态栏时间 ====================
const statusTime = computed(() => {
  const h = currentTime.hour;
  const m = currentTime.minute;
  return `${String(h).padStart(2, "0")}:${m}`;
});

// ==================== 导航 ====================
const pageHistory = ref<number[]>([]);

const goToPage = (page: number) => {
  pageHistory.value.push(currentPage.value);
  currentPage.value = page;
};

const goBack = () => {
  const prev = pageHistory.value.pop();
  if (prev !== undefined) {
    currentPage.value = prev;
  }
};

// ==================== 应用开关检测 ====================
const isAppOpen = computed(() => {
  return aStore.getApp.some((app) => app.open);
});

const topAppName = computed(() => {
  const top = aStore.getApp.find((app) => app.isTop && app.open);
  return top?.name || null;
});

const closeCurrentApp = () => {
  if (!topAppName.value) return;
  aStore.changeAppStatus({
    name: topAppName.value,
    key: "open",
    value: false,
  } as StatusObjType);
};

// ==================== 底部栏按钮：应用打开时关闭 + 导航 ====================
const onAppBarBack = () => {
  if (isAppOpen.value) {
    closeCurrentApp();
    return;
  }
  goBack();
};

const onAppBarHome = () => {
  if (isAppOpen.value) {
    closeCurrentApp();
  }
  // 清除历史并回到磁贴页
  pageHistory.value = [];
  currentPage.value = 0;
};

const onAppBarSearch = () => {
  if (isAppOpen.value) {
    closeCurrentApp();
  }
  goToPage(2);
};

// ==================== 滑动手势 ====================
let touchStartX = 0;
let touchStartY = 0;

const onSwipeStart = (e: TouchEvent) => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
};

const onSwipeEnd = (e: TouchEvent) => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;
  // 水平滑动距离 > 垂直距离（防止垂直滚动误触）
  if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
    if (dx < 0 && currentPage.value === 0) {
      // 左划：磁贴 → 应用列表
      goToPage(1);
    } else if (dx > 0 && currentPage.value === 1) {
      // 右划：应用列表 → 磁贴
      goBack();
    }
  }
};

// ==================== 打开应用 ====================
const openAppTile = (appName: string) => {
  const app = aStore.getMyApp(appName);
  if (!app) return;

  if (!app.open) {
    aStore.changeAppStatus({
      name: appName,
      key: "open",
      value: true,
    } as StatusObjType);
  } else if (app.mini) {
    aStore.changeAppStatus({
      name: appName,
      key: "mini",
      value: false,
    } as StatusObjType);
  }

  bus.emit(appName);
};
</script>

<style lang="scss" scoped>
@use "@/style/responsive" as *;

// ==========================================
// WP8.1 Shell 布局
// ==========================================
.wp-shell {
  position: fixed;
  inset: 0;
  background-color: var(--wp-bg-color);
  color: var(--wp-font-color);
  font-family: "Segoe UI", "Segoe WP", system-ui, -apple-system, sans-serif;
  overflow: hidden;
  z-index: 0;

  * {
    -webkit-tap-highlight-color: transparent;
  }
}

// 状态栏
.wp-statusBar {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 28px;
  padding: 4px 12px 0;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.7);
  z-index: 2;
  overflow: hidden;

  .wp-statusTime {
    flex-shrink: 0;
  }

  .wp-statusIcons {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;

    svg {
      display: block;
      color: inherit;
    }
  }
}

// Pivot 主体（三页水平滑动）
.wp-body {
  position: absolute;
  top: 28px;
  left: 0;
  width: calc(100% * 3);
  height: calc(100% - 28px - 56px);
  display: flex;
  transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;
}

.wp-page {
  width: calc(100% / 3);
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 20px;
}

// ==========================================
// 页面标题
// ==========================================
.wp-pageHeader {
  padding: 36px 20px 20px;

  .wp-title {
    font-size: 40px;
    font-weight: 300;
    letter-spacing: -1px;
    line-height: 1;
  }

  .wp-subtitle {
    font-size: 13px;
    color: var(--wp-font-muted);
    margin-top: 8px;
    font-weight: 400;
  }
}

// ==========================================
// 磁贴主页
// ==========================================
.wp-tilesPage {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.wp-tiles {
  padding: 12px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
}

// 大磁贴 (2x1)
.wp-tile--large {
  grid-column: span 2;
  grid-row: span 2;
  height: 160px;
}

// 宽磁贴 (2x1)
.wp-tile--wide {
  grid-column: span 2;
  height: 76px;
}

// 小磁贴 (1x1)
.wp-tile--small {
  height: 76px;
}

.wp-tile {
  border-radius: 0;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  user-select: none;
  transition: transform 100ms ease, opacity 120ms ease;

  &:active {
    transform: scale(0.94);
    opacity: 0.9;
  }
}

.wp-tileContent {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 10px 12px;
  overflow: hidden;
}

.wp-tileContent--wide {
  flex-direction: row;
  align-items: center;
  gap: 12px;
}

.wp-tileIcon--large {
  width: 48px;
  height: 48px;
  position: absolute;
  top: 14px;
  left: 14px;
}

.wp-tileIcon {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
}

.wp-tileIcon--small {
  width: 28px;
  height: 28px;
  margin-bottom: 6px;
}

.wp-tileLabel {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 400;
  letter-spacing: 0.2px;
}

.wp-tileLabel--small {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.85);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

// ==========================================
// 所有应用列表页
// ==========================================
.wp-searchBox {
  margin: 0 16px 12px;
  height: 44px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 14px;
  background-color: var(--wp-search-bg);
  color: var(--wp-search-font);
  font-size: 14px;
  cursor: pointer;
  user-select: none;

  .wp-searchIcon {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }
}

.wp-appList {
  padding: 0;
}

.wp-listItem {
  display: flex;
  align-items: center;
  padding: 14px 20px;
  min-height: 56px;
  border-bottom: 1px solid var(--wp-divider-color);
  cursor: pointer;
  user-select: none;
  transition: background-color 150ms ease;

  &:active {
    background-color: var(--wp-hover-bg);
  }
}

.wp-listIcon {
  width: 36px;
  height: 36px;
  margin-right: 14px;
  flex-shrink: 0;
}

.wp-listText {
  flex: 1;
  min-width: 0;

  .wp-listTitle {
    display: block;
    font-size: 15px;
    font-weight: 400;
    color: var(--wp-font-color);
  }

  .wp-listDesc {
    display: block;
    font-size: 12px;
    color: var(--wp-font-muted);
    margin-top: 2px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.wp-listArrow {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  color: var(--wp-font-muted);
}

// ==========================================
// 搜索页
// ==========================================
.wp-searchInput {
  margin: 0 16px 16px;
  height: 44px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 14px;
  border: 2px solid var(--wp-accent-color);
  background-color: rgba(255, 255, 255, 0.08);

  .wp-searchIcon--large {
    width: 20px;
    height: 20px;
    color: var(--wp-font-muted);
    flex-shrink: 0;
  }
}

.wp-searchField {
  flex: 1;
  height: 100%;
  border: none;
  background: transparent;
  color: var(--wp-font-color);
  font-size: 15px;
  outline: none;

  &::placeholder {
    color: var(--wp-search-font);
  }
}

.wp-searchHint {
  padding: 60px 20px;
  text-align: center;
  color: var(--wp-font-muted);
  font-size: 14px;
}

.wp-noResults {
  padding: 60px 20px;
  text-align: center;
  color: var(--wp-font-muted);
  font-size: 14px;
}

// ==========================================
// 底部应用栏
// ==========================================
.wp-appBar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  background-color: var(--wp-appbar-bg);
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  z-index: 6000;
}

.wp-appBarBtn {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: color 150ms ease, background-color 150ms ease;

  svg,
  .wp-winLogo {
    width: 22px;
    height: 22px;
  }

  .wp-winLogo {
    filter: brightness(0) invert(1);
    opacity: 0.5;
  }

  &:active {
    background-color: rgba(255, 255, 255, 0.1);
  }

  &--active {
    color: #fff;

    .wp-winLogo {
      opacity: 1;
    }
  }

  &--disabled {
    color: rgba(255, 255, 255, 0.2);
    pointer-events: none;
  }
}
</style>
