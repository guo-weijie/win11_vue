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
      <div class="titleLeft">{{ isAllApps ? "所有应用" : "已固定" }}</div>
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
          <div class="pinnedList" v-for="item in pinnedList" :key="item.name" @click.stop="pinnedOpenApp(item)">
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
            <div v-for="item in allAppList_sorted" :key="item.id" :id="item.id">
              <div class="itemBodyPublic itemBodyIndex" @click.stop="selectLetter = true">
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
      <n-popover trigger="click" :show-arrow="false" class="myPopover" :z-index="zIndex">
        <template #trigger>
          <n-icon size="19px" title="电源">
            <Power24Regular />
          </n-icon>
        </template>
        <div class="poperBody">
          <div @click="powerEvent('睡眠')">
            <n-icon size="20px">
              <WeatherMoon48Regular />
            </n-icon>
            <span>睡眠</span>
          </div>
          <div @click="powerEvent('关机')">
            <n-icon size="20px">
              <Power24Regular />
            </n-icon>
            <span>关机</span>
          </div>
          <div @click="powerEvent('重启')">
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
import { appStore, type appItem, type appList, type statusObjType } from "@/store/app";
import { storeToRefs } from "pinia";

const router = useRouter();

// 图标资源
const searchIcon = new URL("@/assets/icon/systemIcon/search.png", import.meta.url).href;
const snipIcon = new URL("@/assets/icon/appIcon/snip.png", import.meta.url).href;
const getstartedIcon = new URL("@/assets/icon/appIcon/getstarted.png", import.meta.url).href;
const visitorIcon = new URL("@/assets/icon/appIcon/visitor.png", import.meta.url).href;

// Store
const uStore = userStore();
const aStore = appStore();
const { userAvatar, userName } = storeToRefs(uStore);

// 计算用户头像路径
const userAvatarUrl = computed(() => {
 return new URL(`../../../assets/icon/${userAvatar.value}.png`, import.meta.url).href
});

// popover 层级
const zIndex = 9999;

// 事件发射
const emits = defineEmits(["pleaseOpenSearch"]);

// 类型定义
interface LetterType {
  id: string;
  flag: boolean;
}

interface AllAppListBySort {
  id: string;
  list: appList;
}

// 状态管理
const isAllApps = ref(false);
const selectLetter = ref(false);
const containerPinned = ref<HTMLElement | null>(null);
const containerAllApp = ref<HTMLElement | null>(null);
const appItemBody = ref<HTMLElement | null>(null);
let maxScroll = 0;

// 电源事件处理
const powerEvent = (val: string) => {
  const actions: Record<string, () => void> = {
    "关机": () => console.log("会加的，再等等"),
    "睡眠": () => router.push("login"),
    "重启": () => console.log("会加的，再等等"),
  };
  
  actions[val]?.();
};

// 打开设置
const openSet = () => {
  aStore.changeAppStatus({
    name: "设置",
    key: "mini",
    value: false,
  } as statusObjType);

  aStore.changeAppStatus({
    name: "设置",
    key: "open",
    value: true,
  } as statusObjType);

  bus.emit("closeTaskbar");
  bus.emit("设置");
};

// 跳转搜索框
const openSearch = () => {
  emits("pleaseOpenSearch");
};

// 首字母选择处理
const selectThisLetter = async (id: string, flag: boolean) => {
  if (!flag || !containerAllApp.value) return;
  
  selectLetter.value = false;
  await nextTick();
  
  const ele = document.querySelector(`#${id}`) as HTMLElement;
  if (ele) {
    const scrollTop = ele.offsetTop > maxScroll ? maxScroll : ele.offsetTop;
    containerAllApp.value.scrollTop = scrollTop;
  }
};

// 应用列表数据处理
const strIndex = "#abcdefghijklmnopqrstuvwxyz";
const letterData: LetterType[] = [];
let allAppList_sorted: AllAppListBySort[] = [];

// 初始化字母数据
const initLetterData = () => {
  for (const value of strIndex) {
    allAppList_sorted.push({
      id: value,
      list: [],
    });
    letterData.push({
      id: value,
      flag: false,
    });
  }
};

// 数据处理：按首字母分类应用
const dataDeal = () => {
  const app = aStore.getApp;
  
  // 清空之前的数据
  allAppList_sorted.forEach(item => {
    item.list = [];
  });
  letterData.forEach(item => {
    item.flag = false;
  });
  
  // 数据归类
  const rawApp = toRaw(app);
  allAppList_sorted.forEach((item, index) => {
    rawApp.forEach((appItem) => {
      const firstLetter = getSpell(
        appItem.name,
        (spell: string) => spell[1],
        ""
      ).slice(0, 1).toLowerCase();
      
      if (item.id === firstLetter) {
        item.list.push(appItem);
        letterData[index].flag = true;
      }
    });
  });
  
  // 过滤 & 排序
  allAppList_sorted = allAppList_sorted
    .filter((item) => item.list.length > 0)
    .map((item) => {
      item.list.sort((a, b) => a.name.localeCompare(b.name));
      return item;
    });
};

// DOM加载完成后获取 appItemBody 的高度
onMounted(() => {
  initLetterData();
  dataDeal();
  
  if (appItemBody.value) {
    maxScroll = appItemBody.value.scrollHeight - 523;
  }
});

// 所有应用和已固定处理
const changeMenuBodyStatus = () => {
  if (!containerPinned.value || !containerAllApp.value) return;
  
  if (isAllApps.value) {
    isAllApps.value = false;
    containerPinned.value.style.left = "0";
    containerAllApp.value.style.left = "110%";
    selectLetter.value = false;
  } else {
    isAllApps.value = true;
    containerPinned.value.style.left = "-110%";
    containerAllApp.value.style.left = "0";
  }
};

// 打开应用
const pinnedOpenApp = (data: appItem) => {
  if (!data.open) {
    aStore.changeAppStatus({
      name: data.name,
      key: "open",
      value: true,
    });
  } else {
    if (data.mini) {
      aStore.changeAppStatus({
        name: data.name,
        key: "mini",
        value: false,
      });
      aStore.changeAppStatus({
        name: data.name,
        key: "hidden",
        value: false,
      });
    }
  }
  
  bus.emit("closeTaskbar");
  bus.emit(data.name);
};

// 获取固定应用列表
const pinnedList = aStore.getTypeApp("isPinned");
</script>

<style lang="scss" scoped>
@mixin bgHover {
  border-radius: 5px;
  background-color: inherit;
  transition: background-color 300ms;

  &:hover {
    background-color: var(--start-hover-bg-color);
  }
}

.menuSearch {
  box-sizing: border-box;
  width: 100%;
  height: 70px;
  padding: 32px 32px 0;
  background-color: var(--start-main-bg-color);

  .searchBox {
    height: 100%;
    background-color: var(--start-search-input-bg-color);
    box-shadow: inset 0 -4px 0 -2px var(--global-theme-color);
    border-radius: 4px;
    font-size: 12px;
    color: var(--global-placeholder-font-color);
    @include flex(flex-start, center);

    img {
      height: 14px;
      margin-left: 16px;
      margin-right: 13px;
    }
  }
}

.menuBody {
  box-sizing: border-box;
  width: 100%;
  height: calc(100% - 70px - 64px);
  padding: 20px 32px 0;
  background-color: var(--start-main-bg-color);

  .bodyTitle {
    width: 100%;
    height: 48px;
    @include flex(space-between, center);

    .titleLeft {
      width: 96px;
      font-size: 13px;
      text-align: center;
      font-weight: bold;
    }

    .titleRight {
      padding: 5px 8px 6px 7px;
      background-color: var(--start-right-btn-bg-color);
      border: 1px solid var(--start-right-btn-border-color);
      border-radius: 5px;
      margin-right: 32px;
      @include flex(center, center);

      span {
        margin: 0 13px;
        @include mini_font(11);
      }
    }
  }

  .bodyContainer {
    width: 100%;
    height: calc(100% - 48px);
    position: relative;
  }
}

.menuFooter {
  box-sizing: border-box;
  width: 100%;
  height: 63px;
  padding: 0 52px;
  background-color: var(--start-footer-bg-color);
  border-top: 1px solid var(--global-window-division-color);
  @include flex(space-between, center);

  .footerUser {
    height: 40px;
    line-height: 40px;
    padding-left: 12px;
    padding-right: 12px;
    @include bgHover;

    img {
      width: 32px;
      vertical-align: middle;
      border-radius: 50%;
      margin-right: 12px;
    }

    span {
      font-size: 12px;
    }
  }

  .footerBattery {
    @include flex(flex-end, center);

    .batterySet {
      width: 40px;
      height: 40px;
      @include flex(center, center);
      @include bgHover;
    }

    .n-icon {
      @extend .batterySet;
    }
  }
}

@at-root .poperBody {
  > div {
    @include flex(center, center);
    user-select: none;

    &:nth-of-type(2) {
      margin: 14px 0;
    }
  }

  span {
    font-size: 12px;
    margin-left: 12px;
    margin-right: 12px;
  }
}

// 开始菜单主体
.containerPinned {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  transition: left 300ms;

  .pinnedAppBox {
    width: 100%;
    height: 84px;
    @include grid(6, 1);
    margin-bottom: 200px;
    row-gap: 15px;
  }

  .pinnedList {
    width: 100%;
    height: 100%;
    @include flex(center, center, column);
    @include bgHover;

    img {
      width: 32px;
      margin-bottom: 9px;
    }

    span {
      font-size: 12px;
    }
  }

  .pinnedRecommend {
    font-size: 13px;
    font-weight: bold;
    padding-left: 32px;
    margin-bottom: 20px;
  }

  .recommendList {
    height: 56px;
    padding-left: 32px;
    @include grid(2, 1);
    justify-items: left;

    .listItem {
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      padding: 18px 0 18px 32px;
      margin-left: -32px;
      @include flex(flex-start, center);
      @include bgHover;

      img {
        height: 30px;
        margin-right: 12px;
      }

      .itemDesc {
        font-size: 12px;

        div {
          margin-bottom: 3px;
        }

        span {
          color: var(--start-desc-font-color);
          font-size: 12px;
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
  transition: left 300ms;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    width: 2px;
    height: 246px;
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
    @include bgHover;
  }

  .itemBodyIndex {
    text-indent: 0.8em;
    line-height: 40px;
    font-weight: bold;
  }

  .itemBodyBox {
    @include flex(flex-start, center);

    img {
      width: 24px;
      margin-right: 20px;
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
    grid-template-columns: repeat(4, 48px);
    grid-template-rows: repeat(7, 48px);

    div {
      width: 100%;
      height: 48px;
      line-height: 48px;
      text-align: center;
      font-size: 14px;
      color: var(--start-letterlist-none-color);
      font-weight: bold;
    }

    .isFlag {
      color: var(--start-letterlist-have-color);
      @include bgHover;
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-in;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
