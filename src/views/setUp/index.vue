<template>
  <AppWindow title="设置">
    <div class="mainBox">
      <n-layout has-sider>
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
import { ChevronRight20Regular, Search20Regular } from "@vicons/fluent";

import MenuItemList from "./components/menuItemList.vue";
import AppWindow from "@/components/appWindow/index.vue";
import { userStore } from "@/store/user";
import { menuItemData } from "./menu";

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

const breadData = reactive(["系统"]);
const menuItemListData = shallowReactive({ data: menuItemData[0] });

const listBar = ref<HTMLElement>();
const clickedIndex = ref(0);

const selectItem = (name: string, num: number) => {
  if (listBar.value) listBar.value.style.top = 10 + 40 * num + "px";
  clickedIndex.value = num;
  breadData[0] = name;
  breadData.splice(1);
  menuItemListData.data = menuItemData[num];
};
</script>

<style lang="scss" scoped>
@use "@/style/public" as *;

.mainBox {
  height: calc(100% - 40px);
}

.n-layout {
  height: 100%;
  background-color: transparent;

  .n-layout-sider {
    width: 268px !important;
    background-color: rgba(243, 243, 243, 0.5);
    border-right: 1px solid #e0e0e0;
    margin-right: 40px;

    :deep(.n-layout-sider-scroll-container) {
      min-width: auto !important;
      padding-left: 16px;
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
    margin-bottom: 30px;
  }
}

.userAbout {
  @include flex(flex-start, center);
  margin-bottom: 24px;
  margin-top: 8px;

  img {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    margin-right: 12px;
    object-fit: cover;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  .aboutInfo {
    .infoName {
      font-size: 16px;
      font-weight: 600;
      color: var(--set-second-top-font-color);
      margin-bottom: 2px;
    }

    .infoMail {
      font-size: 12px;
      color: var(--set-second-desc-font-color);
    }
  }
}

.n-input {
  border: 1px solid var(--global-searchbox-border);
  border-bottom: 2px solid var(--global-theme-color);
  border-radius: 8px;
  background-color: var(--global-background-color) !important;
  margin-bottom: 22px;

  ::-webkit-input-placeholder {
    color: var(--global-placeholder-font-color);
  }

  :deep(.n-input__input-el) {
    &:focus {
      background-color: var(--global-background-color);
    }
  }
}

.menuList {
  position: relative;

  .listItem {
    height: 38px;
    border-radius: 5px;
    margin-bottom: 2px;
    padding: 0 4px;
    cursor: pointer;
    @include flex(flex-start, center);
    transition: background-color 150ms ease;

    &:hover {
      background-color: rgba(0, 0, 0, 0.03);
    }

    .niconStyle {
      margin-left: 8px;
      margin-right: 12px;
    }

    div {
      font-size: 13px;
      color: #1a1a1a;
    }
  }

  .listItemBgC {
    background-color: rgba(0, 103, 192, 0.08) !important;

    div {
      font-weight: 600;
    }
  }

  .listBar {
    width: 3px;
    height: 18px;
    border-radius: 2px;
    background-color: var(--global-theme-color);
    position: absolute;
    left: 0;
    top: 10px;
    transition: top 200ms cubic-bezier(0.4, 0, 0.2, 1);
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

      a {
        color: inherit;
      }
    }

    .n-breadcrumb-item__separator {
      margin: 0 8px;
    }
  }
}
</style>
