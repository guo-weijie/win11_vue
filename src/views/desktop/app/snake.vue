<template>
  <div class="appContainer" ref="windowRef" v-show="!isHidden" @click.stop="bringToFront">
    <TitleBlock title="贪吃蛇"></TitleBlock>
    <div class="appBody game">
      <div class="gameBody" ref="gameBody">
        <div
          v-for="item in blockList.blocks"
          :key="item as number"
          :id="'s' + (item as number)"
          :style="{ width: gridConfig.size + 'px', height: gridConfig.size + 'px' }"
          :class="{
            snakeBody: snake.body.includes(item as number),
            appleBlock: applePosition === item,
          }"
        ></div>
      </div>
      <div class="gameOpe">
        <!-- 分数 -->
        <div class="fraction">
          分数：<span>{{ snake.length - 1 }}</span>
        </div>
        <n-switch v-model:value="hasBorder" v-show="showBorderOption">
          <template #checked> 有边界 </template>
          <template #unchecked> 无边界 </template>
        </n-switch>
        <!-- 开始、结束、重置 -->
        <div class="gameStatus">
          <n-button v-show="isGameRunning" text style="font-size: 24px" @click="toggleGame(true)">
            <n-icon text="开始游戏">
              <Play16Regular />
            </n-icon>
          </n-button>
          <n-button v-show="!isGameRunning" text style="font-size: 24px" @click="toggleGame(false)">
            <n-icon text="暂停游戏">
              <Pause16Regular />
            </n-icon>
          </n-button>
          <n-button text style="font-size: 24px" @click="initGame">
            <n-icon text="重置游戏">
              <ArrowReset20Regular />
            </n-icon>
          </n-button>
        </div>
        <div class="keyBoardTips">
          <div></div>
          <div @click="changePosition('top')">
            <n-icon size="40" color="#0e7a0d">
              <ChevronUp16Regular />
            </n-icon>
          </div>
          <div></div>
          <div @click="changePosition('left')">
            <n-icon size="40" color="#0e7a0d">
              <ChevronLeft16Regular />
            </n-icon>
          </div>
          <div></div>
          <div @click="changePosition('right')">
            <n-icon size="40" color="#0e7a0d">
              <ChevronRight16Regular />
            </n-icon>
          </div>
          <div></div>
          <div @click="changePosition('bottom')">
            <n-icon size="40" color="#0e7a0d">
              <ChevronDown16Regular />
            </n-icon>
          </div>
          <div></div>
        </div>
      </div>
    </div>
    <n-modal
      v-model:show="showModal"
      :mask-closable="false"
      preset="dialog"
      title="提示"
      :content="modalContent"
      positive-text="确定"
      @positive-click="showModal = false"
    />
  </div>
</template>

<script lang="ts" setup>
import TitleBlock from "@/components/titleBlock";
import { onMounted, reactive, ref, onUnmounted, nextTick } from "vue";
import { useWindow } from "@/composables/useWindow";
import { NSwitch, NIcon, NButton, NModal } from "naive-ui";
import {
  ChevronLeft16Regular,
  ChevronRight16Regular,
  ChevronDown16Regular,
  ChevronUp16Regular,
  Play16Regular,
  Pause16Regular,
  ArrowReset20Regular,
} from "@vicons/fluent";

// ============ 类型定义 ============
type Direction = "left" | "right" | "top" | "bottom";
type KeyMap = Record<string, Direction>;

interface GridConfig {
  size: number;
  columns: number;
  rows: number;
  total: number;
}

interface SnakeState {
  body: number[];
  direction: Direction;
  length: number;
}

// ============ 常量定义 ============
const INITIAL_SPEED = 1000; // 初始速度（毫秒）
const MIN_SPEED = 200; // 最小速度
const SPEED_DECREMENT = 2; // 每5分减少的毫秒数
const SCORE_PER_APPLE = 5; // 每次加速的分数间隔

const WINDOW_SIZE_THRESHOLDS = {
  SMALL: 500,
  LARGE: 1000,
};

const GRID_SIZES = {
  SMALL: 20,
  MEDIUM: 25,
  LARGE: 30,
};

// 方向按键映射
const KEY_DIRECTION_MAP: KeyMap = {
  ArrowDown: "bottom",
  ArrowUp: "top",
  ArrowRight: "right",
  ArrowLeft: "left",
};

const VALID_KEYS = Object.keys(KEY_DIRECTION_MAP);

// ============ 响应式状态 ============
// 窗口管理 composable
const { windowRef, bringToFront, isHidden } = useWindow("贪吃蛇");

// 游戏容器引用
const gameBody = ref<HTMLElement | null>(null);

// 游戏状态
const isGameRunning = ref(true); // true=未开始/已结束，false=运行中
const hasBorder = ref(false); // 是否有边界
const showBorderOption = ref(true); // 是否显示边界选项

// 蛇的状态
const snake = reactive<SnakeState>({
  body: [0],
  direction: "right",
  length: 1,
});

// 游戏配置
const gridConfig = reactive<GridConfig>({
  size: GRID_SIZES.SMALL,
  columns: 0,
  rows: 0,
  total: 0,
});

// 苹果位置
const applePosition = ref<number | undefined>(undefined);

// 游戏速度
const gameSpeed = ref(INITIAL_SPEED);

// 定时器
let gameTimer: number | undefined = undefined;

// 模态框状态
const showModal = ref(false);
const modalContent = ref("");

// 方格列表（用于渲染）
const blockList = reactive({
  blocks: [] as number[],
});

// ============ 计算属性 ============
/**
 * 判断是否可以朝某个方向移动
 */
const canChangeDirection = (newDirection: Direction): boolean => {
  const opposites: Record<Direction, Direction[]> = {
    left: ["left", "right"],
    right: ["left", "right"],
    top: ["top", "bottom"],
    bottom: ["top", "bottom"],
  };
  return !opposites[newDirection].includes(snake.direction);
};

/**
 * 获取蛇身位置的 Set（用于快速查找）
 */
const getSnakeBodySet = (): Set<number> => {
  return new Set(snake.body);
};

// ============ 游戏逻辑函数 ============

/**
 * 显示游戏结束提示
 */
const showGameOver = (message: string) => {
  modalContent.value = message;
  showModal.value = true;
  showBorderOption.value = true;
};

/**
 * 检查是否撞墙
 */
const checkWallCollision = (position: number): boolean => {
  // 左边界
  if (position < 0) {
    return hasBorder.value;
  }
  // 右边界
  if (position >= gridConfig.total) {
    return hasBorder.value;
  }
  
  const currentCol = snake.body[snake.body.length - 1] % gridConfig.columns;
  const newCol = position % gridConfig.columns;
  
  // 左右穿越检测
  if (snake.direction === "right" && currentCol > newCol) {
    return hasBorder.value;
  }
  if (snake.direction === "left" && currentCol < newCol) {
    return hasBorder.value;
  }
  
  return false;
};

/**
 * 处理边界穿越
 */
const handleWrapAround = (position: number): number => {
  let newPos = position;
  
  if (newPos < 0) {
    // 从左边界穿到右边界
    newPos = gridConfig.columns - 1;
  } else if (newPos >= gridConfig.total) {
    // 从下边界穿到上边界
    newPos = newPos - gridConfig.total;
  } else {
    const currentCol = snake.body[snake.body.length - 1] % gridConfig.columns;
    const newCol = newPos % gridConfig.columns;
    
    // 从右边界穿到左边界
    if (snake.direction === "right" && currentCol > newCol) {
      newPos = newPos - gridConfig.columns;
    }
    // 从左边界穿到右边界
    else if (snake.direction === "left" && currentCol < newCol) {
      newPos = newPos + gridConfig.columns;
    }
  }
  
  return newPos;
};

/**
 * 检查是否撞到自己
 */
const checkSelfCollision = (position: number): boolean => {
  const bodySet = getSnakeBodySet();
  return bodySet.has(position);
};

/**
 * 计算下一步位置
 */
const calculateNextPosition = (): number => {
  const head = snake.body[snake.body.length - 1];
  let step = 0;
  
  switch (snake.direction) {
    case "left":
      step = -1;
      break;
    case "right":
      step = 1;
      break;
    case "top":
      step = -gridConfig.columns;
      break;
    case "bottom":
      step = gridConfig.columns;
      break;
  }
  
  return head + step;
};

/**
 * 蛇移动一步
 */
const moveSnake = () => {
  const nextPosition = calculateNextPosition();
  
  // 检查撞墙
  if (checkWallCollision(nextPosition)) {
    showGameOver(`游戏结束，分数：${snake.length - 1}`);
    resetGame();
    return;
  }
  
  // 处理边界穿越
  const finalPosition = hasBorder.value ? nextPosition : handleWrapAround(nextPosition);
  
  // 检查撞到自己
  if (checkSelfCollision(finalPosition)) {
    showGameOver(`游戏结束，分数：${snake.length - 1}`);
    resetGame();
    return;
  }
  
  // 检查是否通关
  if (snake.body.length >= gridConfig.total) {
    showGameOver(`恭喜通关，分数：${snake.length - 1}`);
    resetGame();
    return;
  }
  
  // 移动蛇：添加新头部
  snake.body.push(finalPosition);
  
  // 检查是否吃到苹果
  if (applePosition.value !== undefined && finalPosition === applePosition.value) {
    snake.length++;
    applePosition.value = undefined;
    
    // 每5分加速一次
    if (gameSpeed.value >= MIN_SPEED && snake.length % SCORE_PER_APPLE === 1) {
      const level = Math.floor((snake.length - 1) / SCORE_PER_APPLE);
      gameSpeed.value = Math.max(MIN_SPEED, INITIAL_SPEED - level * SPEED_DECREMENT * SCORE_PER_APPLE);
      restartGameTimer();
    }
    
    generateApple();
  } else {
    // 没吃到苹果，移除尾部
    snake.body.shift();
  }
};

/**
 * 生成苹果（使用循环避免递归栈溢出）
 */
const generateApple = () => {
  const bodySet = getSnakeBodySet();
  let attempts = 0;
  const maxAttempts = gridConfig.total * 2; // 防止无限循环
  
  while (attempts < maxAttempts) {
    const position = Math.floor(Math.random() * gridConfig.total);
    if (!bodySet.has(position)) {
      applePosition.value = position;
      return;
    }
    attempts++;
  }
  
  // 如果找不到空位，说明已经填满（通关）
  showGameOver(`恭喜通关，分数：${snake.length - 1}`);
};

/**
 * 创建游戏网格
 */
const createGrid = () => {
  if (!gameBody.value) return;
  
  const width = gameBody.value.clientWidth;
  const height = gameBody.value.clientHeight;
  
  // 元素隐藏时（display: none）不重新计算网格
  if (width === 0 || height === 0) return;
  
  // 根据窗口大小调整格子尺寸
  if (width < WINDOW_SIZE_THRESHOLDS.SMALL) {
    gridConfig.size = GRID_SIZES.SMALL;
  } else if (width > WINDOW_SIZE_THRESHOLDS.LARGE) {
    gridConfig.size = GRID_SIZES.LARGE;
  } else {
    gridConfig.size = GRID_SIZES.MEDIUM;
  }
  
  // 计算行列数
  gridConfig.columns = Math.floor(width / gridConfig.size);
  gridConfig.rows = Math.floor(height / gridConfig.size);
  gridConfig.total = gridConfig.columns * gridConfig.rows;
  
  // 生成方格ID数组
  blockList.blocks = Array.from({ length: gridConfig.total }, (_, i) => i);
};

/**
 * 键盘事件处理
 */
const handleKeyPress = (event: KeyboardEvent | string) => {
  let direction: Direction;
  
  if (typeof event === "string") {
    direction = event as Direction;
  } else {
    if (!VALID_KEYS.includes(event.code)) return;
    direction = KEY_DIRECTION_MAP[event.code];
  }
  
  if (!canChangeDirection(direction)) return;
  
  snake.direction = direction;
};

/**
 * 方向按钮点击事件
 */
const changePosition = (position: string) => {
  handleKeyPress(position);
};

/**
 * 重启游戏定时器（用于速度变化时）
 */
const restartGameTimer = () => {
  if (!isGameRunning.value) {
    clearInterval(gameTimer);
    gameTimer = setInterval(moveSnake, gameSpeed.value);
  }
};

/**
 * 开始/暂停游戏
 */
const toggleGame = (shouldStart: boolean) => {
  isGameRunning.value = !shouldStart;
  
  if (shouldStart) {
    showBorderOption.value = false;
    gameTimer = setInterval(moveSnake, gameSpeed.value);
  } else {
    clearInterval(gameTimer);
    gameTimer = undefined;
  }
};

/**
 * 重置游戏
 */
const resetGame = () => {
  clearInterval(gameTimer);
  gameTimer = undefined;
  
  isGameRunning.value = true;
  snake.body = [0];
  snake.direction = "right";
  snake.length = 1;
  gameSpeed.value = INITIAL_SPEED;
  showBorderOption.value = true;
  
  createGrid();
  generateApple();
};

/**
 * 初始化/重置游戏（对外暴露）
 */
const initGame = () => {
  resetGame();
};

// ============ 生命周期钩子 ============

// ResizeObserver 监听窗口大小变化
const resizeObserver = new ResizeObserver(() => {
  nextTick(() => {
    initGame();
  });
});

onMounted(() => {
  createGrid();
  generateApple();
  
  // 监听窗口大小变化
  if (windowRef.value) {
    resizeObserver.observe(windowRef.value);
  }
  
  // 注册键盘事件
  document.addEventListener("keydown", handleKeyPress);
});

onUnmounted(() => {
  // 清理定时器
  clearInterval(gameTimer);
  
  // 移除 ResizeObserver
  resizeObserver.disconnect();
  
  // 移除键盘事件
  document.removeEventListener("keydown", handleKeyPress);
  
  // 清理 ResizeObserver
  resizeObserver.disconnect();
});
</script>

<style lang="scss" scoped>
@use "@/style/public" as *;

.game {
  display: grid;
  grid-template-columns: 7.5fr 2.5fr;
  overflow: hidden;
}

.gameBody {
  background-color: #2fd;
  width: 100%;
  height: 100%;
  overflow: hidden;

  div {
    background-color: #666;
  }

  @include flex(center, flex-start, row, wrap);
  align-content: center;

  .snakeBody {
    background-color: aliceblue;
  }

  .appleBlock {
    background-color: lightsalmon;
  }
}

.gameOpe {
  background-color: #fff;
  @include flex(center, center, column);

  .fraction {
    font-size: 20px;
    margin-bottom: 40px;

    span {
      font-weight: bold;
    }
  }

  .n-switch {
    margin-bottom: 40px;
  }

  .keyBoardTips {
    box-sizing: border-box;
    width: 240px;
    height: 240px;
    padding: 10px;
    @include grid(3, 3);
    align-content: center;

    div {
      width: 100%;
      height: 100%;
      display: grid;
      justify-content: center;
      align-content: center;

      &:nth-child(even) {
        border-radius: 50%;
        box-shadow: #ccc 0 0 10px;
        cursor: pointer;
        transition: all 200ms;

        &:active {
          background-color: #ccc;
          box-shadow: #ddd 0 0 10px;

          i {
            color: #fff;
          }
        }
      }
    }
  }

  .gameStatus {
    margin-bottom: 40px;

    .n-button {
      font-size: 50px !important;
      margin-right: 20px;
    }
  }
}
</style>
