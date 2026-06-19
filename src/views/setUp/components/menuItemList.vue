<template>
  <div class="menuItemList">
    <!-- 系统 -->
    <div class="system" v-show="menuName === '系统'">
      <div class="systemLeft">
        <img :src="getWallpaperUrl(backgroundImgUrl)" alt="windows11 背景图片" />
        <div class="systemInfo">
          <div class="first">Windows 11</div>
          <div class="systemMeta">
            <span class="second">My PC</span>
            <span class="sep">·</span>
            <span class="rename">重命名</span>
          </div>
        </div>
      </div>
      <div class="systemRight" @click="toItem('Windows 更新', 10)">
        <img src="../../../assets/icon/systemIcon/Windows Update.webp" alt="windows 更新" />
        <div>
          <div class="updated">Windows 更新</div>
          <div class="lastTimeUpdate">上次检查时间：2 小时前</div>
        </div>
      </div>
    </div>

    <!-- 网络和 Internet -->
    <div class="network" v-show="menuName === '网络和 Internet'">
      <div class="networkLeft">
        <n-icon size="92" color="#138fdb">
          <TvUsb20Regular />
        </n-icon>
        <div>
          <div class="networkTitle">网络</div>
          <div class="networkDesc">
            <n-icon size="14" color="#36bfc4">
              <Globe20Regular />
            </n-icon>
            已连接
          </div>
        </div>
      </div>
      <div class="networkCenter hoverStyle">
        <n-icon size="28" color="#000000">
          <Info20Regular />
        </n-icon>
        <div>
          <div class="networkTitle">属性</div>
          <div class="networkDesc">公用网络</div>
        </div>
      </div>
      <div class="networkRight hoverStyle">
        <n-icon size="30" color="#000000">
          <DataPie20Regular />
        </n-icon>
        <div>
          <div class="networkTitle">数据使用量</div>
          <div class="networkDesc">1MB，过去 1 天</div>
        </div>
        <n-icon size="16" color="#000000">
          <ChevronRight20Regular />
        </n-icon>
      </div>
    </div>

    <!-- 个性化 -->
    <div class="personalize" v-show="menuName === '个性化'">
      <img :src="getWallpaperUrl(backgroundImgUrl)" class="viewBox" alt="windows11 背景图片" />
      <div class="selectBox">
        <div class="boxTitle">选择要应用的主题</div>
        <div class="bgImgBox">
          <img
            v-for="(item, index) in imgListData"
            :class="{ selected: item.select }"
            :src="getWallpaperUrl(item.url)"
            :key="item.url"
            alt="windows11 桌面背景图片"
            @click.stop="changeBgImg(index)"
          />
        </div>
      </div>
    </div>

    <!-- 账户 -->
    <div class="account" v-show="menuName === '账户'">
      <img :src="getUserAvatarUrl(userAvatar)" :alt="userName" />
      <div>
        <div class="userName">{{ userName }}</div>
        <div class="accountType">本地账户</div>
        <div class="accountAuth">管理员</div>
      </div>
    </div>

    <!-- windows 更新 -->
    <div class="update" v-show="menuName === 'Windows 更新'">
      <div class="updateLeft">
        <img src="../../../assets/icon/systemIcon/updatec.png" alt="windows11 更新" />
        <div>
          <div class="lastedVer">你使用的是最新版本</div>
          <div class="lastCheck">上次检查时间：今天，00:00</div>
        </div>
      </div>
      <n-button color="#0067c0" text-color="#ffffff">检查更新</n-button>
    </div>

    <!-- windows 更新 -->
    <div class="updateLess" v-show="menuName === 'Windows 更新'">
      <n-icon size="16" color="#191a1a">
        <ChatBubblesQuestion20Filled />
      </n-icon>
      获取帮助
    </div>

    <div
      v-for="(item, index) in props.menuItemListData.children"
      :key="item.title + index"
      class="listContainer"
    >
      <div class="listTitle" v-if="item.title">{{ item.title }}</div>
      <div class="listContent" v-for="iten in item.itemList" :key="iten.name">
        <div class="contentList">
          <n-icon size="20" color="#5c5c5c" :component="iten.icon" class="fontIcon"></n-icon>
          <div>
            <div class="contentTitle">{{ iten.name }}</div>
            <div class="contentDesc">{{ iten.desc }}</div>
          </div>
        </div>
        <n-icon color="#484848">
          <ChevronRight20Regular />
        </n-icon>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { NIcon, NButton } from "naive-ui";
import {
  ChevronRight20Regular,
  ChatBubblesQuestion20Filled,
  Info20Regular,
  DataPie20Regular,
  Globe20Regular,
  TvUsb20Regular,
} from "@vicons/fluent";
import { userStore } from "@/store/user";
import { storeToRefs } from "pinia";
import type { MenuData } from "../menu";

const store = userStore();
const { userName, userAvatar, backgroundImgUrl } = storeToRefs(store);

const props = defineProps<{
  menuItemListData: MenuData;
}>();
const emit = defineEmits<{
  changeItem: [name: string, num: number];
}>();

const menuName = computed(() => props.menuItemListData.name);

const toItem = (name: string, num: number) => {
  emit("changeItem", name, num);
};

// 获取壁纸图片URL（预构建查找 Map，避免每次调用都遍历）
const images = import.meta.glob<{ default: string }>("/src/assets/wallpaper/**/*.jpg", { eager: true });
const wallpaperMap = new Map<string, string>();
for (const path in images) {
  wallpaperMap.set(path, images[path].default);
}
const getWallpaperUrl = (url: string) => {
  for (const [path, imgUrl] of wallpaperMap) {
    if (path.includes(url)) return imgUrl;
  }
};

// 获取用户头像URL
const getUserAvatarUrl = (path: string) => {
  return new URL(`../../../assets/icon/${path}.png`, import.meta.url).href;
};

const imgListData = ref([
  { url: "/default/img0.jpg", select: true },
  { url: "/ThemeC/img0.jpg", select: false },
  { url: "/ThemeA/img0.jpg", select: false },
  { url: "/default/img1.jpg", select: false },
  { url: "/ThemeB/img0.jpg", select: false },
  { url: "/ThemeD/img0.jpg", select: false },
]);

const changeBgImg = (num: number) => {
  imgListData.value.forEach((item, index) => {
    item.select = index === num;
  });
  store.changeBackgroundImgUrl(imgListData.value[num].url);
};
</script>

<style lang="scss" scoped>
@use "@/style/public" as *;
@use "@/style/responsive" as *;

.menuItemList {
  width: calc(100% - 4px);
  height: calc(100% - 70px);
  overflow-y: auto;

  @include mobile {
    width: 100%;
    height: auto;
    padding: 0 8px;
    overflow-x: hidden;
    overflow-y: auto;
    max-width: 100vw;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  &::-webkit-scrollbar {
    width: 2px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #7c7e86;
    border-radius: 1px;
  }

  .listContainer {
    padding-bottom: 30px;

    @include mobile {
      padding-bottom: 24px;
    }

    .listTitle {
      font-size: 13px;
      font-weight: 600;
      color: #1b1b1b;
      margin-bottom: 6px;
      padding-left: 4px;
      text-transform: none;

      @include mobile {
        font-size: 13px;
        margin-bottom: 8px;
      }
    }
  }

  .listContent {
    max-width: 1000px;
    height: 52px;
    background-color: rgba(255, 255, 255, 0.4);
    margin-bottom: 8px;
    border: none;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    border-radius: 0;
    cursor: pointer;
    @include flex(space-between, center);
    transition: background-color 120ms ease;
    padding: 0 4px;

    &:first-of-type {
      border-top: 1px solid rgba(0, 0, 0, 0.06);
      border-radius: 8px 8px 0 0;
    }

    &:last-of-type {
      border-bottom: none;
      border-radius: 0 0 8px 8px;
    }

    &:only-of-type {
      border-radius: 8px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    }

    @include mobile {
      max-width: 100%;
      height: auto;
      min-height: 56px;
      padding: 10px 0;
      border-radius: 4px;
      background-color: #fafcfd;
      border: 1px solid #e4e4e8;
      border-radius: 4px;
      margin-bottom: 2px;

      &:first-of-type,
      &:last-of-type,
      &:only-of-type {
        border-radius: 4px;
        border: 1px solid #e4e4e8;
      }

      .n-icon {
        margin-right: 10px;
      }

      .contentList {
        flex: 1;
        min-width: 0;
      }
    }

    &:hover {
      background-color: rgba(0, 0, 0, 0.03);
    }

    .n-icon {
      margin-right: 16px;
    }

    .contentList {
      @include flex(flex-start, center);

      @include mobile {
        flex: 1;
        min-width: 0;

        & > div {
          min-width: 0;
          overflow: hidden;
        }

        .fontIcon {
          width: 18px;
          margin-left: 10px;
          margin-right: 10px;
        }
      }
    }

    .contentTitle {
      font-size: 13px;
      color: #1b1b1b;
      font-weight: 500;
      margin-bottom: 1px;

      @include mobile {
        font-size: 13px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .contentDesc {
      font-size: 12px;
      color: #6b6b6b;

      @include mobile {
        font-size: 11px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 220px;
      }
    }
  }
}

.fontIcon {
  width: 22px;
  margin-left: 10px;
  margin-right: 14px;
}

.system {
  max-width: 1000px;
  margin-bottom: 20px;
  padding: 20px 24px;
  @include flex(space-between, center);
  background-color: rgba(255, 255, 255, 0.65);
  border: none;
  border-radius: 8px;
  box-shadow: none;

  @include tablet {
    padding: 14px 16px;
    margin-bottom: 18px;
  }

  @include mobile {
    height: auto;
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
    margin-bottom: 16px;
    padding: 12px 14px;
    max-width: 100%;
    overflow: hidden;
    border-radius: 6px;
    background-color: #fafcfd;
    border: 1px solid #e4e4e8;
  }

  .systemLeft {
    @include flex(flex-start, center);
    gap: 16px;

    @include tablet {
      gap: 12px;
    }

    @include mobile {
      gap: 12px;
      min-width: 0;
    }

    img {
      width: 140px;
      height: 78px;
      border: 1px solid rgba(0, 0, 0, 0.1);
      border-radius: 6px;
      object-fit: cover;
      box-shadow: none;
      flex-shrink: 0;

      @include tablet {
        width: 120px;
        height: 68px;
      }

      @include mobile {
        width: 80px;
        height: 44px;
        border-radius: 6px;
        border: 1px solid #e0e0e6;
      }
    }

    .systemInfo {
      display: flex;
      flex-direction: column;
      gap: 4px;

      @include mobile {
        min-width: 0;
        overflow: hidden;
      }
    }

    .systemMeta {
      display: flex;
      align-items: center;
      gap: 4px;
      flex-wrap: wrap;
    }

    .sep {
      color: #b0b0b0;
      font-size: 13px;
      user-select: none;
    }

    .first {
      color: #1b1b1b;
      font-weight: 600;
      font-size: 16px;
      line-height: 1.3;

      @include tablet {
        font-size: 14px;
      }

      @include mobile {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .second {
      color: #5d5d5d;
      font-size: 13px;

      @include tablet {
        font-size: 12px;
      }

      @include mobile {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .rename {
      color: #0067c0;
      font-size: 13px;
      cursor: pointer;
      padding: 1px 4px;
      border-radius: 4px;
      transition: background-color 120ms ease;

      @include tablet {
        font-size: 12px;
      }

      @include mobile {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        background-color: rgba(0, 103, 192, 0.06);
        padding: 2px 8px;
      }

      &:hover {
        background-color: rgba(0, 103, 192, 0.06);
      }

      &:active {
        background-color: rgba(0, 103, 192, 0.1);
      }
    }
  }

  .systemRight {
    @include flex(center, center);
    cursor: pointer;
    padding: 8px 14px;
    border-radius: 6px;
    transition: background-color 120ms ease;
    flex-shrink: 0;
    gap: 10px;
    background-color: transparent;
    border: 1px solid transparent;

    @include tablet {
      padding: 6px 10px;
      gap: 8px;
    }

    @include mobile {
      justify-content: flex-start;
      padding: 12px 14px;
      min-width: 0;
      gap: 10px;
      background-color: #f5f6f8;
      border: 1px solid #e8e8ec;
      border-radius: 6px;

      & > div {
        min-width: 0;
        overflow: hidden;

        .updated,
        .lastTimeUpdate {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }

    &:hover {
      background-color: rgba(0, 0, 0, 0.03);
    }

    &:active {
      background-color: rgba(0, 0, 0, 0.05);
    }

    img {
      width: 16px;
      height: 16px;
      flex-shrink: 0;
    }

    .updated {
      font-weight: 400;
      font-size: 12px;
      color: #5d5d5d;
      margin-bottom: 1px;
    }

    .lastTimeUpdate {
      font-size: 11px;
      color: #8a8a8a;
    }
  }
}

.network {
  max-width: 1000px;
  @include flex(space-between, center);
  gap: 8px;
  margin-bottom: 20px;
  padding: 0 2px;

  @include mobile {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
    margin-bottom: 16px;
    padding: 0;
    max-width: 100%;
    overflow: hidden;
  }

  &Left {
    flex: 1;
    @include flex(flex-start, center);
    min-width: 0;
    padding: 14px 16px;
    border-radius: 8px;
    background-color: transparent;
    border: none;

    @include mobile {
      padding: 12px 14px;
      background-color: #fafcfd;
      border: 1px solid #e4e4e8;
    }

    & > div {
      min-width: 0;
      overflow: hidden;

      .networkDesc {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    & > .n-icon {
      margin-right: 16px;

      @include mobile {
        margin-right: 12px;
        font-size: 48px !important;
      }
    }
  }

  &Center {
    flex: 1;
    padding: 14px 16px;
    border-radius: 8px;
    @include flex(flex-start, center);
    background-color: transparent;
    border: none;

    @include mobile {
      background-color: #fafcfd;
      border: 1px solid #e4e4e8;
    }

    & > .n-icon {
      margin-right: 12px;
    }
  }

  &Right {
    flex: 1;
    min-height: 56px;
    border-radius: 8px;
    @include flex(flex-start, center);
    padding: 14px 16px;
    background-color: transparent;
    border: none;

    @include mobile {
      width: 100%;
      height: auto;
      padding: 12px 14px;
      background-color: #fafcfd;
      border: 1px solid #e4e4e8;
      justify-content: space-between;
    }

    & > .n-icon:last-child {
      margin-left: auto;
    }
  }

  &Title {
    font-size: 13px;
    color: #1b1b1b;
    font-weight: 600;
  }

  &Desc {
    @include flex(flex-start, center);
    font-size: 12px;
    color: #6b6b6b;

    .n-icon {
      margin-right: 6px;
    }
  }

  .hoverStyle {
    cursor: pointer;
    transition: background-color 120ms ease;

    &:hover {
      background-color: rgba(0, 0, 0, 0.03) !important;
    }
  }
}

.account {
  max-width: 1000px;
  margin-bottom: 20px;
  padding: 20px 24px;
  @include flex(flex-start, center);
  background-color: rgba(255, 255, 255, 0.65);
  border: none;
  border-radius: 8px;
  box-shadow: none;

  @include mobile {
    height: auto;
    margin-bottom: 16px;
    padding: 14px;
    background-color: #fafcfd;
    border: 1px solid #e4e4e8;
  }

  img {
    height: 52px;
    width: 52px;
    border-radius: 50%;
    margin-right: 16px;
    box-shadow: none;

    @include mobile {
      height: 56px;
      width: 56px;
    }
  }

  .userName {
    font-size: 15px;
    font-weight: 600;
    color: #1b1b1b;
    margin-bottom: 2px;
  }

  &Type {
    font-size: 12px;
    color: #6b6b6b;
  }

  &Auth {
    font-size: 12px;
    color: #6b6b6b;
  }
}

.personalize {
  @include flex(flex-start, center);
  max-width: 1000px;
  margin-bottom: 20px;
  padding: 16px 20px;
  background-color: rgba(255, 255, 255, 0.65);
  border: none;
  border-radius: 8px;
  box-shadow: none;

  @include mobile {
    flex-direction: column;
    align-items: stretch;
    padding: 12px 14px;
    margin-bottom: 16px;
    background-color: #fafcfd;
    border: 1px solid #e4e4e8;
  }

  .viewBox {
    width: 300px;
    height: 168px;
    border-radius: 6px;
    margin-right: 32px;
    box-shadow: none;

    @include mobile {
      width: 100%;
      height: auto;
      aspect-ratio: 16/9;
      margin-right: 0;
      margin-bottom: 16px;
      border-radius: 6px;
    }
  }

  .selectBox {
    font-size: 14px;
    color: #191a1a;
    font-weight: 600;

    .boxTitle {
      margin-bottom: 12px;

      @include mobile {
        margin-bottom: 10px;
        font-size: 13px;
      }
    }

    .bgImgBox {
      width: 352px;
      height: 190px;
      @include grid(3, 2);
      grid-gap: 8px;

      @include mobile {
        width: 100%;
        height: auto;
        aspect-ratio: 3/2;
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: repeat(2, 1fr);
        grid-gap: 6px;
      }

      img {
        width: 100%;
        height: 100%;
        border-radius: 6px;
        cursor: pointer;
        transition: transform 150ms ease, box-shadow 150ms ease;

        &:hover {
          transform: scale(1.03);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
      }

      .selected {
        box-sizing: border-box;
        padding: 1px;
        border: 2px solid #0067c0;
        box-shadow: 0 0 0 2px rgba(0, 103, 192, 0.2);
      }
    }
  }
}

.update {
  max-width: 1000px;
  @include flex(space-between, center);
  margin-bottom: 16px;
  padding: 16px 24px;
  background-color: rgba(255, 255, 255, 0.65);
  border: none;
  border-radius: 8px;
  box-shadow: none;

  @include mobile {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
    margin-bottom: 16px;
    padding: 12px 14px;
    max-width: 100%;
    overflow: hidden;
    background-color: #fafcfd;
    border: 1px solid #e4e4e8;
  }

  &Less {
    @include flex(flex-start, center);
    cursor: pointer;
    color: #0067c0;
    font-size: 13px;
    padding: 4px 8px;
    border-radius: 4px;
    transition: background-color 120ms ease;
    max-width: 1000px;

    @include mobile {
      background-color: rgba(0, 103, 192, 0.06);
      padding: 6px 10px;
    }

    &:hover {
      background-color: rgba(0, 103, 192, 0.06);
    }

    .n-icon {
      margin-right: 8px;
    }
  }

  &Left {
    @include flex(flex-start, center);
    min-width: 0;

    @include mobile {
      min-width: 0;

      & > div {
        min-width: 0;
        overflow: hidden;

        .lastedVer,
        .lastCheck {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }

    img {
      width: 48px;
      height: 48px;
      margin-right: 16px;
      object-fit: contain;

      @include mobile {
        width: 48px;
        height: 48px;
        margin-left: 0;
        margin-right: 12px;
      }
    }

    .lastedVer {
      font-size: 14px;
      font-weight: 600;
      color: #1b1b1b;
      margin-bottom: 2px;

      @include mobile {
        font-size: 14px;
      }
    }

    .lastCheck {
      font-size: 12px;
      color: #6b6b6b;
    }
  }
}
</style>
