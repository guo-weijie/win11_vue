<template>
  <div class="menuItemList">
    <!-- 系统 -->
    <div class="system" v-show="(props.menuItemListData as Record<string, any>).name === '系统'">
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
    <div class="network" v-show="(props.menuItemListData as Record<string, any>).name === '网络和 Internet'">
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
    <div class="personalize" v-show="(props.menuItemListData as Record<string, any>).name === '个性化'">
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
    <div class="account" v-show="(props.menuItemListData as Record<string, any>).name === '账户'">
      <img :src="getUserAvatarUrl(userAvatar)" :alt="userName" />
      <div>
        <div class="userName">{{ userName }}</div>
        <div class="accountType">本地账户</div>
        <div class="accountAuth">管理员</div>
      </div>
    </div>

    <!-- windows 更新 -->
    <div class="update" v-show="(props.menuItemListData as Record<string, any>).name === 'Windows 更新'">
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
    <div class="updateLess" v-show="(props.menuItemListData as Record<string, any>).name === 'Windows 更新'">
      <n-icon size="16" color="#191a1a">
        <ChatBubblesQuestion20Filled />
      </n-icon>
      获取帮助
    </div>

    <div
      v-for="(item, index) in (props.menuItemListData as Record<string, any>).children"
      :key="item + index"
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
import { reactive } from "vue";
import { storeToRefs } from "pinia";

const store = userStore();
const { userName, userAvatar, backgroundImgUrl } = storeToRefs(store);

const props = defineProps({
  menuItemListData: Object,
});
const emit = defineEmits(["changeItem"]);

const toItem = (name: string, num: number) => {
  emit("changeItem", name, num);
};

// 获取壁纸图片URL
const images = import.meta.glob<{ default: string }>("/src/assets/wallpaper/**/*.jpg", { eager: true });
const getWallpaperUrl = (url: string) => {
  for (const path in images) {
    if (path.includes(url)) {
      return images[path].default;
    }
  }
};

// 获取用户头像URL
const getUserAvatarUrl = (path: string) => {
  return new URL(`../../../assets/icon/${path}.png`, import.meta.url).href;
};

const imgListData = reactive([
  {
    url: "/default/img0.jpg",
    select: true,
  },
  {
    url: "/ThemeC/img0.jpg",
    select: false,
  },
  {
    url: "/ThemeA/img0.jpg",
    select: false,
  },
  {
    url: "/default/img1.jpg",
    select: false,
  },
  {
    url: "/ThemeB/img0.jpg",
    select: false,
  },
  {
    url: "/ThemeD/img0.jpg",
    select: false,
  },
]);

const changeBgImg = (num: number) => {
  imgListData.forEach((item, index) => {
    if (index === num) {
      item.select = true;
      store.changeBackgroundImgUrl(item["url"]);
    } else {
      item.select = false;
    }
  });
};
</script>

<style lang="scss" scoped>
@use "@/style/public" as *;

.menuItemList {
  width: calc(100% - 4px);
  // height: 100%;
  height: calc(100% - 70px);
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 2px;
    height: 303px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #7c7e86;
    border-radius: 1px;
  }

  .listContainer {
    padding-bottom: 40px;

    .listTitle {
      font-size: 14px;
      font-weight: bold;
      color: #1a1a1a;
      margin-bottom: 10px;
    }
  }

  .listContent {
    max-width: 1000px;
    height: 67px;
    background-color: #fafcfd;
    margin-bottom: 3px;
    border: 1px solid #e0e6ea;
    border-radius: 5px;
    @include flex(space-between, center);

    &:hover {
      background-color: #f4f7f9;
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
  @include flex(space-between, center);

  .systemLeft {
    @include flex(flex-start, flex-end);

    img {
      width: 112px;
      height: 60px;
      border: 4px solid #000000;
      border-radius: 5px;
      margin-right: 16px;
    }

    .first {
      color: #1a1a1a;
      font-weight: bold;
      font-size: 12px;
    }

    .second {
      color: #565656;
      font-size: 13px;
    }

    .rename {
      color: #003e92;
      font-size: 14px;
    }
  }

  .systemRight {
    @include flex(flex-end, center);

    img {
      width: 20px;
      height: 20px;
      margin-right: 16px;
    }

    .updated {
      font-weight: bold;
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

  &Left {
    @include flex(flex-start, center);

    & > .n-icon {
      margin-right: 24px;
    }
  }

  &Center {
    padding: 11px 8px;
    border-radius: 5px;
    @include flex(flex-start, center);

    & > .n-icon {
      margin-right: 12px;
    }
  }

  &Right {
    width: 192px;
    height: 56px;
    border-radius: 5px;
    @include flex(space-around, center);
  }

  &Title {
    font-size: 14px;
    color: #191a1a;
    font-weight: bold;
  }

  &Desc {
    @include flex(flex-start, center);
    font-size: 12px;
    color: #5b5d5f;

    .n-icon {
      margin-right: 6px;
    }
  }

  .hoverStyle:hover {
    background-color: #e7ebf0;
  }
}

.account {
  max-width: 1000px;
  height: 92px;
  margin-bottom: 30px;
  @include flex(flex-start, center);

  img {
    height: 100%;
    margin-right: 16px;
  }

  .userName {
    font-size: 14px;
    font-weight: bold;
    color: #000000;
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

  .viewBox {
    width: 335px;
    height: 188px;
    border-radius: 5px;
    margin-right: 48px;
  }

  .selectBox {
    font-size: 14px;
    color: #191a1a;
    font-weight: bold;

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
        border-radius: 5px;
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

  &Less {
    @include flex(flex-start, center);
    color: #003e92;
    font-size: 12px;

    .n-icon {
      margin-right: 14px;
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
      font-size: 17px;
      font-weight: bold;
      color: #191a1a;
    }

    .lastCheck {
      font-size: 12px;
      color: #5f6264;
    }
  }
}
</style>
