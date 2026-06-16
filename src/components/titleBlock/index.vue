<template>
  <div
    ref="titleBlockRef"
    v-drag
    class="titleBlock"
    :style="{ backgroundColor: bgColor || 'var(--global-bg-color)' }"
    @dblclick="handleMaximizeToggle"
    @click="bringToFront"
  >
    <!-- 左侧：插槽传内容则渲染插槽，否则显示标题文字 -->
    <slot>
      <div class="titleBlockLeft">{{ title }}</div>
    </slot>

    <!-- 右侧按钮区域 -->
    <div class="btnBox">
      <!-- 最小化 -->
      <NButton
        class="otherBtn"
        :style="btnStyle"
        size="tiny"
        title="最小化"
        :bordered="false"
        text
        @click.stop="handleMinimize"
      >
        <NIcon>
          <Subtract16Regular />
        </NIcon>
      </NButton>

      <!-- 最大化 / 窗口布局 -->
      <div class="winButtonWrapper" @mouseenter="showWinSizePanel = true">
        <NButton
          class="otherBtn"
          :style="btnStyle"
          size="tiny"
          title="向下还原"
          :bordered="false"
          text
          @click.stop="handleMaximizeToggle"
        >
          <NIcon>
            <SquareMultiple16Regular />
          </NIcon>
        </NButton>
        <div
          class="winSizePanel"
          :style="{ opacity: showWinSizePanel ? 1 : 0, visibility: showWinSizePanel ? 'visible' : 'hidden', pointerEvents: showWinSizePanel ? 'auto' : 'none' }"
          @mouseleave="handlePanelLeave"
        >
          <div v-for="item in windowSizeGrid" :key="item.class" :class="item.class">
            <div
              v-for="child in item.children"
              :key="child.id"
              :class="child.class"
              @click="changeWinSize(child.id)"
            />
          </div>
        </div>
      </div>

      <!-- 关闭 -->
      <NButton
        class="closeBtn"
        :style="btnStyle"
        size="tiny"
        title="关闭"
        :bordered="false"
        text
        @click.stop="handleClose"
      >
        <NIcon>
          <Dismiss20Regular />
        </NIcon>
      </NButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { appStore, type statusObjType } from "@/store/app";
import { Subtract16Regular, Dismiss20Regular, SquareMultiple16Regular } from "@vicons/fluent";
import { NButton, NIcon } from "naive-ui";

const props = withDefaults(
  defineProps<{
    title: string;
    bgColor?: string;
  }>(),
  { bgColor: "" }
);

const store = appStore();

const titleBlockRef = ref<HTMLElement | null>(null);
const showWinSizePanel = ref(false);

// 按钮通用样式
const btnStyle = { width: "40px", height: "40px", fontSize: "18px" };

// 窗口尺寸面板配置
const windowSizeGrid = Object.freeze([
  {
    class: "item1",
    children: [{ id: "halfOnLeft", class: "" }, { id: "halfOnRight", class: "" }],
  },
  {
    class: "item2",
    children: [{ id: "moreOnLeft", class: "" }, { id: "moreOnRight", class: "" }],
  },
  {
    class: "item3",
    children: [
      { id: "thirdOnLeft", class: "" },
      { id: "thirdOnCenter", class: "" },
      { id: "thirdOnRight", class: "" },
    ],
  },
  {
    class: "item4",
    children: [
      { id: "halfOnLeft", class: "item4A" },
      { id: "thirdOnTop", class: "" },
      { id: "thirdOnBottom", class: "" },
    ],
  },
  {
    class: "item5",
    children: [
      { id: "quarterOnLeftTop", class: "" },
      { id: "thirdOnTop", class: "" },
      { id: "quarterOnLeftBottom", class: "" },
      { id: "thirdOnBottom", class: "" },
    ],
  },
  {
    class: "item6",
    children: [
      { id: "moreThirdLeft", class: "" },
      { id: "moreThirdCenter", class: "" },
      { id: "moreThirdRight", class: "" },
    ],
  },
]);

// ---- helpers ----
const getContainer = () => titleBlockRef.value?.parentElement ?? null;

const bringToFront = () => {
  const el = getContainer();
  if (!el) return;
  el.style.zIndex = String(store.zIndex);
  store.changeZIndex();
  store.changeAppStatus({
    name: props.title,
    key: "isTop",
    value: true,
  } as statusObjType);
};

const changeWinSize = (className: string) => {
  const el = getContainer();
  if (!el) return;
  el.style.left = "";
  el.style.top = "";
  el.className = `appContainer ${className}`;
  showWinSizePanel.value = false;
};

const handleMaximizeToggle = () => {
  const el = getContainer();
  if (!el) return;
  el.style.left = "";
  el.style.top = "";
  el.className = el.className === "appContainer" ? "appContainer centerCenter" : "appContainer";
  showWinSizePanel.value = false;
};

const handleMinimize = () => {
  store.changeAppStatus({
    name: props.title,
    key: "mini",
    value: true,
  } as statusObjType);
};

const handleClose = () => {
  store.changeAppStatus({
    name: props.title,
    key: "open",
    value: false,
  } as statusObjType);
};

const handlePanelLeave = (e: MouseEvent) => {
  const panel = e.currentTarget as HTMLElement;
  if (!panel.contains(e.relatedTarget as HTMLElement)) {
    showWinSizePanel.value = false;
  }
};

onMounted(() => {
  // 所有 Vue 应用使用全局注册的 v-drag 指令，无需额外操作
});
</script>

<style lang="scss" scoped>
@use "@/style/public" as *;

// ==================== 常量定义 ====================
$title-block-height: 40px;
$panel-width: 342px;
$panel-height: 164px;
$panel-gap: 12px;
$item-gap: 4px;
$panel-padding: 8px;

// 颜色变量
$panel-bg: #f6f9fc;
$panel-border-radius: 10px;
$panel-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
$item-bg: #f3f3f3;
$item-border: 1px solid #d3dfe9;
$item-border-radius: 5px;
$hover-bg: #0067c0;

// ==================== 标题栏样式 ====================
.titleBlock {
  width: 100%;
  height: $title-block-height;
  @include flex(space-between, center);

  .btnBox {
    display: flex;
    height: $title-block-height;
    position: relative;
  }

  .winButtonWrapper {
    position: relative;
  }

  .closeBtn:hover {
    background-color: red;
    color: #fff;
  }

  .otherBtn:hover {
    background-color: lightgray;
  }

  .titleBlockLeft {
    font-size: 12px;
    color: #373737;
    margin-left: 18px;
  }

  .winSizePanel {
    position: absolute;
    top: calc(100% + 5px);
    right: 0;
    z-index: 9999;
    padding: $panel-padding;
    background-color: $panel-bg;
    border-radius: $panel-border-radius;
    box-shadow: $panel-shadow;
    cursor: default;
    @extend %win-size-layout;
  }
}

// ==================== 窗口尺寸面板布局 ====================
%win-size-layout {
  width: $panel-width;
  height: $panel-height;
  display: grid;
  grid-template-columns: repeat(3, auto);
  grid-template-rows: repeat(2, 5fr);
  grid-gap: $panel-gap;

  & > div {
    border-radius: $item-border-radius;
    overflow: hidden;
    display: grid;
    grid-gap: $item-gap;
    cursor: pointer;

    div {
      background: $item-bg;
      border: $item-border;
      cursor: pointer;

      &:hover {
        background: $hover-bg;
      }
    }
  }

  .item1 {
    grid-template-columns: repeat(2, 5fr);
  }

  .item2 {
    grid-template-columns: 6fr 4fr;
  }

  .item3 {
    grid-template-columns: repeat(3, 3.3fr);
  }

  .item4 {
    grid-template-columns: repeat(2, 5fr);
    grid-template-rows: repeat(2, 5fr);
    grid-template-areas:
      "header left"
      "header right";

    .item4A {
      grid-area: header;
    }
  }

  .item5 {
    grid-template-columns: repeat(2, 5fr);
    grid-template-rows: repeat(2, 5fr);
    grid-template-areas:
      "header left"
      "header right";
  }

  .item6 {
    grid-template-columns: 2.5fr 5fr 2.5fr;
  }
}
</style>
