<template>
  <div class="appContainer" ref="windowRef" @click.stop="bringToFront">
    <!-- 标题栏 -->
    <TitleBlock title="Edge" bgColor="#cdcdcd">
      <div class="titleLeft">
        <div class="leftTagName">
          <img src="@/assets/icon/appIcon/home.png" alt="windows11" />
          Windows 11
        </div>
        <n-button size="tiny" :bordered="false">
          <template #icon>
            <n-icon color="#000000">
              <Dismiss20Filled />
            </n-icon>
          </template>
        </n-button>
      </div>
    </TitleBlock>
    <!-- 导航栏 -->
    <div class="edgeNav">
      <n-button @click="naviBtn(-1)" :bordered="false">
        <template #icon>
          <n-icon :color="leftGray">
            <ArrowLeft24Regular />
          </n-icon>
        </template>
      </n-button>
      <n-button @click="naviBtn(1)" :bordered="false">
        <template #icon>
          <n-icon :color="rightGray">
            <ArrowRight24Regular />
          </n-icon>
        </template>
      </n-button>
      <n-button @click="naviBtn(0)" :bordered="false">
        <template #icon>
          <n-icon color="#000000">
            <ArrowClockwise48Regular />
          </n-icon>
        </template>
      </n-button>
      <n-input
        v-model:value="inputValue"
        type="text"
        autofocus
        maxlength="8182"
        @input="onInput"
        @keydown.enter="inputComplete"
      >
        <template #prefix>
          <n-icon color="#000" :component="inputBarIcon"></n-icon>
        </template>
      </n-input>
    </div>
    <!-- 主体窗口 -->
    <div class="edgeBody">
      <iframe :src="edgeUrl"></iframe>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  ArrowLeft24Regular,
  ArrowRight24Regular,
  ArrowClockwise48Regular,
  LockClosed20Regular,
  Search20Regular,
  Dismiss20Filled,
} from "@vicons/fluent";
import { NIcon, NButton, NInput } from "naive-ui";
import { ref, shallowRef, computed } from "vue";
import TitleBlock from "@/components/titleBlock";
import { useWindow } from "@/composables/useWindow";

// 类型定义
type NavigationDirection = -1 | 0 | 1;

// 窗口管理 composable
const { windowRef, bringToFront } = useWindow("Edge");

// 常量定义
const DEFAULT_URL = "https://keep-silent.com";
const BING_SEARCH_URL = "https://cn.bing.com/search?q=";
const GRAY_COLOR = "#cccccc";
const BLACK_COLOR = "#000";

// 浏览器历史记录
const historyData = ref<string[]>([DEFAULT_URL]);
// 当前所在的历史记录位置
const step = ref(0);

// 输入框前图标（使用 shallowRef 优化性能）
const inputBarIcon = shallowRef(Search20Regular);

// iframe URL
const edgeUrl = ref(DEFAULT_URL);
// 用户输入的值
const inputValue = ref(DEFAULT_URL);

// 计算属性：判断是否可以后退/前进
const canGoBack = computed(() => step.value > 0);
const canGoForward = computed(() => step.value < historyData.value.length - 1);

// 计算属性：按钮颜色
const leftGray = computed(() => (canGoBack.value ? BLACK_COLOR : GRAY_COLOR));
const rightGray = computed(() => (canGoForward.value ? BLACK_COLOR : GRAY_COLOR));

/**
 * 处理 URL 输入
 */
const processUrlInput = (url: string): string => {
  // 如果已经是完整 URL，直接返回
  if (url.includes("http://") || url.includes("https://")) {
    return url;
  }
  
  // 如果是域名格式，添加 https://
  if (url.includes("www.") || url.includes(".co")) {
    return `https://${url}`;
  }
  
  // 否则作为搜索关键词
  return `${BING_SEARCH_URL}${url}`;
};

/**
 * 添加历史记录
 */
const addHistory = (url: string) => {
  // 移除当前位置之后的历史记录
  historyData.value = historyData.value.slice(0, step.value + 1);
  historyData.value.push(url);
  step.value++;
};

/**
 * 输入完成按回车键触发事件
 */
const inputComplete = () => {
  if (!inputValue.value.trim()) return;
  
  const processedUrl = processUrlInput(inputValue.value.trim());
  
  // 更新输入框显示（如果是自动补全的 URL）
  if (processedUrl !== inputValue.value) {
    inputValue.value = processedUrl;
  }
  
  // 设置锁图标
  inputBarIcon.value = LockClosed20Regular;
  
  // 添加历史记录并导航
  addHistory(processedUrl);
  edgeUrl.value = processedUrl;
};
/**
 * 导航按钮：后退、前进、刷新
 * @param direction -1=后退, 1=前进, 0=刷新
 */
const naviBtn = (direction: NavigationDirection) => {
  if (direction === 0) {
    // 刷新：重新加载当前页面
    edgeUrl.value = historyData.value[step.value];
    return;
  }
  
  const newStep = step.value + direction;
  
  // 边界检查
  if (newStep < 0 || newStep >= historyData.value.length) return;
  
  step.value = newStep;
  const targetUrl = historyData.value[newStep];
  edgeUrl.value = targetUrl;
  inputValue.value = targetUrl;
};
/**
 * 输入框正在输入时重置图标
 */
const onInput = () => {
  inputBarIcon.value = Search20Regular;
};
</script>

<style lang="scss" scoped>
@use "@/style/public" as *;

.titleLeft {
  box-sizing: border-box;
  height: 40px;
  padding: 0 12px;
  margin-left: 8px;
  background-color: #f7f7f7;
  border-radius: 4px 4px 0 0;
  @include flex(space-between, center);

  .leftTagName {
    width: calc(100% - 26px);
    white-space: nowrap;
    overflow: hidden;
    font-size: 12px;
    color: #a24d4d;
    @include flex(flex-start, center);

    img {
      width: 16px;
      margin-right: 10px;
    }
  }
}

.edgeNav {
  width: 100%;
  height: 38px;
  border-bottom: 1px solid #bfbfbf;
  @include flex(flex-start, center);

  .n-input {
    width: 80%;
    height: 80%;
    background-color: #ffffff;

    :deep(.n-input__input-el) {
      color: #000000;
      height: 100%;
      font-size: 12px;
    }
  }
}

.edgeBody {
  width: 100%;
  height: calc(100% - 40px - 39px);

  iframe {
    width: 100%;
    height: 100%;
  }
}
</style>
