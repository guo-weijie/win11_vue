<template>
  <div class="menuSearch">
    <!-- 搜索框：点击跳转搜索 -->
    <div class="searchBox" @click.stop="openSearch">
      <img :src="searchIcon" alt="搜索" />
      在此键入以搜索
    </div>
  </div>
  <!-- 开始菜单主体 -->
  <div class="menuBody">
    <div class="bodyTitle">
      <div class="titleLeft">{{ viewTitle }}</div>
      <div class="titleRight" @click.stop="changeMenuBodyStatus">
        <n-icon v-show="isAllApps">
          <ChevronLeft16Regular />
        </n-icon>
        <span>{{ isAllApps ? "返回" : "所有应用" }}</span>
        <n-icon v-show="!isAllApps">
          <ChevronRight16Regular />
        </n-icon>
      </div>
    </div>
    <div class="bodyContainer">
      <div class="containerPinned" ref="containerPinned">
        <div class="pinnedAppBox">
          <div 
            class="pinnedList" 
            v-for="item in pinnedList" 
            :key="item.name" 
            @click.stop="pinnedOpenApp(item)"
          >
            <img :src="item.url" :alt="item.name" />
            <span>{{ item.name }}</span>
          </div>
        </div>
        <div class="pinnedRecommend">推荐的项目</div>
        <div class="recommendList">
          <div class="listItem">
            <img :src="snipIcon" alt="截图工具" />
            <div class="itemDesc">
              <div>截图工具</div>
              <span>最近添加</span>
            </div>
          </div>
          <div class="listItem">
            <img :src="getstartedIcon" alt="欢迎使用 Windows" />
            <div class="itemDesc">
              <div>入门</div>
              <span>欢迎使用 Windows</span>
            </div>
          </div>
          <div class="listItem">
            <img :src="visitorIcon" alt="访客数" />
            <div class="itemDesc">
              <div>访客数</div>
              <span id="busuanzi_value_site_uv"></span>
            </div>
          </div>
        </div>
      </div>
      <!-- 所有应用 -->
      <div class="containerAllApp" ref="containerAllApp">
        <!-- 列表 -->
        <transition name="fade">
          <div v-show="!selectLetter" class="appItemBody" ref="appItemBody">
            <div v-for="item in allAppListSorted" :key="item.id" :id="item.id">
              <div 
                class="itemBodyPublic itemBodyIndex" 
                @click.stop="selectLetter = true"
              >
                {{ item.id.toUpperCase() }}
              </div>
              <div
                v-for="app in item.list"
                :key="app.name"
                class="itemBodyPublic itemBodyBox"
                @click.stop="pinnedOpenApp(app)"
              >
                <img :src="app.url" alt="app.name" />
                <span>{{ app.name }}</span>
              </div>
            </div>
          </div>
        </transition>
        <!-- 首字母选择 -->
        <transition name="fade">
          <div v-show="selectLetter" class="appItemLetter">
            <div class="itemLetterBox">
              <div
                v-for="item in letterData"
                :key="item.id + 'l'"
                :class="{ isFlag: item.flag }"
                @click="selectThisLetter(item.id, item.flag)"
              >
                {{ item.id.toUpperCase() }}
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
  <!-- 底部用户头像和电源按钮 -->
  <div class="menuFooter">
    <div class="footerUser">
      <img :src="userAvatarUrl" :alt="userName" />
      <span :title="userName">{{ userName }}</span>
    </div>
    <div class="footerBattery">
      <div class="batterySet" title="设置" @click="openSet">
        <n-icon size="19px">
          <Settings20Regular />
        </n-icon>
      </div>
      <n-popover trigger="click" :show-arrow="false" class="myPopover" :z-index="POPOVER_Z_INDEX">
        <template #trigger>
          <n-icon size="19px" title="电源">
            <Power24Regular />
          </n-icon>
        </template>
        <div class="powerMenuBody">
          <div @click="handlePowerAction('sleep')">
            <n-icon size="20px">
              <WeatherMoon48Regular />
            </n-icon>
            <span>睡眠</span>
          </div>
          <div @click="handlePowerAction('shutdown')">
            <n-icon size="20px">
              <Power24Regular />
            </n-icon>
            <span>关机</span>
          </div>
          <div @click="handlePowerAction('restart')">
            <n-icon size="20px">
              <ArrowCounterclockwise28Regular />
            </n-icon>
            <span>重启</span>
          </div>
        </div>
      </n-popover>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, toRaw, nextTick, onMounted, computed } from "vue";
import { NPopover, NIcon } from "naive-ui";
import {
  Settings20Regular,
  Power24Regular,
  WeatherMoon48Regular,
  ArrowCounterclockwise28Regular,
  ChevronRight16Regular,
  ChevronLeft16Regular,
} from "@vicons/fluent";
import { useRouter } from "vue-router";
import bus from "@/utils/bus";
import { getSpell } from "jian-pinyin";
import { userStore } from "@/store/user";
import { appStore, type AppItem, type appList, type StatusObjType } from "@/store/app";
import { storeToRefs } from "pinia";

// ==================== 常量定义 ====================
const POPOVER_Z_INDEX = 9999;
const MAX_SCROLL_OFFSET = 523;
const LETTER_INDEX = "#abcdefghijklmnopqrstuvwxyz";

// ==================== 路由和 Store ====================
const router = useRouter();
const uStore = userStore();
const aStore = appStore();
const { userAvatar, userName } = storeToRefs(uStore);

// ==================== 事件发射 ====================
const emits = defineEmits<{
  pleaseOpenSearch: [];
}>();

// ==================== 类型定义 ====================
interface LetterItem {
  id: string;
  flag: boolean;
}

interface AppGroup {
  id: string;
  list: appList;
}

type PowerAction = "sleep" | "shutdown" | "restart";

// ==================== 图标资源 ====================
const searchIcon = new URL("@/assets/icon/systemIcon/search.png", import.meta.url).href;
const snipIcon = new URL("@/assets/icon/appIcon/snip.png", import.meta.url).href;
const getstartedIcon = new URL("@/assets/icon/appIcon/getstarted.png", import.meta.url).href;
const visitorIcon = new URL("@/assets/icon/appIcon/visitor.png", import.meta.url).href;

// ==================== 计算属性 ====================
const userAvatarUrl = computed(() => {
  return new URL(`../../../assets/icon/${userAvatar.value}.png`, import.meta.url).href;
});

const viewTitle = computed(() => isAllApps.value ? "所有应用" : "已固定");

const pinnedList = computed(() => aStore.getTypeApp("isPinned") as AppItem[]);

// ==================== 状态管理 ====================
const isAllApps = ref(false);
const selectLetter = ref(false);
const containerPinned = ref<HTMLElement | null>(null);
const containerAllApp = ref<HTMLElement | null>(null);
const appItemBody = ref<HTMLElement | null>(null);
const maxScroll = ref(0);

// ==================== 字母索引数据 ====================
const letterData = ref<LetterItem[]>([]);
const allAppListSorted = ref<AppGroup[]>([]);

// ==================== 初始化函数 ====================
const initLetterData = () => {
  const letters: LetterItem[] = [];
  const groups: AppGroup[] = [];
  
  for (const letter of LETTER_INDEX) {
    letters.push({ id: letter, flag: false });
    groups.push({ id: letter, list: [] });
  }
  
  letterData.value = letters;
  allAppListSorted.value = groups;
};

// ==================== 数据处理 ====================
const processData = () => {
  const apps = toRaw(aStore.getApp);
  
  // 重置数据
  allAppListSorted.value.forEach(group => {
    group.list = [];
  });
  letterData.value.forEach(item => {
    item.flag = false;
  });
  
  // 按首字母分类
  allAppListSorted.value.forEach((group, index) => {
    apps.forEach((app: AppItem) => {
      const firstLetter = getSpell(
        app.name,
        (spell: string) => spell[1],
        ""
      ).slice(0, 1).toLowerCase();
      
      if (group.id === firstLetter) {
        group.list.push(app);
        letterData.value[index].flag = true;
      }
    });
  });
  
  // 过滤空组并排序
  allAppListSorted.value = allAppListSorted.value
    .filter((group: AppGroup) => group.list.length > 0)
    .map((group: AppGroup) => {
      group.list.sort((a: AppItem, b: AppItem) => a.name.localeCompare(b.name));
      return group;
    });
};

// ==================== 事件处理 ====================
const handlePowerAction = (action: PowerAction) => {
  const actions: Record<PowerAction, () => void> = {
    sleep: () => router.push("login"),
    shutdown: () => console.log("关机功能开发中..."),
    restart: () => console.log("重启功能开发中..."),
  };
  
  actions[action]?.();
};

const openSet = () => {
  aStore.changeAppStatus({
    name: "设置",
    key: "mini",
    value: false,
  } as StatusObjType);

  aStore.changeAppStatus({
    name: "设置",
    key: "open",
    value: true,
  } as StatusObjType);

  bus.emit("closeTaskbar");
  bus.emit("设置");
};

const openSearch = () => {
  emits("pleaseOpenSearch");
};

const selectThisLetter = async (letter: string, hasApps: boolean) => {
  if (!hasApps || !containerAllApp.value) return;
  
  selectLetter.value = false;
  await nextTick();
  
  const element = document.querySelector(`#${letter}`) as HTMLElement;
  if (element && containerAllApp.value) {
    const scrollTop = Math.min(element.offsetTop, maxScroll.value);
    containerAllApp.value.scrollTop = scrollTop;
  }
};

const toggleMenuView = () => {
  if (!containerPinned.value || !containerAllApp.value) return;
  
  isAllApps.value = !isAllApps.value;
  
  if (isAllApps.value) {
    containerPinned.value.style.left = "-110%";
    containerAllApp.value.style.left = "0";
  } else {
    containerPinned.value.style.left = "0";
    containerAllApp.value.style.left = "110%";
    selectLetter.value = false;
  }
};

const changeMenuBodyStatus = toggleMenuView;

const pinnedOpenApp = (app: AppItem) => {
  if (!app.open) {
    aStore.changeAppStatus({
      name: app.name,
      key: "open",
      value: true,
    } as StatusObjType);
  } else if (app.mini) {
    // 应用最小化时点击：恢复显示，handleMiniStateChange 会自动置顶
    aStore.changeAppStatus({
      name: app.name,
      key: "mini",
      value: false,
    } as StatusObjType);
  }
  
  bus.emit("closeTaskbar");
  bus.emit(app.name);
};

// ==================== 生命周期 ====================
onMounted(() => {
  initLetterData();
  processData();
  
  if (appItemBody.value) {
    maxScroll.value = appItemBody.value.scrollHeight - MAX_SCROLL_OFFSET;
  }
});
</script>

<style lang="scss" scoped>
@mixin bgHover {
  border-radius: 5px;
  background-color: inherit;
  transition: background-color 150ms ease, transform 100ms ease;

  &:hover {
    background-color: var(--start-hover-bg-color);
    cursor: pointer;
  }
  
  &:active {
    transform: scale(0.97);
  }
}

.menuSearch {
  box-sizing: border-box;
  width: 100%;
  height: 70px;
  padding: 32px 32px 0;
  background-color: var(--start-main-bg-color);

  .searchBox {
    height: 38px;
    background-color: var(--start-search-input-bg-color);
    border: 1px solid #e0e0e0;
    border-bottom: 2px solid var(--global-theme-color);
    border-radius: 22px;
    font-size: 13px;
    color: var(--global-placeholder-font-color);
    cursor: pointer;
    @include flex(flex-start, center);
    transition: box-shadow 150ms ease;

    &:hover {
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
    }

    img {
      height: 14px;
      margin-left: 16px;
      margin-right: 12px;
    }
  }
}

.menuBody {
  box-sizing: border-box;
  width: 100%;
  height: calc(100% - 70px - 64px);
  padding: 16px 32px 0;
  background-color: var(--start-main-bg-color);

  .bodyTitle {
    width: 100%;
    height: 48px;
    margin-bottom: 8px;
    @include flex(space-between, center);

    .titleLeft {
      font-size: 14px;
      font-weight: 600;
      color: #1a1a1a;
    }

    .titleRight {
      padding: 6px 12px;
      background-color: var(--start-right-btn-bg-color);
      border: 1px solid var(--start-right-btn-border-color);
      border-radius: 5px;
      cursor: pointer;
      @include flex(center, center);
      transition: background-color 150ms ease;

      &:hover {
        background-color: rgba(0, 0, 0, 0.04);
      }

      &:active {
        transform: scale(0.97);
      }

      span {
        font-size: 12px;
        margin: 0 4px;
      }

      .n-icon {
        font-size: 14px;
      }
    }
  }

  .bodyContainer {
    width: 100%;
    height: calc(100% - 56px);
    position: relative;
  }
}

.menuFooter {
  box-sizing: border-box;
  width: 100%;
  height: 63px;
  padding: 0 48px;
  background-color: var(--start-footer-bg-color);
  border-top: 1px solid var(--global-window-division-color);
  @include flex(space-between, center);

  .footerUser {
    height: 40px;
    line-height: 40px;
    padding: 0 12px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 150ms ease;
    @include flex(flex-start, center);

    &:hover {
      background-color: var(--start-hover-bg-color);
    }

    img {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      margin-right: 10px;
      object-fit: cover;
    }

    span {
      font-size: 12px;
      color: #1a1a1a;
    }
  }

  .footerBattery {
    @include flex(flex-end, center);
    gap: 4px;

    .batterySet {
      width: 40px;
      height: 40px;
      border-radius: 5px;
      cursor: pointer;
      @include flex(center, center);
      transition: background-color 150ms ease;

      &:hover {
        background-color: var(--start-hover-bg-color);
      }

      &:active {
        transform: scale(0.95);
      }
    }

    .n-icon {
      @extend .batterySet;
    }
  }
}

@at-root .powerMenuBody {
  padding: 4px;

  > div {
    padding: 8px 16px;
    border-radius: 5px;
    @include flex(flex-start, center);
    user-select: none;
    cursor: pointer;
    transition: background-color 150ms ease;

    &:nth-of-type(2) {
      margin: 4px 0;
    }
    
    &:hover {
      background-color: var(--start-hover-bg-color);
    }

    &:active {
      transform: scale(0.97);
    }
  }

  span {
    font-size: 13px;
    margin-left: 12px;
  }
}

// 开始菜单主体 - 固定应用区域
.containerPinned {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  transition: left 300ms ease-in-out;
  overflow-y: auto;
  padding: 0 4px 32px;
  
  &::-webkit-scrollbar {
    width: 2px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: var(--global-scrollbar-color);
    border-radius: 1px;
  }

  .pinnedAppBox {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-template-rows: auto;
    gap: 4px;
    justify-items: center;
    align-items: start;
    margin-bottom: 32px;
  }

  .pinnedList {
    width: 100%;
    aspect-ratio: 1;
    max-width: 84px;
    padding: 8px 4px 6px;
    border-radius: 6px;
    @include flex(center, center, column);
    transition: background-color 150ms ease, transform 100ms ease;
    user-select: none;

    &:hover {
      background-color: var(--start-hover-bg-color);
      cursor: pointer;
    }

    &:active {
      transform: scale(0.95);
    }

    img {
      width: 30px;
      height: 30px;
      margin-bottom: 4px;
    }

    span {
      font-size: 11px;
      color: #1a1a1a;
      line-height: 1.3;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 100%;
    }
  }

  .pinnedRecommend {
    font-size: 13px;
    font-weight: 600;
    padding-left: 8px;
    margin-bottom: 16px;
    color: #1a1a1a;
    line-height: 1;
  }

  .recommendList {
    padding: 0 8px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: auto;
    gap: 4px;

    .listItem {
      box-sizing: border-box;
      width: 100%;
      padding: 10px 12px;
      border-radius: 6px;
      @include flex(flex-start, center);
      transition: background-color 150ms ease, transform 100ms ease;
      user-select: none;

      &:hover {
        background-color: var(--start-hover-bg-color);
        cursor: pointer;
      }

      &:active {
        transform: scale(0.97);
      }

      img {
        width: 30px;
        height: 30px;
        border-radius: 6px;
        margin-right: 12px;
        flex-shrink: 0;
      }

      .itemDesc {
        font-size: 12px;
        min-width: 0;

        div {
          margin-bottom: 2px;
          color: #1a1a1a;
          font-weight: 500;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        span {
          color: var(--start-desc-font-color);
          font-size: 11px;
          display: block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
}

.containerAllApp {
  box-sizing: border-box;
  width: calc(100% + 28px);
  height: 100%;
  padding-left: 30px;
  padding-bottom: 20px;
  position: absolute;
  top: 0;
  left: 110%;
  transition: left 300ms ease-in-out;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 2px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--global-scrollbar-color);
    border-radius: 1px;
  }

  .itemBodyPublic {
    width: 90%;
    height: 40px;
    font-size: 12px;
    padding-left: 20px;
    margin-left: -20px;
    border-radius: 5px;
    transition: background-color 150ms ease;

    &:hover {
      background-color: var(--start-hover-bg-color);
      cursor: pointer;
    }

    &:active {
      transform: scale(0.98);
    }
  }

  .itemBodyIndex {
    text-indent: 0.8em;
    line-height: 40px;
    font-weight: 600;
    font-size: 13px;
    color: #1a1a1a;
  }

  .itemBodyBox {
    @include flex(flex-start, center);

    img {
      width: 28px;
      height: 28px;
      margin-right: 16px;
    }

    span {
      font-size: 13px;
      color: #1a1a1a;
    }
  }

  .appItemBody {
    width: 100%;
  }
}

.appItemLetter {
  box-sizing: border-box;
  width: calc(100% - 28px);
  height: 100%;
  padding-right: 30px;
  @include flex(center, center);

  .itemLetterBox {
    display: grid;
    grid-template-columns: repeat(4, 56px);
    grid-template-rows: repeat(7, 48px);

    div {
      width: 100%;
      height: 48px;
      line-height: 48px;
      text-align: center;
      font-size: 14px;
      color: var(--start-letterlist-none-color);
      font-weight: 500;
    }

    .isFlag {
      color: var(--start-letterlist-have-color);
      border-radius: 5px;
      transition: background-color 150ms ease;

      &:hover {
        background-color: var(--start-hover-bg-color);
        cursor: pointer;
      }

      &:active {
        transform: scale(0.95);
      }
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

// 所有应用容器过渡动画
.containerPinned,
.containerAllApp {
  will-change: left;
}
</style>
