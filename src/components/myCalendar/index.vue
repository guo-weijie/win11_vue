<template>
  <div class="myCalendar">
    <div class="calendarNow">
      <div class="nowSolar">
        <div class="solarDate" @click.stop="isCurrentTime">
          {{ flagTime.month }}月{{ flagTime.date }}日，星期{{ dayList[flagTime.day] }}
        </div>
        <n-button @click.stop="changeCalendarBoxStatus">
          <template #icon>
            <n-icon color="#3c3d3e">
              <component :is="calendarIcon" />
            </n-icon>
          </template>
        </n-button>
      </div>
      <div class="nowLunar">{{ currentLunarDate }}</div>
    </div>
    <div class="calendarListBox" ref="calendarBoxRef">
      <div class="boxHeader">
        <div
          :class="headerDateClass"
          @click.stop="changeCalendar"
        >
          {{ calendarTitle }}
        </div>
        <div>
          <n-button class="nav-button" @click.stop="getCalendar(-1)">
            <n-icon color="#81868b">
              <ArrowDropUpRound />
            </n-icon>
          </n-button>
          <n-button class="nav-button" @click.stop="getCalendar(1)">
            <n-icon color="#81868b">
              <ArrowDropDownRound />
            </n-icon>
          </n-button>
        </div>
      </div>
      <div class="boxWeek" v-show="isDayMode">
        <div>日</div>
        <div>一</div>
        <div>二</div>
        <div>三</div>
        <div>四</div>
        <div>五</div>
        <div>六</div>
      </div>
      <div
        :class="bodyContainerClass"
      >
        <div
          v-show="isDayMode"
          v-for="item in GRID_SIZE.DAY"
          :key="'day-' + item"
          :class="getDayCellClass(item)"
        >
          <span>{{ getSolarDate(item) }}</span>
          <span>{{ getLunarDate(item) }}</span>
        </div>

        <div
          v-show="isMonthMode"
          v-for="item in GRID_SIZE.MONTH"
          :key="'month-' + item"
          :class="getMonthCellClass(item)"
          @click.stop="selectMonth(item)"
        >
          {{ getMonthDisplayText(item) }}
        </div>

        <div
          v-show="isYearMode"
          v-for="item in GRID_SIZE.YEAR"
          :key="'year-' + item"
          :class="getYearCellClass(item)"
          @click.stop="selectYear(getYearByIndex(item))"
        >
          {{ getYearByIndex(item) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watchEffect, readonly, reactive, computed } from "vue";
import { KeyboardArrowDownRound, KeyboardArrowUpRound, ArrowDropDownRound, ArrowDropUpRound } from "@vicons/material";
import { NIcon, NButton } from "naive-ui";
import { startOfMonth, endOfMonth, getDay, addMonths } from "date-fns";
import calendar from "js-calendar-converter";

// 类型定义
interface LunarDateObj {
  year: number;
  month: number;
  date: number;
}

interface IntegerTenYear {
  before: number;
  after: number;
}

// 常量定义
const CALENDAR_MODE = {
  DAY: 1,
  MONTH: 2,
  YEAR: 3,
} as const;

type CalendarModeType = (typeof CALENDAR_MODE)[keyof typeof CALENDAR_MODE];

const GRID_SIZE = {
  DAY: 42,
  MONTH: 16,
  YEAR: 16,
} as const;

const MONTH_COUNT = 12;
const YEAR_BASE = 1970;
const CALENDAR_HEIGHT = {
  EXPANDED: "354px",
  COLLAPSED: "0",
} as const;

const dayList = ["日", "一", "二", "三", "四", "五", "六"];

// 状态管理
const calendarBoxStatus = ref(true);
const calendarBoxRef = ref<HTMLElement | null>(null);
const calendarFlag = ref<CalendarModeType>(CALENDAR_MODE.DAY);

// 当前日期
const current = ref(new Date());

// 固定时间（今天）
const flagTime = readonly({
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
  date: new Date().getDate(),
  day: new Date().getDay(),
});

// 日历数据
const year = ref<number>(new Date().getFullYear());
const month = ref<number>(new Date().getMonth() + 1);
const monthFirstDay = ref(0);
const monthAll = ref(0);
const lastYear = ref(0);
const lastMonth = ref(0);
const lastMonthAll = ref(0);
const currentDate = ref(0);

// 年历处理
const integerTenYear = reactive<IntegerTenYear>({
  before: YEAR_BASE,
  after: YEAR_BASE + 10,
});

// 计算属性：农历日期
const currentLunarDate = computed(() => {
  try {
    const { IMonthCn, IDayCn } = calendar.solar2lunar(flagTime.year, flagTime.month, flagTime.date);
    return `${IMonthCn}${IDayCn}`;
  } catch (error) {
    console.error("农历转换失败:", error);
    return "";
  }
});

// 计算属性：日历图标
const calendarIcon = computed(() => {
  return calendarBoxStatus.value ? KeyboardArrowDownRound : KeyboardArrowUpRound;
});

// 计算属性：日历标题
const calendarTitle = computed(() => {
  if (calendarFlag.value === CALENDAR_MODE.MONTH) {
    return `${year.value}年`;
  }
  if (calendarFlag.value === CALENDAR_MODE.DAY) {
    return `${year.value}年${month.value}月`;
  }
  return `${integerTenYear.before}-${integerTenYear.after}`;
});

// 计算属性：头部日期样式类
const headerDateClass = computed(() => ({
  headerDate: true,
  headerDateEnd: calendarFlag.value === CALENDAR_MODE.YEAR,
}));

// 计算属性：主体容器样式类
const bodyContainerClass = computed(() => ({
  boxBody: true,
  bodyDate: calendarFlag.value === CALENDAR_MODE.DAY,
  bodyMonthYear:
    calendarFlag.value === CALENDAR_MODE.MONTH || calendarFlag.value === CALENDAR_MODE.YEAR,
}));

// 计算属性：是否为日模式
const isDayMode = computed(() => calendarFlag.value === CALENDAR_MODE.DAY);

// 计算属性：是否为月模式
const isMonthMode = computed(() => calendarFlag.value === CALENDAR_MODE.MONTH);

// 计算属性：是否为年模式
const isYearMode = computed(() => calendarFlag.value === CALENDAR_MODE.YEAR);

// 获取日单元格样式类
const getDayCellClass = (item: number) => ({
  other: item <= monthFirstDay.value || item > monthAll.value + monthFirstDay.value,
  current:
    item - monthFirstDay.value === currentDate.value &&
    flagTime.year === year.value &&
    flagTime.month === month.value,
});

// 获取月单元格样式类
const getMonthCellClass = (item: number) => ({
  other: item > MONTH_COUNT,
  current: item === flagTime.month && flagTime.year === year.value,
});

// 获取年单元格样式类
const getYearCellClass = (item: number) => ({
  other: isOtherYear(item),
  current: isCurrentYear(item),
});

// 获取月份显示文本
const getMonthDisplayText = (item: number): string => {
  return item > MONTH_COUNT ? `${item - MONTH_COUNT}月` : `${item}月`;
};

// 计算属性：年历基准年份
const getYearBase = computed(() => {
  return Math.floor(year.value / 10) * 10 - ((Math.floor(year.value / 10) * 10 - YEAR_BASE) % 4);
});

// 切换日历展开/收起
function changeCalendarBoxStatus() {
  calendarBoxStatus.value = !calendarBoxStatus.value;
  if (calendarBoxRef.value) {
    calendarBoxRef.value.style.height = calendarBoxStatus.value 
      ? CALENDAR_HEIGHT.EXPANDED 
      : CALENDAR_HEIGHT.COLLAPSED;
  }
}

// 切换日历模式
const changeCalendar = () => {
  if (calendarFlag.value === CALENDAR_MODE.YEAR) return;
  calendarFlag.value += 1;
};

// 选择年份
const selectYear = (val: number) => {
  year.value = val;
  try {
    current.value.setFullYear(val);
    // 确保日期有效，防止31日切换到小月份时出错
    const maxDay = endOfMonth(current.value).getDate();
    if (current.value.getDate() > maxDay) {
      current.value.setDate(maxDay);
    }
  } catch (error) {
    console.error("设置年份失败:", error);
  }
  calendarFlag.value -= 1;
};

// 选择月份
const selectMonth = (val: number) => {
  try {
    current.value = addMonths(current.value, val - month.value);
    // 确保日期有效
    const maxDay = endOfMonth(current.value).getDate();
    if (current.value.getDate() > maxDay) {
      current.value.setDate(maxDay);
    }
  } catch (error) {
    console.error("设置月份失败:", error);
  }
  calendarFlag.value -= 1;
};

// 监听当前日期变化
watchEffect(() => {
  year.value = current.value.getFullYear();
  month.value = current.value.getMonth() + 1;
  monthFirstDay.value = getDay(startOfMonth(current.value));
  monthAll.value = endOfMonth(current.value).getDate();
  
  const lastTime = addMonths(current.value, -1);
  lastYear.value = lastTime.getFullYear();
  lastMonth.value = lastTime.getMonth() + 1;
  lastMonthAll.value = endOfMonth(lastTime).getDate();
  currentDate.value = current.value.getDate();
});

// 监听年历模式变化
watchEffect(() => {
  if (calendarFlag.value === CALENDAR_MODE.YEAR) {
    const decadeStart = Math.floor(year.value / 10) * 10;
    if (year.value % 10) {
      integerTenYear.before = decadeStart;
      integerTenYear.after = decadeStart + 10;
    } else {
      integerTenYear.before = year.value;
      integerTenYear.after = year.value + 10;
    }
  }
});

// 获取日历（上一月/下一月/上一年/下一年等）
function getCalendar(monthOffset = 0) {
  if (calendarFlag.value === CALENDAR_MODE.MONTH) {
    year.value += monthOffset;
    current.value.setFullYear(year.value);
    return;
  }
  if (calendarFlag.value === CALENDAR_MODE.YEAR) {
    year.value += monthOffset * 10;
    current.value.setFullYear(year.value);
    return;
  }
  current.value = addMonths(current.value, monthOffset);
}

// 回到当前时间
const isCurrentTime = () => {
  current.value = new Date();
  calendarFlag.value = CALENDAR_MODE.DAY;
};

// 获取阳历日期
function getSolarDate(item: number): number {
  if (item <= monthFirstDay.value) {
    return lastMonthAll.value - monthFirstDay.value + item;
  }
  if (item <= monthAll.value + monthFirstDay.value) {
    return item - monthFirstDay.value;
  }
  return item - monthFirstDay.value - monthAll.value;
}

// 获取阴历日期
function getLunarDate(item: number): string {
  const obj: LunarDateObj = {
    year: year.value,
    month: month.value,
    date: 0,
  };

  if (item <= monthFirstDay.value) {
    obj.year = lastYear.value;
    obj.month = lastMonth.value;
    obj.date = lastMonthAll.value - monthFirstDay.value + item;
  } else if (item <= monthAll.value + monthFirstDay.value) {
    obj.date = item - monthFirstDay.value;
  } else {
    if (month.value === MONTH_COUNT) {
      obj.year = year.value + 1;
      obj.month = 1;
    } else {
      obj.month = month.value + 1;
    }
    obj.date = item - monthFirstDay.value - monthAll.value;
  }

  try {
    const lunarObj = calendar.solar2lunar(obj.year, obj.month, obj.date);
    return lunarObj?.IDayCn || "";
  } catch (error) {
    console.error("农历转换失败:", error);
    return "";
  }
}

// 年历相关计算
const isOtherYear = (item: number): boolean => {
  const offset = (Math.floor(year.value / 10) * 10 - YEAR_BASE) % 4;
  return item <= offset || item > offset + MONTH_COUNT;
};

const isCurrentYear = (item: number): boolean => {
  return getYearByIndex(item) === flagTime.year;
};

const getYearByIndex = (item: number): number => {
  return getYearBase.value + item - 1;
};
</script>

<style lang="scss" scoped>
.myCalendar {
  width: 334px;
  @include box_border;
}

.calendarNow {
  box-sizing: border-box;
  width: 100%;
  height: 68px;
  font-size: 12px;
  padding: 13px 17px 15px;
  background-color: var(--calendar-top-bg-color);
  border-bottom: 1px solid var(--global-window-division-color);

  .nowSolar {
    height: 22px;
    @include flex(space-between, center);
    margin-bottom: 6px;

    .n-button {
      width: 22px;
      height: 22px;
      background-color: #f6f9fd;
      box-shadow: 0 1px 1px #ced2d4;
    }
  }

  .nowLunar {
    height: 12px;
  }
}

.calendarListBox {
  height: 354px;
  background-color: var(--calendar-main-bg-color);
  transition: height 0.3s ease;

  .boxHeader {
    box-sizing: border-box;
    padding: 20px 10px 0 16px;
    @include flex(space-between, center);
    font-size: 14px;
    font-weight: bold;

    .headerDate:active {
      color: var(--calendar-font-color);
    }

    .headerDateEnd {
      color: var(--calendar-header-end-color);
    }

    .nav-button {
      height: auto;
      font-size: 30px;
      margin-right: 15px;
    }
  }

  .boxWeek {
    height: 38px;
    font-size: 10px;
    @include grid(7, 1);

    div {
      text-align: center;
    }
  }

  .boxBody {
    div {
      display: grid;
      justify-content: center;
      align-content: center;
      text-align: center;

      &:hover {
        border-radius: 50%;
        background-color: var(--calendar-date-hover-color);
      }
    }

    .other {
      color: var(--calendar-none-now-month-color);
    }

    .current {
      color: var(--calendar-now-day-color);
      background-color: var(--global-theme-color) !important;
      border-radius: 50%;
    }
  }
}

.n-button {
  padding: 0;
}

.bodyDate {
  height: 262px;
  font-size: 10px;
  @include grid(7, 6);

  div {
    width: 100%;
    height: 100%;
  }
}

.bodyMonthYear {
  height: 300px;
  @include grid(4, 4);

  div {
    width: 80%;
    height: 80%;
  }
}
</style>
