<template>
  <div class="controlCneterContainer">
    <div class="itemContainer">
      <!-- 功能菜单 -->
      <div class="containerItem">
        <div :class="{ itemBox: true, itemBoxEdit: editOperate }" v-for="item in fnShowItem" :key="item.name">
          <div :class="{ boxIcon: true, selectItem: item.select && !item.menu }" @click="selectFn(item)">
            <img :src="item.icon" :alt="item.name" />
            <n-icon v-if="item.menu" size="16" style="margin-left: 8px">
              <KeyboardArrowRightRound />
            </n-icon>
          </div>
          <p>{{ item.name }}</p>
          <!-- 取消固定按钮 -->
          <n-button circle secondary v-show="editOperate" @click="item.show = false">
            <template #icon>
              <n-icon size="16px" color="#696969">
                <CloseRound />
              </n-icon>
            </template>
          </n-button>
        </div>
      </div>
      <!-- 音量调节 -->
      <div class="audioControl">
        <img :src="audioIcon" alt="音量" />
        <div class="controlSlider">
          <n-slider v-model:value="audioValue" />
        </div>
        <n-icon size="26" @click="audioFnOpearStatus = true">
          <KeyboardArrowRightRound />
        </n-icon>
      </div>
    </div>
    <!-- 功能更多操作 -->
    <div class="moreOpera" v-show="helpFnOperaStatus || audioFnOpearStatus || keyBoardOpearStatus">
      <div class="opearHeader">
        <n-icon size="16px" @click="backFnMenu">
          <ArrowBackRound />
        </n-icon>
        <div v-if="keyBoardOpearStatus" class="keyboardStyle">
          键盘布局
          <n-icon size="15px">
            <svg
              t="1647585985521"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="8197"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              width="64"
              height="64"
            >
              <defs />
              <path
                d="M490.666667 128v362.666667H128V128h362.666667z m0 768H128v-362.666667h362.666667V896z m42.666666-768H896v362.666667h-362.666667V128z m362.666667 405.333333V896h-362.666667v-362.666667H896z"
                p-id="8198"
                fill="#5b5d60"
              />
            </svg>
          </n-icon>
          <span>空格键</span>
        </div>
        <div v-if="helpFnOperaStatus">辅助功能</div>
        <div v-if="audioFnOpearStatus">音量</div>
      </div>
      <!-- 辅助功能 -->
      <div v-if="helpFnOperaStatus" class="opearBody">
        <div v-for="item in helpFn" :key="item.name" class="bodyHelpFn">
          <n-button text text-color="#191a1b">
            <template #icon>
              <n-icon :component="item.icon" size="18px"></n-icon>
            </template>
            {{ item.name }}
          </n-button>
          <div>
            {{ item.status ? "开" : "关" }}
            <n-switch v-model:value="item.status" />
          </div>
        </div>
      </div>
      <!-- 音量 -->
      <div v-if="audioFnOpearStatus" class="opearBody bodyAudio">
        <div class="audioItem">
          <n-h4 prefix="bar" type="info" style="color: #18191a; font-size: 14px">
            <n-icon color="#18191a" size="18"> <SpeakerOutlined /> </n-icon>扬声器（High Definition Audio Device）
          </n-h4>
        </div>
      </div>
      <!-- 键盘 -->
      <div v-if="keyBoardOpearStatus" class="opearBody bodyKeyboard">
        <div class="audioItem">
          <n-h4 prefix="bar" type="info" style="color: #18191a; font-size: 14px">
            <div class="pinyin">拼</div>
            <div class="itemDesc">
              <div>中文(简体，中国)</div>
              <span>微软拼音</span>
            </div>
          </n-h4>
        </div>
      </div>
      <div class="operaFooter">更多{{ helpFnOperaStatus ? "辅助功能" : audioFnOpearStatus ? "音量" : "键盘" }}设置</div>
    </div>
    <div :class="{ containerSet: true, editSet: !editOperate, completeAdd: editOperate }">
      <div v-show="!editOperate">
        <img class="setEdit" :src="editIcon" alt="操作中心编辑" @click="editOperate = true" />
        <img class="setSettings" :src="settingsIcon" alt="操作中心设置" />
      </div>
      <div v-show="editOperate">
        <n-button secondary color="#18191a" @click="editOperate = false">
          <template #icon>
            <n-icon>
              <CheckRound />
            </n-icon>
          </template>
          完成
        </n-button>
        <n-popover placement="top" trigger="click" :show-arrow="false" class="myPopover" :z-index="zIndex">
          <template #trigger>
            <n-button secondary color="#18191a">
              <template #icon>
                <n-icon>
                  <AddRound />
                </n-icon>
              </template>
              添加
            </n-button>
          </template>
          <div class="large-text">
            <div v-for="item in fnAddItem" :key="item.name + 'a'" @click="item.show = true">
              <img :src="item.icon" :alt="item.name" />
              <span>{{ item.name }}</span>
            </div>
          </div>
        </n-popover>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, computed, ref, markRaw } from "vue";
import type { Component } from "vue";
import {
  KeyboardArrowRightRound,
  CloseRound,
  AddRound,
  CheckRound,
  ArrowBackRound,
  ColorLensOutlined,
  SpeakerOutlined,
  LoupeRound,
  KeyboardCommandKeyFilled,
} from "@vicons/material";
import { DesktopSpeaker20Regular, Speaker248Regular } from "@vicons/fluent";
import { NIcon, NSlider, NButton, NPopover, NSwitch, NH4 } from "naive-ui";

import audioIcon from "@/assets/icon/systemIcon/audio.png";
import editIcon from "@/assets/icon/systemIcon/edit.png";
import settingsIcon from "@/assets/icon/systemIcon/settings.png";
import nightlightIcon from "@/assets/icon/systemIcon/nightlight.png";
import moonIcon from "@/assets/icon/systemIcon/moon.png";
import keyboardIcon from "@/assets/icon/systemIcon/keyboard.png";

// 类型定义
interface ControlItem {
  name: string;
  icon: string;
  show: boolean;
  select: boolean;
  menu: boolean;
}

interface HelpFunction {
  icon: Component;
  name: string;
  status: boolean;
}

const audioValue = ref(50);
const zIndex = 9999;

// 编辑操作状态
const editOperate = ref(false);

// 辅助功能操作状态
const helpFnOperaStatus = ref(false);
// 音量功能操作状态
const audioFnOpearStatus = ref(false);
// 键盘功能操作状态
const keyBoardOpearStatus = ref(false);

// 所有功能项数据
const fnAllItem = reactive<ControlItem[]>([
  {
    name: "夜间模式",
    icon: nightlightIcon,
    show: true,
    select: false,
    menu: false,
  },
  {
    name: "专注助手",
    icon: moonIcon,
    show: true,
    select: false,
    menu: false,
  },
  {
    name: "辅助功能",
    icon: nightlightIcon,
    show: true,
    select: false,
    menu: true,
  },
  {
    name: "投放",
    icon: nightlightIcon,
    show: false,
    select: false,
    menu: false,
  },
  {
    name: "键盘布局",
    icon: keyboardIcon,
    show: true,
    select: false,
    menu: true,
  },
  {
    name: "投影",
    icon: nightlightIcon,
    show: false,
    select: false,
    menu: false,
  },
]);

// 不显示的数据，即添加按钮的选项
const fnAddItem = computed(() => fnAllItem.filter((item) => !item.show));
// 固定显示的数据
const fnShowItem = computed(() => fnAllItem.filter((item) => item.show));

// 辅助功能数据
const helpFn = reactive<HelpFunction[]>([
  {
    icon: markRaw(LoupeRound),
    name: "放大镜",
    status: false,
  },
  {
    icon: markRaw(ColorLensOutlined),
    name: "颜色滤镜",
    status: true,
  },
  {
    icon: markRaw(DesktopSpeaker20Regular),
    name: "讲述人",
    status: false,
  },
  {
    icon: markRaw(Speaker248Regular),
    name: "单声道音频",
    status: true,
  },
  {
    icon: markRaw(KeyboardCommandKeyFilled),
    name: "粘滞键",
    status: false,
  },
]);

// 点击功能菜单
const selectFn = (item: ControlItem) => {
  if (editOperate.value) return;
  
  if (item.name === "辅助功能") {
    helpFnOperaStatus.value = true;
    return;
  }
  if (item.name === "键盘布局") {
    keyBoardOpearStatus.value = true;
    return;
  }
  item.select = !item.select;
};

// 二级操作页返回箭头点击事件 -> 所有二级操作状态赋值为 false 即可
const backFnMenu = () => {
  helpFnOperaStatus.value = false;
  audioFnOpearStatus.value = false;
  keyBoardOpearStatus.value = false;
};
</script>

<style lang="scss" scoped>
.controlCneterContainer {
  width: 358px;
  height: 337px;
  position: relative;
  @include box_border;

  .containerItem {
    height: 241px;
    box-sizing: border-box;
    padding: 22px 24px;
    background-color: #e9f2fa;
    @include flex(flex-start, flex-start);
    flex-wrap: wrap;
    align-content: flex-start;

    div:nth-child(3n-1) {
      margin: 0 14px;

      .boxIcon {
        box-shadow: 0 0 2px #ced1d4;
      }
    }
  }

  .audioControl {
    box-sizing: border-box;
    padding: 0 24px 22px 24px;
    background-color: #e9f2fa;
  }

  .containerBody {
    width: 100%;
    height: calc(100% - 48px);
  }

  .containerSet {
    box-sizing: border-box;
    height: 47px;
    border-top: 1px solid #d4dde8;
    background-color: #e2ecf9;
  }

  .moreOpera {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #e9f2fa;
    font-size: 12px;
    color: #191a1b;
    z-index: 99;
  }
}

.itemBox {
  margin-bottom: 26px;
  text-align: center;

  .boxIcon {
    width: 94px;
    height: 46px;
    background-color: #f6f9fd;
    border-radius: 4px;
    box-shadow: 1px 1px 2px #ced1d4;
    overflow: hidden;
    margin-bottom: 12px;
    @include flex(center, center);

    &:hover {
      background-color: #f1f5fa;
    }

    img {
      width: 16px;
      height: 16px;
    }
  }

  .selectItem {
    background-color: #0067c0;

    img {
      filter: invert(100%);
    }

    &:hover {
      background-color: #0067c0;
    }
  }

  p {
    font-size: 11px;
    color: #181a1a;
    margin: 0;
  }
}

.itemBoxEdit {
  position: relative;

  .boxIcon {
    background-color: #e9eef8;

    &:hover {
      background-color: #e9eef8;
    }

    img {
      filter: invert(60%);
    }

    .n-icon {
      color: #bcc1c5;
    }
  }

  p {
    color: #91969f;
  }

  .n-button {
    position: absolute;
    top: -4px;
    right: -6px;
    width: auto;
    height: auto;
    background-color: #fff;
    // border-radius: 50%;
    text-align: center;
  }
}

.audioControl {
  @include flex(space-between, center);

  img {
    height: 20px;
  }

  .controlSlider {
    width: 260px;
    margin-left: 10px;
    margin-right: 4px;
  }

  :deep(.n-slider-rail) {
    background-color: #81868a;

    .n-slider-handle {
      background: {
        image: url("@/assets/icon/systemIcon/point.png");
        repeat: no-repeat;
        position: center;
        size: 100%;
      }
    }

    .n-slider-rail__fill {
      background-color: #0067c0 !important;
    }
  }
}

.editSet {
  padding-right: 16px;
  @include flex(flex-end, center);

  .setEdit {
    width: 16px;
    margin-right: 22px;
  }

  .setSettings {
    width: 18px;
    filter: invert(80%);
  }
}

.completeAdd {
  @include flex(center, center);
}

.n-popover {
  .large-text {
    color: #1a1a1b !important;
    user-select: none;

    & > div {
      padding: 4px 0;
    }

    img {
      width: 16px;
      height: 12px;
      margin-right: 12px;
    }
  }
}

.moreOpera {
  .opearHeader {
    box-sizing: border-box;
    width: 100%;
    height: 50px;
    padding-left: 17px;
    font-weight: bold;
    @include flex(flex-start, center);

    & > .n-icon {
      margin-right: 18px;
    }

    .keyboardStyle {
      @include flex(flex-start, center);

      .n-icon {
        padding: 1px;
        margin-left: 9px;
        margin-right: 4px;
        border: 1px solid #bec4ca;
        border-radius: 3px;
      }

      span {
        color: #5a5d60;
        padding: 1px;
        border: 1px solid #bec4ca;
        border-radius: 3px;
      }
    }
  }

  .opearBody {
    height: 238px;

    .bodyHelpFn {
      height: 45px;
      @include flex(space-between, center);
      color: #191a1b;
      padding: 0 16px;

      .n-button {
        font-size: 14px;

        &:hover {
          border: none;
        }
      }

      .n-switch {
        margin-left: 12px;
      }

      :deep(.n-switch__rail) {
        border: 1px solid #81868a;
      }
    }
  }

  .bodyAudio {
    width: calc(100% - 8px);
    margin-left: 4px;

    .audioItem {
      width: 100%;
      height: 40px;
      border-radius: 4px;
      @include flex(flex-start, center);

      &:hover {
        background-color: #e5eaf2;
      }
    }

    .n-h4 {
      margin: 0;
      @include flex(flex-start, center);

      .n-icon {
        margin-right: 10px;
      }
    }
  }

  .bodyKeyboard {
    @extend .bodyAudio;

    .pinyin {
      font-size: 18px;
      color: #18191a;
      font-weight: bold;
      margin-right: 14px;
    }

    .itemDesc {
      div {
        font-size: 12px;
        color: #353638;
      }

      span {
        @include mini_font(11);
        color: #6c6e72;
      }
    }
  }

  .operaFooter {
    width: 100%;
    line-height: 48px;
    padding-left: 15px;
    color: #585b5f;
    @extend .containerSet;
  }
}
</style>
