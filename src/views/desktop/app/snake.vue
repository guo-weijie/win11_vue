<template>
  <AppWindow ref="appWindow" title="贪吃蛇">
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
  </AppWindow>
</template>

<script lang="ts" setup>
import AppWindow from "@/components/appWindow/index.vue";
import { onMounted, reactive, ref, onUnmounted, nextTick } from "vue";
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
const INITIAL_SPEED = 1000;
const MIN_SPEED = 200;
const SPEED_DECREMENT = 2;
const SCORE_PER_APPLE = 5;

const WINDOW_SIZE_THRESHOLDS = {
  TINY: 360,
  SMALL: 500,
  LARGE: 1000,
};

const GRID_SIZES = {
  TINY: 16,
  SMALL: 20,
  MEDIUM: 25,
  LARGE: 30,
};

const KEY_DIRECTION_MAP: KeyMap = {
  ArrowDown: "bottom",
  ArrowUp: "top",
  ArrowRight: "right",
  ArrowLeft: "left",
};

const VALID_KEYS = Object.keys(KEY_DIRECTION_MAP);

// ============ 响应式状态 ============
// AppWindow 实例引用（用于访问 windowRef）
const appWindow = ref<InstanceType<typeof AppWindow> | null>(null);

// 游戏容器引用
const gameBody = ref<HTMLElement | null>(null);

// 游戏状态
const isGameRunning = ref(true);
const hasBorder = ref(false);
const showBorderOption = ref(true);

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

// 方格列表
const blockList = reactive({
  blocks: [] as number[],
});

// ============ 游戏逻辑函数 ============
const canChangeDirection = (newDirection: Direction): boolean => {
  const opposites: Record<Direction, Direction[]> = {
    left: ["left", "right"],
    right: ["left", "right"],
    top: ["top", "bottom"],
    bottom: ["top", "bottom"],
  };
  return !opposites[newDirection].includes(snake.direction);
};

const getSnakeBodySet = (): Set<number> => {
  return new Set(snake.body);
};

const showGameOver = (message: string) => {
  modalContent.value = message;
  showModal.value = true;
  showBorderOption.value = true;
};

const checkWallCollision = (position: number): boolean => {
  if (position < 0) return hasBorder.value;
  if (position >= gridConfig.total) return hasBorder.value;

  const currentCol = snake.body[snake.body.length - 1] % gridConfig.columns;
  const newCol = position % gridConfig.columns;

  if (snake.direction === "right" && currentCol > newCol) return hasBorder.value;
  if (snake.direction === "left" && currentCol < newCol) return hasBorder.value;

  return false;
};

const handleWrapAround = (position: number): number => {
  let newPos = position;

  if (newPos < 0) {
    newPos = gridConfig.columns - 1;
  } else if (newPos >= gridConfig.total) {
    newPos = newPos - gridConfig.total;
  } else {
    const currentCol = snake.body[snake.body.length - 1] % gridConfig.columns;
    const newCol = newPos % gridConfig.columns;

    if (snake.direction === "right" && currentCol > newCol) {
      newPos = newPos - gridConfig.columns;
    } else if (snake.direction === "left" && currentCol < newCol) {
      newPos = newPos + gridConfig.columns;
    }
  }

  return newPos;
};

const checkSelfCollision = (position: number): boolean => {
  const bodySet = getSnakeBodySet();
  return bodySet.has(position);
};

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

const moveSnake = () => {
  const nextPosition = calculateNextPosition();

  if (checkWallCollision(nextPosition)) {
    showGameOver(`游戏结束，分数：${snake.length - 1}`);
    resetGame();
    return;
  }

  const finalPosition = hasBorder.value ? nextPosition : handleWrapAround(nextPosition);

  if (checkSelfCollision(finalPosition)) {
    showGameOver(`游戏结束，分数：${snake.length - 1}`);
    resetGame();
    return;
  }

  if (snake.body.length >= gridConfig.total) {
    showGameOver(`恭喜通关，分数：${snake.length - 1}`);
    resetGame();
    return;
  }

  snake.body.push(finalPosition);

  if (applePosition.value !== undefined && finalPosition === applePosition.value) {
    snake.length++;
    applePosition.value = undefined;

    if (gameSpeed.value >= MIN_SPEED && snake.length % SCORE_PER_APPLE === 1) {
      const level = Math.floor((snake.length - 1) / SCORE_PER_APPLE);
      gameSpeed.value = Math.max(MIN_SPEED, INITIAL_SPEED - level * SPEED_DECREMENT * SCORE_PER_APPLE);
      restartGameTimer();
    }

    generateApple();
  } else {
    snake.body.shift();
  }
};

const generateApple = () => {
  const bodySet = getSnakeBodySet();
  let attempts = 0;
  const maxAttempts = gridConfig.total * 2;

  while (attempts < maxAttempts) {
    const position = Math.floor(Math.random() * gridConfig.total);
    if (!bodySet.has(position)) {
      applePosition.value = position;
      return;
    }
    attempts++;
  }

  showGameOver(`恭喜通关，分数：${snake.length - 1}`);
};

const createGrid = () => {
  if (!gameBody.value) return;

  const width = gameBody.value.clientWidth;
  const height = gameBody.value.clientHeight;

  if (width === 0 || height === 0) return;

  if (width < WINDOW_SIZE_THRESHOLDS.TINY) {
    gridConfig.size = GRID_SIZES.TINY;
  } else if (width < WINDOW_SIZE_THRESHOLDS.SMALL) {
    gridConfig.size = GRID_SIZES.SMALL;
  } else if (width > WINDOW_SIZE_THRESHOLDS.LARGE) {
    gridConfig.size = GRID_SIZES.LARGE;
  } else {
    gridConfig.size = GRID_SIZES.MEDIUM;
  }

  gridConfig.columns = Math.floor(width / gridConfig.size);
  gridConfig.rows = Math.floor(height / gridConfig.size);
  gridConfig.total = gridConfig.columns * gridConfig.rows;

  blockList.blocks = Array.from({ length: gridConfig.total }, (_, i) => i);
};

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

const changePosition = (position: string) => {
  handleKeyPress(position);
};

const restartGameTimer = () => {
  if (!isGameRunning.value) {
    clearInterval(gameTimer);
    gameTimer = setInterval(moveSnake, gameSpeed.value);
  }
};

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

const initGame = () => {
  resetGame();
};

// ============ 生命周期钩子 ============
const resizeObserver = new ResizeObserver(() => {
  nextTick(() => {
    initGame();
  });
});

onMounted(() => {
  createGrid();
  generateApple();

  // 通过 AppWindow 暴露的 windowRef 监听窗口大小变化
  if (appWindow.value?.windowRef) {
    resizeObserver.observe(appWindow.value.windowRef);
  }

  document.addEventListener("keydown", handleKeyPress);
});

onUnmounted(() => {
  clearInterval(gameTimer);
  resizeObserver.disconnect();
  document.removeEventListener("keydown", handleKeyPress);
});
</script>

<style lang="scss" scoped>
@use "@/style/public" as *;
@use "@/style/responsive" as *;

// ==================== 基础布局 ====================
.game {
  display: grid;
  overflow: hidden;
  height: 100%;
}

// 桌面端 / 平板：侧栏布局
@include desktop {
  .game {
    grid-template-columns: 7.5fr 2.5fr;
  }
}
@include tablet {
  .game {
    // 平板给操作区稍多空间
    grid-template-columns: 7fr 3fr;
  }
}
// 移动端：上下堆叠
@include mobile {
  .game {
    grid-template-columns: 1fr;
    grid-template-rows: 55fr 45fr;
  }
}

// ==================== 游戏区域 ====================
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

// ==================== 操作面板 ====================
.gameOpe {
  background-color: #fff;
  @include flex(center, center, column);

  // 移动端操作面板紧凑化
  @include mobile {
    justify-content: flex-start;
    padding: 10px 0;
    gap: 8px;
  }

  .fraction {
    font-size: 20px;
    margin-bottom: 40px;

    span {
      font-weight: bold;
    }

    @include mobile {
      font-size: 16px;
      margin-bottom: 0;
    }
  }

  .n-switch {
    margin-bottom: 40px;

    @include mobile {
      margin-bottom: 0;
    }
  }

  // ========== 虚拟方向键 ==========
  .keyBoardTips {
    box-sizing: border-box;
    width: 240px;
    height: 240px;
    padding: 10px;
    @include grid(3, 3);
    align-content: center;

    @include tablet {
      width: 200px;
      height: 200px;
    }

    @include mobile {
      // 移动端按短边缩放，控制在 180px ~ 240px
      width: clamp(160px, 50vmin, 220px);
      height: clamp(160px, 50vmin, 220px);
      padding: 6px;
    }

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
        // 移动端最小触摸面积 44px
        min-width: 44px;
        min-height: 44px;

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

  // ========== 游戏控制按钮 ==========
  .gameStatus {
    margin-bottom: 40px;

    @include mobile {
      margin-bottom: 0;
      display: flex;
      flex-direction: row;
      gap: 12px;
    }

    .n-button {
      font-size: 50px !important;
      margin-right: 20px;

      @include tablet {
        font-size: 40px !important;
        margin-right: 14px;
      }

      @include mobile {
        font-size: 32px !important;
        margin-right: 0;
      }
    }
  }
}
</style>
