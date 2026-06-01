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
          <n-tab v-for="item in searchTitle" :key="item" :name="item">{{ item }}</n-tab>
          <n-tab name="更多">
            <n-popover trigger="click" placement="bottom-start" :show-arrow="false" class="myPopover" :z-index="zIndex">
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
                <div v-for="item in searchTitleMore" :key="item" @click.stop="moreChange(item)">{{ item }}</div>
              </div>
            </n-popover>
          </n-tab>
        </n-tabs>
        <!-- 右 -->
        <div class="titleBoxRight">
          <n-button text style="font-size: 20px" color="#18191b">
            <n-icon>
              <PersonFeedback20Regular />
            </n-icon>
          </n-button>
          <n-popover trigger="click" placement="bottom-end" :show-arrow="false" class="myPopover" :z-index="zIndex">
            <template #trigger>
              <n-button text style="font-size: 20px" color="#18191b" title="提供反馈">
                <n-icon>
                  <MoreHorizontal20Regular />
                </n-icon>
              </n-button>
            </template>
            <div class="searchSet">
              <div>
                <n-icon size="20">
                  <Settings20Regular /> </n-icon
                >搜索设置
              </div>
              <div>
                <n-icon size="20">
                  <ScreenSearch20Regular /> </n-icon
                >索引选项
              </div>
              <div>内部版本：2022.03.20.27644848</div>
            </div>
          </n-popover>
        </div>
      </div>
      <!-- 搜索主体 -->
      <div class="bodyBox">
        <All_app :title="all_app_Title" v-show="isShow" />
        <OtherFn :title="all_app_Title" v-show="!isShow" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { NInput, NIcon, NTabs, NTab, NPopover, NButton } from "naive-ui";
import {
  ChevronDown20Regular,
  MoreHorizontal20Regular,
  PersonFeedback20Regular,
  Settings20Regular,
  ScreenSearch20Regular,
} from "@vicons/fluent";
import { reactive, ref } from "vue";
import All_app from "@/components/searchCom/all_app.vue";
import OtherFn from "@/components/searchCom/otherFn.vue";

// 类型定义
type TabName = string;

const inputValue = ref("");
const zIndex = 9999;

// 搜索标题数据
const searchTitle = reactive<TabName[]>(["全部", "应用", "文档", "网页"]);
const searchTitleMore = reactive<TabName[]>(["电子邮件", "人员", "设置", "视频", "文件夹", "音乐", "照片"]);
const tabName = ref<TabName>("全部");
const isShow = ref(true);
const all_app_Title = ref("热门应用");

// Tab 切换处理
const tabNameChange = () => {
  if (tabName.value === "更多") return;
  
  if (tabName.value === "全部") {
    inputValue.value = "";
    isShow.value = true;
    all_app_Title.value = "热门应用";
  } else {
    inputValue.value = tabName.value + "：";
    if (tabName.value === "应用") {
      all_app_Title.value = "常用";
      isShow.value = true;
    } else {
      isShow.value = false;
      all_app_Title.value = tabName.value;
    }
  }
  
  // 管理标签显示逻辑
  manageTabDisplay();
};

// 管理标签显示：确保前4个位置显示主要标签，其余在"更多"中
const manageTabDisplay = () => {
  const mainTabs = ["全部", "应用", "文档", "网页"];
  const currentMainTabs = searchTitle.slice(0, 4);
  
  // 如果当前前4个标签与主要标签不一致，需要调整
  if (JSON.stringify(currentMainTabs) !== JSON.stringify(mainTabs)) {
    // 找出不在前4位的标签
    const extraTabs = searchTitle.filter(tab => !mainTabs.includes(tab));
    
    // 重置为默认的主要标签
    searchTitle.length = 0;
    searchTitle.push(...mainTabs);
    
    // 将额外标签添加到更多中
    extraTabs.forEach(tab => {
      if (!searchTitleMore.includes(tab)) {
        searchTitleMore.push(tab);
      }
    });
    
    // 排序
    searchTitleMore.sort((a, b) => a.localeCompare(b));
  }
};

// "更多"选项点击处理
const moreChange = (name: string) => {
  const mainTabs = ["全部", "应用", "文档", "网页"];
  
  // 如果该标签已经在主标签中，不做处理
  if (mainTabs.includes(name)) return;
  
  // 找到要替换的位置（第5个位置，索引4）
  const replaceIndex = 4;
  
  if (searchTitle.length <= replaceIndex) {
    // 如果还没有第5个标签，直接添加
    searchTitle.push(name);
    searchTitleMore.splice(searchTitleMore.indexOf(name), 1);
  } else {
    // 替换第5个标签
    const replacedTab = searchTitle[replaceIndex];
    searchTitle[replaceIndex] = name;
    
    // 将被替换的标签放回更多列表
    if (!searchTitleMore.includes(replacedTab)) {
      searchTitleMore.push(replacedTab);
    }
    
    // 从更多列表中移除当前选中的标签
    const nameIndex = searchTitleMore.indexOf(name);
    if (nameIndex > -1) {
      searchTitleMore.splice(nameIndex, 1);
    }
  }
  
  // 排序更多列表
  searchTitleMore.sort((a, b) => a.localeCompare(b));
  
  // 更新选中状态
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
  background-color: #f2f2f2;
}
.n-input {
  border: 1px solid #e4e4e4;
  border-bottom: 2px solid #0067c0;
  background-color: #fff !important;
  margin-bottom: 20px;
  :deep(.n-input__prefix) {
    margin-right: 8px;
  }
  ::-webkit-input-placeholder {
    color: #616161;
  }
  :deep(.n-input__input-el) {
    color: #333;
    &:focus {
      background-color: #fff;
    }
  }
}
.searchBody {
  height: calc(100% - 37px - 20px);
  .bodyTitleBox {
    @include flex(space-between, center);
  }
  .titleBoxRight {
    @include flex(flex-end, center);
    .n-button {
      width: 30px;
      height: 30px;
      border-radius: 3px;
      &:hover {
        background-color: #fff;
      }
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
      font-weight: bold;
    }
    :deep(.n-tabs-bar) {
      height: 3px;
      background-color: #0067c0;
    }
    .n-button {
      font-size: 12px;
      color: #585d64;
      background-color: #f2f2f2;
      padding: 9px 12px;
      z-index: 99;
      :deep(.n-button__state-border) {
        border: none;
      }
      :deep(.n-base-wave) {
        animation: none;
      }
    }
  }
  .bodyBox {
    height: calc(100% - 30px);
  }
}

@at-root .more {
  color: #191a1a;
  width: 130px;
  & > div {
    font-size: 12px;
    padding: 12px 0 12px 12px;
    cursor: pointer;
    border-radius: 5px;
    &:hover {
      background-color: #eef1f3;
    }
  }
}
@at-root .searchSet {
  width: 240px;
  color: #191a1a;
  font-size: 12px;
  & > div {
    @include flex(flex-start, center);
    padding: 8px 0 4px;
    cursor: pointer;
    .n-icon {
      margin-right: 12px;
    }
    &:nth-last-of-type(1) {
      color: #616365;
      cursor: default;
    }
  }
}
</style>
