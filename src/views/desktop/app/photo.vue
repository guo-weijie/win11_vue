<template>
  <AppWindow title="照片" bgColor="#e6e6e6">
    <n-tabs type="line" v-model:value="photoType" @update:value="typeChange" :bar-width="16" :tabs-padding="16">
      <n-tab v-for="item in typeList" :key="item.value" :name="item.value">{{ item.label }}</n-tab>
    </n-tabs>
    <div class="changeSize">
      <n-space>
        <n-button :bordered="false" size="small" :type="btnType.btn1" @click="changeType('btn1')">
          <template #icon>
            <n-icon>
              <Square16Regular />
            </n-icon>
          </template>
        </n-button>
        <n-button :bordered="false" size="small" :type="btnType.btn2" @click="changeType('btn2')">
          <template #icon>
            <n-icon>
              <BorderAll24Regular />
            </n-icon>
          </template>
        </n-button>
        <n-button :bordered="false" size="small" :type="btnType.btn3" @click="changeType('btn3')">
          <template #icon>
            <n-icon>
              <Table28Regular />
            </n-icon>
          </template>
        </n-button>
      </n-space>
    </div>
    <div class="photoListBox" ref="photoListBox">
      <n-image-group>
        <n-space ref="scrollEle">
          <n-image v-for="item in imgList.list" :key="item.create_time" lazy :height="imgHeight" :src="item.imgurl">
            <template #placeholder>
              <div style="width: 300px; height: 300px; line-height: 300px">努力加载中……</div>
            </template>
          </n-image>
          <n-back-top :right="75" :bottom="75" />
          <div class="loadingMore">
            <n-spin size="large" v-show="show" />
          </div>
        </n-space>
      </n-image-group>
    </div>
  </AppWindow>
</template>

<script lang="ts" setup>
import { ref, reactive, type Ref, onMounted } from "vue";
import AppWindow from "@/components/appWindow/index.vue";
import { NTabs, NTab, NImageGroup, NSpace, NImage, NIcon, NButton, NBackTop, NSpin, type ButtonType } from "naive-ui";
import { Square16Regular, BorderAll24Regular, Table28Regular } from "@vicons/fluent";

interface PhotoItem {
  create_time: string | number;
  imgurl: string;
}

const typeList = [
  { label: "美女模特", value: "6" },
  { label: "爱情美图", value: "30" },
  { label: "风景大片", value: "9" },
  { label: "小清新", value: "15" },
  { label: "动漫卡通", value: "26" },
  { label: "明星风尚", value: "11" },
  { label: "萌宠动物", value: "14" },
  { label: "游戏壁纸", value: "5" },
  { label: "汽车天下", value: "12" },
  { label: "炫酷时尚", value: "10" },
  { label: "月历壁纸", value: "29" },
  { label: "影视剧照", value: "7" },
  { label: "节日美图", value: "13" },
  { label: "军事天地", value: "22" },
  { label: "劲爆体育", value: "16" },
  { label: "BABY秀", value: "18" },
  { label: "文字控", value: "35" },
  { label: "4K专区", value: "36" },
];
const typeChange = (): void => {
  photoListBox.value.scrollTop = 0;
  show.value = false;
  start = 1;
  getPhotosData();
};
const photoType = ref("6");

// 无限加载
const scrollEle = ref();
const photoListBox = ref();
const show = ref(false);
let photoListBoxHeight: number;
let scrollEleHeight: number;
onMounted(() => {
  photoListBoxHeight = photoListBox.value.clientHeight;
  photoListBox.value.addEventListener("scroll", function () {
    if (show.value) return;
    scrollEleHeight = scrollEle.value.$el.clientHeight;
    const scrollHeight = photoListBox.value.scrollTop;
    if (scrollEleHeight - photoListBoxHeight - scrollHeight < 200) {
      show.value = true;
      start += 1;
      getPhotosData();
    }
  });
});

const btnType = reactive<{
  btn1: ButtonType;
  btn2: ButtonType;
  btn3: ButtonType;
}>({
  btn1: "default",
  btn2: "primary",
  btn3: "default",
});
const changeType = (value: string) => {
  for (const key in btnType) {
    if (key === value) {
      btnType[key as keyof typeof btnType] = "primary";
    } else {
      btnType[key as keyof typeof btnType] = "default";
    }
  }
  if (value === "btn1") {
    imgHeight.value = 512;
  } else if (value === "btn2") {
    imgHeight.value = 256;
  } else {
    imgHeight.value = 128;
  }
};

const imgList = reactive<{
  list: PhotoItem[];
}>({
  list: [],
});

let start = 1;

const imgHeight: Ref<number> = ref(256);

// 获取图片
const getPhotosData = () => {
  // 获取图片
};

getPhotosData();
</script>

<style lang="scss" scoped>
.changeSize {
  padding: 10px 150px 10px 0;

  :deep(.n-space) {
    justify-content: flex-end !important;

    & > div {
      margin-right: 0 !important;
    }
  }
}

.photoListBox {
  height: calc(100% - 127px);
  padding: 0 110px;
  text-align: center;
  overflow: auto;

  :deep(.n-space) {
    & > div:nth-last-child(1) {
      flex-basis: 100%;
      height: 40px;
      overflow: hidden;
    }
  }
}

.n-tabs {
  background-color: #e6e6e6;
}

:deep(.n-tabs-tab) {
  padding-bottom: 5px;
}
</style>
