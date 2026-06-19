<template>
  <AppWindow title="Edge">
    <template #titleLeft>
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
    </template>

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
  </AppWindow>
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
import AppWindow from "@/components/appWindow/index.vue";

// 类型定义
type NavigationDirection = -1 | 0 | 1;

// 常量定义
const DEFAULT_URL = "https://keep-silent.com";
const BING_SEARCH_URL = "https://cn.bing.com/search?q=";
const GRAY_COLOR = "#cccccc";
const BLACK_COLOR = "#000";

// 浏览器历史记录
const historyData = ref<string[]>([DEFAULT_URL]);
const step = ref(0);

// 输入框前图标
const inputBarIcon = shallowRef(Search20Regular);

// iframe URL
const edgeUrl = ref(DEFAULT_URL);
const inputValue = ref(DEFAULT_URL);

// 计算属性
const canGoBack = computed(() => step.value > 0);
const canGoForward = computed(() => step.value < historyData.value.length - 1);
const leftGray = computed(() => (canGoBack.value ? BLACK_COLOR : GRAY_COLOR));
const rightGray = computed(() => (canGoForward.value ? BLACK_COLOR : GRAY_COLOR));

const processUrlInput = (url: string): string => {
  if (url.includes("http://") || url.includes("https://")) {
    return url;
  }
  if (url.includes("www.") || url.includes(".co")) {
    return `https://${url}`;
  }
  return `${BING_SEARCH_URL}${url}`;
};

const addHistory = (url: string) => {
  historyData.value = historyData.value.slice(0, step.value + 1);
  historyData.value.push(url);
  step.value++;
};

const inputComplete = () => {
  if (!inputValue.value.trim()) return;

  const processedUrl = processUrlInput(inputValue.value.trim());
  if (processedUrl !== inputValue.value) {
    inputValue.value = processedUrl;
  }

  inputBarIcon.value = LockClosed20Regular;
  addHistory(processedUrl);
  edgeUrl.value = processedUrl;
};

const naviBtn = (direction: NavigationDirection) => {
  if (direction === 0) {
    edgeUrl.value = historyData.value[step.value];
    return;
  }

  const newStep = step.value + direction;
  if (newStep < 0 || newStep >= historyData.value.length) return;

  step.value = newStep;
  const targetUrl = historyData.value[newStep];
  edgeUrl.value = targetUrl;
  inputValue.value = targetUrl;
};

const onInput = () => {
  inputBarIcon.value = Search20Regular;
};
</script>

<style lang="scss" scoped>
@use "@/style/public" as *;
@use "@/style/responsive" as *;

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
  background-color: #f3f3f3;
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

  @include mobile {
    height: calc(100% - 39px);
  }

  iframe {
    width: 100%;
    height: 100%;
  }
}
</style>
