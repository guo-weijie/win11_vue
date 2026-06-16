<template>
  <div class="nameLess">
    <!-- 搜索框 -->
    <n-input v-model:value="inputValue" placeholder="在此键入进行搜索" autofocus>
      <template #prefix>
        <n-icon>
          <svg
            t="1648455446977"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="9170"
            width="32"
            height="32"
          >
            <path
              d="M599.703537 0C369.67788 0 182.54192 187.139189 182.54192 417.161616c0 109.944193 42.773473 210.070729 112.526937 284.666838L7.141304 989.756008l34.240731 34.24396 288.750803-288.750803c72.759133 61.756643 166.880789 99.074068 269.56747 99.074068 230.022428 0 417.158388-187.139189 417.158388-417.161616S829.725964 0 599.703537 0zM599.703537 785.896779c-203.32331 0-368.735163-165.411853-368.735163-368.735163S396.380227 48.426454 599.703537 48.426454c203.320081 0 368.731934 165.411853 368.731934 368.735163S803.020389 785.896779 599.703537 785.896779z"
              p-id="9171"
              fill="#3a3a3a"
            />
          </svg>
        </n-icon>
      </template>
    </n-input>
    <!-- 搜索主体 -->
    <div class="searchBody">
      <!-- 搜索标题栏 -->
      <div class="bodyTitleBox">
        <n-tabs animated class="bodyTitle" :bar-width="12" v-model:value="tabName" @update:value="tabNameChange">
          <n-tab v-for="item in visibleTabs" :key="item" :name="item">{{ item }}</n-tab>
          <n-tab name="更多">
            <n-popover trigger="click" placement="bottom-start" :show-arrow="false" class="myPopover" :z-index="POPOVER_Z_INDEX">
              <template #trigger>
                <n-button icon-placement="right">
                  <template #icon>
                    <n-icon size="14px">
                      <ChevronDown20Regular />
                    </n-icon>
                  </template>
                  更多
                </n-button>
              </template>
              <div class="more">
                <div v-for="item in currentHiddenTabs" :key="item" @click.stop="moreChange(item)">{{ item }}</div>
              </div>
            </n-popover>
          </n-tab>
        </n-tabs>
        <!-- 右 -->
        <div class="titleBoxRight">
          <n-button text class="titleBtn">
            <n-icon>
              <PersonFeedback20Regular />
            </n-icon>
          </n-button>
          <n-popover trigger="click" placement="bottom-end" :show-arrow="false" class="myPopover" :z-index="POPOVER_Z_INDEX">
            <template #trigger>
              <n-button text class="titleBtn" title="提供反馈">
                <n-icon>
                  <MoreHorizontal20Regular />
                </n-icon>
              </n-button>
            </template>
            <div class="searchSet">
              <div>
                <n-icon size="20">
                  <Settings20Regular />
                </n-icon>
                搜索设置
              </div>
              <div>
                <n-icon size="20">
                  <ScreenSearch20Regular />
                </n-icon>
                索引选项
              </div>
              <div class="versionInfo">内部版本：2022.03.20.27644848</div>
            </div>
          </n-popover>
        </div>
      </div>
      <!-- 搜索主体 -->
      <div class="bodyBox">
        <All_app :title="allAppTitle" v-show="isShow" />
        <OtherFn :title="allAppTitle" v-show="!isShow" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { NInput, NIcon, NTabs, NTab, NPopover, NButton } from "naive-ui";
import {
  ChevronDown20Regular,
  MoreHorizontal20Regular,
  PersonFeedback20Regular,
  Settings20Regular,
  ScreenSearch20Regular,
} from "@vicons/fluent";
import All_app from "@/components/searchCom/all_app.vue";
import OtherFn from "@/components/searchCom/otherFn.vue";

// ==================== 常量 ====================
const POPOVER_Z_INDEX = 9999;
const MAIN_TABS = ["全部", "应用", "文档", "网页"] as const;
type MainTab = (typeof MAIN_TABS)[number];

const EXTRA_TABS = ["电子邮件", "人员", "设置", "视频", "文件夹", "音乐", "照片"] as const;

// ==================== 状态 ====================
const inputValue = ref("");
const tabName = ref<MainTab | string>("全部");

const visibleTabs = ref<string[]>([...MAIN_TABS]);
const hiddenTabs = ref<string[]>([...EXTRA_TABS]);

const isShow = ref(true);
const allAppTitle = ref("热门应用");

// ==================== 计算属性 ====================
const currentHiddenTabs = computed(() =>
  hiddenTabs.value.filter((t) => !visibleTabs.value.includes(t))
);

// ==================== Tab 切换 ====================
const tabNameChange = () => {
  if (tabName.value === "更多") return;

  if (tabName.value === "全部") {
    inputValue.value = "";
    isShow.value = true;
    allAppTitle.value = "热门应用";
  } else {
    inputValue.value = tabName.value + "：";
    if (tabName.value === "应用") {
      allAppTitle.value = "常用";
      isShow.value = true;
    } else {
      isShow.value = false;
      allAppTitle.value = tabName.value;
    }
  }
};

// ==================== "更多"菜单点击 ====================
const moreChange = (name: string) => {
  if (MAIN_TABS.includes(name as MainTab)) return;

  // 从隐藏列表中移除该标签
  hiddenTabs.value = hiddenTabs.value.filter((t) => t !== name);

  // 若已有第5个标签，将其移回隐藏列表
  if (visibleTabs.value.length > 4) {
    const replaced = visibleTabs.value[4];
    if (replaced && !hiddenTabs.value.includes(replaced)) {
      hiddenTabs.value = [replaced, ...hiddenTabs.value].sort((a, b) =>
        a.localeCompare(b)
      );
    }
    visibleTabs.value.splice(4, 1);
  }

  visibleTabs.value.push(name);
  tabName.value = name;
  tabNameChange();
};
</script>

<style lang="scss" scoped>
.nameLess {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 31px 23px 0;
  background-color: var(--start-main-bg-color);
}

// 搜索输入框 — Win11 胶囊风格
.n-input {
  border: 1px solid #e0e0e0;
  border-bottom: 2px solid var(--global-theme-color);
  border-radius: 22px;
  background-color: var(--start-search-input-bg-color) !important;
  margin-bottom: 20px;
  transition: box-shadow 150ms ease;

  &:hover {
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  }

  :deep(.n-input__prefix) {
    margin-right: 8px;
  }

  ::-webkit-input-placeholder {
    color: var(--global-placeholder-font-color);
  }

  :deep(.n-input__input-el) {
    color: #333;
    &:focus {
      background-color: transparent;
    }
  }
}

.searchBody {
  height: calc(100% - 37px - 20px);

  .bodyTitleBox {
    @include flex(space-between, center);
    margin-bottom: 4px;
  }

  .titleBoxRight {
    @include flex(flex-end, center);
    gap: 2px;
  }

  .titleBtn {
    width: 30px;
    height: 30px;
    border-radius: 5px;
    transition: background-color 150ms ease;

    &:hover {
      background-color: var(--start-hover-bg-color);
    }

    &:active {
      transform: scale(0.95);
    }
  }

  .bodyTitle {
    :deep(.n-tabs-tab) {
      height: 30px;
      color: #585d63;
      font-size: 12px;
      padding: 9px 14px;
    }

    :deep(.n-tabs-tab-pad) {
      width: 0;
    }

    :deep(.n-tabs-tab--active) {
      color: #18191b;
      font-weight: 600;
    }

    :deep(.n-tabs-bar) {
      height: 3px;
      border-radius: 2px;
      background-color: var(--global-theme-color);
    }

    .n-button {
      font-size: 12px;
      color: #585d64;
      background-color: transparent;
      padding: 9px 12px;
      z-index: 99;

      :deep(.n-button__state-border) {
        border: none;
      }

      :deep(.n-base-wave) {
        animation: none;
      }

      &:hover {
        background-color: var(--start-hover-bg-color);
      }
    }
  }

  .bodyBox {
    height: calc(100% - 34px);
    overflow-x: hidden;
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 2px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: var(--global-scrollbar-color);
      border-radius: 1px;
    }
  }
}

// "更多" 弹出菜单
@at-root .more {
  color: #191a1a;
  width: 130px;
  padding: 4px;

  & > div {
    font-size: 12px;
    padding: 8px 12px;
    cursor: pointer;
    border-radius: 5px;
    user-select: none;
    transition: background-color 150ms ease;

    &:hover {
      background-color: var(--start-hover-bg-color);
    }

    &:active {
      transform: scale(0.97);
    }
  }
}

// 搜索设置弹出菜单
@at-root .searchSet {
  width: 240px;
  padding: 4px;
  color: #191a1a;
  font-size: 12px;

  & > div {
    @include flex(flex-start, center);
    padding: 8px 12px;
    border-radius: 5px;
    cursor: pointer;
    user-select: none;
    transition: background-color 150ms ease;

    .n-icon {
      margin-right: 12px;
      flex-shrink: 0;
    }

    &:hover {
      background-color: var(--start-hover-bg-color);
    }

    &:active {
      transform: scale(0.97);
    }
  }

  .versionInfo {
    color: #616365;
    cursor: default;
    font-size: 11px;
    padding-top: 10px;
    padding-bottom: 4px;
    border-top: 1px solid var(--global-window-division-color);
    margin-top: 4px;
    border-radius: 0;

    &:hover {
      background-color: transparent;
    }

    &:active {
      transform: none;
    }
  }
}
</style>
