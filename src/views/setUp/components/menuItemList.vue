<template>
  <div class="menuItemList">
    <!-- 系统 -->
    <div class="system" v-show="menuName === '系统'">
      <div class="systemLeft">
        <img :src="getWallpaperUrl(backgroundImgUrl)" alt="windows11 背景图片" />
        <div>
          <div class="first">Windows 11</div>
          <div class="second">My PC</div>
          <div class="rename">重命名</div>
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

.menuItemList {
  width: calc(100% - 4px);
  height: calc(100% - 70px);
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 2px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #7c7e86;
    border-radius: 1px;
  }

  .listContainer {
    padding-bottom: 40px;

    .listTitle {
      font-size: 14px;
      font-weight: 600;
      color: #1a1a1a;
      margin-bottom: 14px;
    }
  }

  .listContent {
    max-width: 1000px;
    height: 67px;
    background-color: #fafcfd;
    margin-bottom: 3px;
    border: 1px solid #e4e4e8;
    border-radius: 6px;
    cursor: pointer;
    @include flex(space-between, center);
    transition: background-color 150ms ease, border-color 150ms ease;

    &:hover {
      background-color: #f5f6f8;
      border-color: #d0d3da;
    }

    .n-icon {
      margin-right: 20px;
    }

    .contentList {
      @include flex(flex-start, center);
    }

    .contentTitle {
      font-size: 12px;
      color: #1b1b1b;
      font-weight: bold;
    }

    .contentDesc {
      font-size: 12px;
      color: #757575;
    }
  }
}

.fontIcon {
  width: 20px;
  margin-left: 18px;
  margin-right: 20px;
}

.system {
  max-width: 1000px;
  height: 68px;
  margin-bottom: 26px;
  padding: 0 4px;
  @include flex(space-between, center);

  .systemLeft {
    @include flex(flex-start, flex-end);

    img {
      width: 112px;
      height: 60px;
      border: 1px solid #d0d3da;
      border-radius: 8px;
      margin-right: 16px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
    }

    .first {
      color: #1a1a1a;
      font-weight: 600;
      font-size: 14px;
    }

    .second {
      color: #565656;
      font-size: 13px;
    }

    .rename {
      color: #0067c0;
      font-size: 13px;
      cursor: pointer;

      &:hover {
        color: #00509e;
      }
    }
  }

  .systemRight {
    @include flex(flex-end, center);
    cursor: pointer;
    padding: 8px 12px;
    border-radius: 5px;
    transition: background-color 150ms ease;

    &:hover {
      background-color: rgba(0, 0, 0, 0.03);
    }

    img {
      width: 20px;
      height: 20px;
      margin-right: 16px;
    }

    .updated {
      font-weight: 600;
      font-size: 14px;
      color: #101010;
    }

    .lastTimeUpdate {
      font-size: 12px;
      color: #616161;
    }
  }
}

.network {
  max-width: 1000px;
  @include flex(space-between, center);
  margin-bottom: 20px;
  padding: 0 4px;

  &Left {
    @include flex(flex-start, center);

    & > .n-icon {
      margin-right: 24px;
    }
  }

  &Center {
    padding: 11px 12px;
    border-radius: 6px;
    @include flex(flex-start, center);

    & > .n-icon {
      margin-right: 12px;
    }
  }

  &Right {
    width: 192px;
    height: 56px;
    border-radius: 6px;
    @include flex(space-around, center);
  }

  &Title {
    font-size: 14px;
    color: #191a1a;
    font-weight: 600;
  }

  &Desc {
    @include flex(flex-start, center);
    font-size: 12px;
    color: #5b5d5f;

    .n-icon {
      margin-right: 6px;
    }
  }

  .hoverStyle {
    cursor: pointer;
    transition: background-color 150ms ease;

    &:hover {
      background-color: #f0f2f5;
    }
  }
}

.account {
  max-width: 1000px;
  height: 92px;
  margin-bottom: 30px;
  padding: 0 4px;
  @include flex(flex-start, center);

  img {
    height: 100%;
    border-radius: 50%;
    margin-right: 16px;
  }

  .userName {
    font-size: 14px;
    font-weight: 600;
    color: #1a1a1a;
  }

  &Type {
    font-size: 12px;
    color: #5f6264;
  }

  &Auth {
    font-size: 12px;
    color: #5f6264;
  }
}

.personalize {
  @include flex(flex-start, center);
  max-width: 1000px;
  margin-bottom: 20px;
  padding: 0 4px;

  .viewBox {
    width: 335px;
    height: 188px;
    border-radius: 8px;
    margin-right: 48px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  .selectBox {
    font-size: 14px;
    color: #191a1a;
    font-weight: 600;

    .boxTitle {
      margin-bottom: 16px;
    }

    .bgImgBox {
      width: 352px;
      height: 190px;
      @include grid(3, 2);
      grid-gap: 8px;

      img {
        width: 100%;
        height: 100%;
        border-radius: 6px;
        cursor: pointer;
        transition: transform 150ms ease;

        &:hover {
          transform: scale(1.03);
        }
      }

      .selected {
        box-sizing: border-box;
        padding: 1px;
        border: 2px solid #0067c0;
      }
    }
  }
}

.update {
  max-width: 1000px;
  @include flex(space-between, center);
  margin-bottom: 26px;
  padding: 0 4px;

  &Less {
    @include flex(flex-start, center);
    cursor: pointer;
    color: #0067c0;
    font-size: 12px;
    padding: 4px 8px;
    border-radius: 4px;
    transition: background-color 150ms ease;

    &:hover {
      background-color: rgba(0, 103, 192, 0.06);
    }

    .n-icon {
      margin-right: 10px;
    }
  }

  &Left {
    @include flex(flex-start, center);

    img {
      width: 84px;
      margin-left: 12px;
      margin-right: 18px;
    }

    .lastedVer {
      font-size: 16px;
      font-weight: 600;
      color: #191a1a;
    }

    .lastCheck {
      font-size: 12px;
      color: #5f6264;
    }
  }
}
</style>
