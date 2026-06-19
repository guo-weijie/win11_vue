<template>
  <AppWindow title="设置">
    <div class="mainBox">
      <!-- ==================== 移动端：层级导航 ==================== -->
      <template v-if="isMobile">
        <div class="mobile-setup">
          <!-- 导航栏 -->
          <div class="mobile-navbar">
            <div v-if="mobileStack.length > 1" class="nav-back" @click="mobileBack">
              <n-icon size="22" color="#1a1a1a"><ArrowLeft20Regular /></n-icon>
            </div>
            <div class="nav-title" :class="{ 'has-back': mobileStack.length > 1 }">
              {{ mobileTitle }}
            </div>
            <div class="nav-spacer"></div>
          </div>

          <!-- 一层：所有分类 -->
          <Transition name="slide-right" mode="out-in">
            <div v-if="mobileStack.length === 1" key="root" class="mobile-level mobile-level-root">
              <div
                class="mobile-category-item"
                v-for="(item, index) in menuItemData"
                :key="item.name"
                @click="mobileEnter(index)"
              >
                <n-icon size="20" color="#5c5c5c" :component="item.icon" />
                <span class="cat-name">{{ item.name }}</span>
                <n-icon size="16" color="#c8c8c8"><ChevronRight20Regular /></n-icon>
              </div>
            </div>

            <!-- 二层：分类子项 -->
            <div v-else key="detail" class="mobile-level mobile-level-detail">
              <MenuItemList
                :menu-item-list-data="mobileCurrentData"
                @change-item="mobileEnter"
              />
            </div>
          </Transition>
        </div>
      </template>

      <!-- ==================== 桌面端：原有侧边栏布局 ==================== -->
      <n-layout v-else has-sider>
        <n-layout-sider>
          <!-- 用户信息 -->
          <div class="userAbout">
            <img :src="avatarUrl" :alt="userName" />
            <div class="aboutInfo">
              <div class="infoName">{{ userName }}</div>
              <div class="infoMail">Administrator</div>
            </div>
          </div>
          <!-- 搜索框 -->
          <n-input placeholder="查找设置">
            <template #suffix>
              <n-icon><Search20Regular /></n-icon>
            </template>
          </n-input>
          <!-- 菜单列表 -->
          <div class="menuList">
            <div
              v-for="(item, index) in menuItemData"
              :key="item.name"
              class="listItem"
              :class="{ listItemBgC: index === clickedIndex }"
              @click="selectItem(item.name, index)"
            >
              <n-icon :component="item.icon" size="18" color="#5c5c5c" class="niconStyle" />
              <div>{{ item.name }}</div>
            </div>
            <div ref="listBar" class="listBar" />
          </div>
        </n-layout-sider>
        <n-layout>
          <n-layout-content>
            <n-breadcrumb>
              <n-breadcrumb-item v-for="item in breadData" :key="item">
                {{ item }}
                <template #separator>
                  <n-icon size="14" color="#5c5c5c"><ChevronRight20Regular /></n-icon>
                </template>
              </n-breadcrumb-item>
            </n-breadcrumb>
            <MenuItemList :menu-item-list-data="menuItemListData.data" @change-item="selectItem" />
          </n-layout-content>
        </n-layout>
      </n-layout>
    </div>
  </AppWindow>
</template>

<script lang="ts" setup>
import { reactive, ref, shallowReactive, computed } from "vue";
import { NIcon, NLayout, NLayoutContent, NLayoutSider, NInput, NBreadcrumb, NBreadcrumbItem } from "naive-ui";
import { ChevronRight20Regular, Search20Regular, ArrowLeft20Regular } from "@vicons/fluent";

import MenuItemList from "./components/menuItemList.vue";
import AppWindow from "@/components/appWindow/index.vue";
import { useMobile } from "@/composables/useMobile";
import { userStore } from "@/store/user";
import { menuItemData, type MenuData } from "./menu";

// ==================== 移动端检测 ====================
const { isMobile } = useMobile();

// ==================== 用户信息 ====================
const uStore = userStore();
const userAvatar = uStore.getUserAvatar;
const userName = uStore.getUserName;

const avatarUrl = computed(() => {
  if (!userAvatar) return "";
  if (userAvatar.startsWith("http")) return userAvatar;
  try {
    return new URL(`../../assets/icon/${userAvatar}.png`, import.meta.url).href;
  } catch {
    return "";
  }
});

// ==================== 桌面端状态 ====================
const breadData = reactive(["系统"]);
const menuItemListData = shallowReactive({ data: menuItemData[0] });

const listBar = ref<HTMLElement>();
const clickedIndex = ref(0);

const selectItem = (name: string, num: number) => {
  if (listBar.value) listBar.value.style.top = 9 + 36 * num + "px";
  clickedIndex.value = num;
  breadData[0] = name;
  breadData.splice(1);
  menuItemListData.data = menuItemData[num];
};

// ==================== 移动端导航栈 ====================
interface NavFrame {
  name: string;
  /** menuItemData 中的索引，根层级为 -1 */
  index: number;
}

const mobileStack = reactive<NavFrame[]>([{ name: "设置", index: -1 }]);

const mobileTitle = computed(() => {
  return mobileStack[mobileStack.length - 1]?.name ?? "设置";
});

const mobileCurrentData = computed<MenuData>(() => {
  const top = mobileStack[mobileStack.length - 1];
  if (!top || top.index < 0) return { icon: menuItemData[0].icon, name: "设置", children: [] };
  return menuItemData[top.index] ?? menuItemData[0];
});

/** 进入下级菜单（兼容 v-for click 和 @change-item 两种触发方式） */
const mobileEnter = (nameOrIndex: string | number, num?: number) => {
  // 来自子层级 MenuItemList 的 @change-item 事件：(name: string, num: number)
  if (typeof num === "number") {
    const cat = menuItemData[num];
    if (!cat) return;
    mobileStack.push({ name: nameOrIndex as string, index: num });
    return;
  }

  // 来自一层分类列表 v-for click：index: number
  const idx = nameOrIndex as number;
  const cat = menuItemData[idx];
  if (!cat) return;
  mobileStack.push({ name: cat.name, index: idx });
};

/** 返回上级 */
const mobileBack = () => {
  if (mobileStack.length > 1) {
    mobileStack.pop();
  }
};
</script>

<style lang="scss" scoped>
@use "@/style/public" as *;
@use "@/style/responsive" as *;

.mainBox {
  height: calc(100% - 40px);

  @include mobile {
    height: 100%;
  }
}

// ==========================================
// 移动端层级导航
// ==========================================
.mobile-setup {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  overflow: hidden;
}

.mobile-navbar {
  display: flex;
  align-items: center;
  height: 48px;
  padding: 0 8px;
  border-bottom: 1px solid #e8e8e8;
  flex-shrink: 0;
  position: relative;

  .nav-back {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    cursor: pointer;
    flex-shrink: 0;
    transition: background-color 150ms ease;

    &:active {
      background-color: rgba(0, 0, 0, 0.06);
    }
  }

  .nav-title {
    flex: 1;
    font-size: 17px;
    font-weight: 600;
    color: #1a1a1a;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &.has-back {
      text-align: left;
      padding-right: 48px; // 补偿右侧 spacer 宽度保持居中视觉
    }
  }

  .nav-spacer {
    width: 40px;
    flex-shrink: 0;
  }
}

.mobile-level {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  max-width: 100vw;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

// 一层：分类列表
.mobile-level-root {
  padding: 4px 0;

  .mobile-category-item {
    display: flex;
    align-items: center;
    padding: 14px 16px;
    cursor: pointer;
    user-select: none;
    transition: background-color 120ms ease;
    border-bottom: 1px solid #f0f0f0;

    &:active {
      background-color: rgba(0, 0, 0, 0.04);
    }

    .n-icon:first-child {
      margin-right: 14px;
      flex-shrink: 0;
    }

    .cat-name {
      flex: 1;
      font-size: 15px;
      color: #1a1a1a;
      font-weight: 500;
    }

    .n-icon:last-child {
      flex-shrink: 0;
    }
  }
}

// 二层：分类详情
.mobile-level-detail {
  :deep(.menuItemList) {
    box-sizing: border-box;
    width: 100%;
    height: auto;
    padding: 12px;
  }

  :deep(.system),
  :deep(.network),
  :deep(.account),
  :deep(.personalize),
  :deep(.update),
  :deep(.updateLess) {
    padding: 0;
  }
}

// 页面切换过渡
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 220ms cubic-bezier(0.25, 0.8, 0.25, 1.2);
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

// ==========================================
// 桌面端布局
// ==========================================
.n-layout {
  height: 100%;
  background-color: transparent;

  .n-layout-sider {
    width: 268px !important;
    background-color: rgba(243, 243, 243, 0.7);
    border-right: 1px solid rgba(0, 0, 0, 0.06);
    margin-right: 40px;
    flex-shrink: 0;
    border-radius: 0 8px 8px 0;

    @include tablet {
      width: 200px !important;
      margin-right: 20px;

      :deep(.n-layout-sider-scroll-container) {
        padding-left: 10px;
      }
    }

    :deep(.n-layout-sider-scroll-container) {
      min-width: auto !important;
      padding-left: 12px;
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

  :deep(.n-layout-scroll-container) {
    overflow-x: initial;
  }

  .n-breadcrumb {
    margin-bottom: 22px;

    @include tablet {
      margin-bottom: 16px;
    }
  }
}

.userAbout {
  @include flex(flex-start, center);
  margin-bottom: 18px;
  margin-top: 10px;
  padding: 6px 10px 6px 4px;
  border-radius: 6px;
  transition: background-color 120ms ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.03);
  }

  @include tablet {
    margin-bottom: 12px;
    margin-top: 2px;
    flex-direction: column;
    align-items: flex-start;

    img {
      width: 40px;
      height: 40px;
      margin-bottom: 8px;
    }
  }

  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 12px;
    object-fit: cover;
    box-shadow: none;
  }

  .aboutInfo {
    .infoName {
      font-size: 13px;
      font-weight: 600;
      color: #1b1b1b;
      margin-bottom: 0;

      @include tablet {
        font-size: 12px;
      }
    }

    .infoMail {
      font-size: 11px;
      color: #7a7a7a;
    }
  }
}

.n-input {
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 6px;
  background-color: rgba(255, 255, 255, 0.65) !important;
  margin-bottom: 16px;
  height: 34px;

  @include tablet {
    margin-bottom: 12px;
    height: 32px;
  }

  ::-webkit-input-placeholder {
    color: #8a8a8a;
  }

  :deep(.n-input__input-el) {
    &:focus {
      background-color: rgba(255, 255, 255, 0.9);
    }
  }
}

.menuList {
  position: relative;

  .listItem {
    height: 36px;
    border-radius: 5px;
    margin-bottom: 0;
    padding: 0 10px;
    cursor: pointer;
    @include flex(flex-start, center);
    transition: background-color 120ms ease;

    @include tablet {
      height: 34px;

      .niconStyle {
        margin-left: 2px;
        margin-right: 8px;
        font-size: 16px;
      }

      div {
        font-size: 12px;
      }
    }

    &:hover {
      background-color: rgba(0, 0, 0, 0.03);
    }

    .niconStyle {
      margin-left: 2px;
      margin-right: 12px;
    }

    div {
      font-size: 13px;
      color: #1a1a1a;
      font-weight: 400;
    }
  }

  .listItemBgC {
    background-color: rgba(0, 0, 0, 0.05) !important;

    div {
      font-weight: 600;
      color: #1b1b1b;
    }
  }

  .listBar {
    width: 3px;
    height: 18px;
    border-radius: 2px;
    background-color: #0067c0;
    position: absolute;
    left: 0;
    top: 9px;
    transition: top 200ms cubic-bezier(0.4, 0, 0.2, 1);

    @include tablet {
      top: 8px;
      height: 16px;
    }
  }
}

.n-breadcrumb {
  margin-bottom: 28px;

  :deep(ul) {
    @include flex(flex-start, center);
  }

  :deep(.n-breadcrumb-item) {
    @include flex(flex-start, center);

    .n-breadcrumb-item__link {
      font-size: 28px;
      font-weight: 600;
      color: #1a1a1a;
      letter-spacing: -0.2px;

      @include tablet {
        font-size: 22px;
      }

      a {
        color: inherit;
      }
    }

    .n-breadcrumb-item__separator {
      margin: 0 6px;
    }
  }
}

.n-layout-content {
  padding: 0 4px;

  @include tablet {
    padding: 0;
  }
}
</style>
