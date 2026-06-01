<template>
  <div class="taskbar">
    <div class="taskbarBox" @click.stop="taskbarEvent">
      <!-- 任务栏左侧 -->
      <div class="taskBarLeft">
        <!-- 无下划线应用 -->
        <div v-for="item in noUnderLineApp" :key="item.name" @click.stop="taskBarLeftNoLine(item, 'clear')">
          <img :src="item.url" alt="item.name" v-click-animal />
        </div>
        <!-- 有下划线应用 -->
        <div v-for="item in underLineApp" :key="item.name" @click.stop="taskBarLeftHaveLine(item)">
          <img :src="item.url" alt="item.name" v-click-animal />
          <i class="underLine" :class="{ fullLine: item.open, shortLine: item.mini }"></i>
        </div>
      </div>
      <!-- 任务栏右侧 -->
      <div class="taskRight">
        <!-- 隐藏的图标 -->
        <div class="hideIcon" @click.stop="taskBarRight('hideIcon', 'clear')">
          <n-icon size="22">
            <KeyboardArrowUpTwotone v-show="hideIcon === 'up'" />
            <KeyboardArrowDownTwotone v-show="hideIcon === 'down'" />
          </n-icon>
        </div>
        <!-- 语言 -->
        <div class="language" @click.stop="taskBarRight('language', 'clear')">{{ lang }}</div>
        <!-- 控制中心 -->
        <div class="controlCenter" @click.stop="taskBarRight('controlCenter', 'clear')">
          <img class="centerWifi" :src="controlCenterIcon.wifi" alt="网络连接" />
          <img class="centerAudio" :src="controlCenterIcon.audio" alt="音量" />
        </div>
        <!-- 时间 -->
        <div class="time_noti" @click.stop="taskBarRight('calendar', 'clear')">
          <div>{{ upTime }}</div>
          <div>{{ btmTime }}</div>
        </div>
      </div>
    </div>

    <!-- 开始菜单 -->
    <div class="startMenu center" :class="{ startMenuHeight: openStart }">
      <StartMenu @pleaseOpenSearch="taskBarLeftNoLine({ name: 'search', url: '', open: false })" />
    </div>
    <!-- 搜索 -->
    <div class="search center" :class="{ searchHeight: openSearch }">
      <Search />
    </div>
    <!-- 日历 -->
    <div class="calendarBox" ref="calendarBox">
      <MyCalendar />
    </div>
    <!-- 控制中心 -->
    <div class="controlCenterBox" ref="controlCenter">
      <ControlCenter />
    </div>
    <!-- 隐藏的图标 -->
    <div class="hideIconBox" ref="hideIconBox">
      <div class="iconBoxItem">
        <img :src="securityIcon" alt="microsoft defender" title="Windows 安全中心 - 不需要执行操作" />
      </div>
      <div class="iconBoxItem">
        <img :src="oneDriveIcon" alt="microsoft oneDrive" title="oneDrive 最新" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, type PropType } from "vue";
import MyCalendar from "@/components/myCalendar/index.vue";
import ControlCenter from "./components/controlCenter.vue";
import StartMenu from "./components/startMenu.vue";
import Search from "./components/search.vue";
import { KeyboardArrowUpTwotone, KeyboardArrowDownTwotone } from "@vicons/material";
import { NIcon } from "naive-ui";
import { appStore, type appItem } from "@/store/app";
import bus from "@/utils/bus";

import securityIcon from "@/assets/icon/appIcon/security.png";
import oneDriveIcon from "@/assets/icon/appIcon/oneDrive.png";
import homeIcon from "@/assets/icon/appIcon/home.png";
import searchIcon from "@/assets/icon/appIcon/search.png";
import widgetIcon from "@/assets/icon/appIcon/widget.png";
import wifiIcon from "@/assets/icon/systemIcon/wifi.png";
import audioIcon from "@/assets/icon/systemIcon/audio.png";

const store = appStore();

// Props 定义
const props = defineProps({
  currentTime: {
    type: Object as PropType<{
      year: number;
      month: number | string;
      day: number | string;
      hour: number | string;
      minute: string;
      second: string;
    }>,
    default: () => ({
      year: 0,
      month: 0,
      day: 0,
      hour: 0,
      minute: "",
      second: "",
    }),
  },
});

/**
 * 关闭所有任务栏弹窗
 */
const closeAllPopups = () => {
  // 关闭左侧应用菜单
  noUnderLineApp.forEach((item) => {
    item.open = false;
  });

  // 关闭右侧弹窗
  calendarBox.value && (calendarBox.value.style.right = "-500px");
  controlCenter.value && (controlCenter.value.style.right = "-500px");
  hideIconBox.value && (hideIconBox.value.style.height = "0px");
  hideIcon.value = "up";
};

// 任务栏点击事件 - 点击空白区域关闭所有弹窗
const taskbarEvent = () => {
  closeAllPopups();
};

// 监听全局关闭事件
bus.on("closeTaskbar", closeAllPopups);

/**
 * 任务栏左侧 - 无下划线应用（开始、搜索、小组件）
 */
interface TaskBarItem {
  name: string;
  url: string;
  open: boolean;
}

const noUnderLineApp = reactive<TaskBarItem[]>([
  {
    name: "start",
    url: homeIcon,
    open: false,
  },
  {
    name: "search",
    url: searchIcon,
    open: false,
  },
  {
    name: "widget",
    url: widgetIcon,
    open: false,
  },
]);

const openStart = computed(() => noUnderLineApp[0]?.open ?? false);
const openSearch = computed(() => noUnderLineApp[1]?.open ?? false);

/**
 * 无下划线应用点击事件
 * @param value 点击的应用项
 * @param clear 是否需要清除其他状态
 */
const taskBarLeftNoLine = (value?: TaskBarItem, clear?: string) => {
  if (clear) {
    // 关闭右侧弹窗
    calendarBox.value && (calendarBox.value.style.right = "-500px");
    controlCenter.value && (controlCenter.value.style.right = "-500px");
    hideIconBox.value && (hideIconBox.value.style.height = "0px");
    hideIcon.value = "up";
  }

  noUnderLineApp.forEach((item) => {
    if (value && item.name === value.name) {
      item.open = !item.open;
    } else {
      item.open = false;
    }
  });
};
/**
 * 任务栏左侧 - 有下划线应用（已打开的应用）
 */
const underLineApp = computed(() => store.getTypeApp("isTaskBar"));
/**
 * 有下划线应用点击事件 - 处理应用的打开/最小化/还原
 * @param value 点击的应用项
 */
const taskBarLeftHaveLine = (value: { name: string }) => {
  // 先关闭所有弹窗
  closeAllPopups();

  underLineApp.value.forEach((item: appItem) => {
    if (item.name === value.name) {
      handleAppClick(item);
    } else {
      // 其他已打开且未最小化的应用设为最小化
      if (item.open && !item.mini) {
        store.changeAppStatus({
          name: item.name,
          key: "mini",
          value: true,
        });
      }
    }
  });
};

/**
 * 处理单个应用的点击逻辑
 * @param item 应用项
 */
const handleAppClick = (item: appItem) => {
  if (!item.open) {
    // 应用未打开，则打开
    store.changeAppStatus({
      name: item.name,
      key: "open",
      value: true,
    });
    bus.emit(item.name);
  } else if (item.isTop) {
    // 应用在最顶层，则最小化并隐藏
    store.changeAppStatus({
      name: item.name,
      key: "hidden",
      value: true,
    });
    store.changeAppStatus({
      name: item.name,
      key: "mini",
      value: true,
    });
  } else if (!item.hidden) {
    // 应用显示中但未在顶层，则最小化
    store.changeAppStatus({
      name: item.name,
      key: "mini",
      value: false,
    });
    bus.emit(item.name);
  } else {
    // 应用隐藏中，则还原显示
    store.changeAppStatus({
      name: item.name,
      key: "hidden",
      value: false,
    });
    store.changeAppStatus({
      name: item.name,
      key: "mini",
      value: false,
    });
    bus.emit(item.name);
  }
};
/**
 * 图标点击动画指令
 */
const vClickAnimal = {
  mounted(el: HTMLElement) {
    el.addEventListener("mousedown", () => {
      el.className = "narrow";
    });
    el.addEventListener("click", () => {
      el.className = "clickAniamtion";
      // 动画结束后移除类名
      setTimeout(() => {
        el.className = "";
      }, 500);
    });
  },
};

/**
 * 任务栏右侧 - 弹窗 DOM 引用
 */
const calendarBox = ref<HTMLElement | null>(null);
const controlCenter = ref<HTMLElement | null>(null);
const hideIconBox = ref<HTMLElement | null>(null);

/**
 * 任务栏右侧 - 状态
 */
const hideIcon = ref<"up" | "down">("up");
const lang = ref<"中" | "英">("中");
/**
 * 切换弹窗显示状态
 * @param element 元素引用
 * @param property CSS 属性名
 * @param showValue 显示时的值
 * @param hideValue 隐藏时的值
 */
const togglePopup = (
  element: HTMLElement | null,
  property: "right" | "height",
  showValue: string,
  hideValue: string,
) => {
  if (!element) return;

  const style = element.style;

  if (property === "right") {
    const currentValue = parseInt(style.right || "0");
    style.right = currentValue <= 0 ? showValue : hideValue;
  } else {
    style.height = style.height === "0px" ? showValue : hideValue;
  }
};

/**
 * 任务栏右侧点击事件
 * @param id 点击的功能标识
 * @param clear 是否需要清除其他状态
 */
const taskBarRight = (id?: string, clear?: string) => {
  if (clear) {
    // 关闭左侧应用菜单
    noUnderLineApp.forEach((item) => {
      item.open = false;
    });
  }

  switch (id) {
    case "calendar":
      togglePopup(calendarBox.value, "right", "12px", "-500px");
      break;
    case "controlCenter":
      togglePopup(controlCenter.value, "right", "12px", "-500px");
      break;
    case "hideIcon":
      togglePopup(hideIconBox.value, "height", "auto", "0px");
      hideIcon.value = hideIcon.value === "up" ? "down" : "up";
      break;
    case "language":
      lang.value = lang.value === "中" ? "英" : "中";
      break;
    default:
      // 关闭所有弹窗
      calendarBox.value && (calendarBox.value.style.right = "-500px");
      controlCenter.value && (controlCenter.value.style.right = "-500px");
      hideIconBox.value && (hideIconBox.value.style.height = "0px");
      hideIcon.value = "up";
  }
};
/**
 * 控制中心图标配置
 */
const controlCenterIcon = reactive({
  wifi: wifiIcon,
  audio: audioIcon,
});

/**
 * 右下角时间显示
 */
const upTime = computed(() => {
  const hour = props.currentTime?.hour ?? 0;
  const minute = props.currentTime?.minute ?? "00";
  return `${hour}:${minute}`;
});

const btmTime = computed(() => {
  const year = props.currentTime?.year ?? 0;
  const month = props.currentTime?.month ?? 0;
  const day = props.currentTime?.day ?? 0;
  return `${year}/${month}/${day}`;
});
</script>

<style lang="scss" scoped>
@use "@/style/public" as *;

@mixin taskbarFnStyle {
  height: 80%;
  box-sizing: border-box;
  padding: 6px 6px 7px;

  &:hover {
    background-color: #f1f7fc;
    border-radius: 3px;
  }
}

.taskbar {
  position: relative;
  z-index: 9999;
  width: 100%;
  border-top: 1px solid #e5e5e5;
  height: 47px;
  line-height: 47px;
  background-color: rgba(228, 239, 250, 0.9);

  &Box {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: repeat(3, auto);
    grid-template-areas: "left center right";
    align-items: center;
    position: absolute;
  }
}

.taskBarLeft {
  height: 100%;
  line-height: normal;
  grid-area: center;
  @include flex(center, center);

  div {
    position: relative;
    margin-right: 6px;
    @include taskbarFnStyle;
    transition: all 0.5s;

    &:hover {
      background: #fff;
    }
  }

  .underLine {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    width: 0;
    height: 3px;
    border-radius: 1px;
  }

  .fullLine {
    width: 16px;
    background-color: #0078d4;
  }

  .shortLine {
    width: 6px;
    background-color: #7e848a;
  }

  img {
    height: 24px;
    vertical-align: middle;
  }
}

.taskRight {
  height: 100%;
  grid-area: right;
  justify-self: end;
  padding-right: 1px;
  line-height: normal;
  text-align: right;
  @include flex(flex-end, center);

  .hideIcon {
    @include taskbarFnStyle;
    @include flex(center, center);
  }

  .language {
    @extend .hideIcon;
    font-size: 14px;
  }

  .controlCenter {
    @include taskbarFnStyle;
    @include flex(flex-end, center);

    .centerWifi {
      height: 16px;
      margin-right: 6px;
    }

    .centerAudio {
      height: 19px;
    }
  }

  .time_noti {
    @include taskbarFnStyle;
    @include flex(center, flex-end, column);
    @include mini_font(11.5);
  }
}

.calendarBox {
  @include icon;
  right: -500px;
}

.controlCenterBox {
  @include icon;
  right: -500px;
}

.hideIconBox {
  @include icon;
  @include box_border;
  max-width: 120px;
  height: 0px;
  right: 130px;
  background-color: #e3eef9;
  @include flex(flex-start, center);
  flex-wrap: wrap;

  .iconBoxItem {
    width: 40px;
    height: 40px;
    line-height: 40px;
    text-align: center;

    img {
      height: 16px;
      vertical-align: middle;
    }
  }
}

.startMenu {
  @include icon;
  @include box_border;
  width: 640px;
  height: 0;
  transition: height 150ms ease-in;
}

.startMenuHeight {
  height: 725px;
}

.search {
  @include icon;
  @include box_border;
  width: 774px;
  height: 0;
  transition: height 150ms ease-in;
}

.searchHeight {
  height: 724px;
}

.center {
  left: 50%;
  transform: translateX(-50%);
}

.left {
  left: 12px;
}

// 开始菜单按钮点击动画
.narrow {
  transition: all 200ms;
  transform: scale(0.8);
}

.clickAniamtion {
  animation: clickAniamtion 500ms ease-in-out;
}

@keyframes clickAniamtion {
  0% {
    transform: scale(0.8);
  }

  50% {
    transform: scale(1);
  }
}
</style>
