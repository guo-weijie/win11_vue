<template>
  <AppWindow title="画图">
    <div class="paint-app">
      <!-- 顶部工具栏 -->
      <header class="paint-header">
        <!-- 绘画工具 -->
        <div class="paint-tools">
          <button
            v-for="tool in tools"
            :key="tool.id"
            class="paint-tool-btn"
            :class="{ active: currentTool === tool.id }"
            :aria-label="tool.name"
            @click="setTool(tool.id)"
          >
            <span class="paint-tool-icon">{{ tool.icon }}</span>
            <span class="paint-tool-name">{{ tool.name }}</span>
          </button>
        </div>
        <!-- 操作按钮 -->
        <div class="paint-actions">
          <button class="paint-action-btn" aria-label="撤销" @click="undo">
            <svg viewBox="0 0 24 24" width="20" height="20"><path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z" fill="currentColor"/></svg>
          </button>
          <button class="paint-action-btn" aria-label="清空" @click="clearCanvas">
            <svg viewBox="0 0 24 24" width="20" height="20"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/></svg>
          </button>
          <button class="paint-action-btn" aria-label="保存" @click="saveCanvas">
            <svg viewBox="0 0 24 24" width="20" height="20"><path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2v9.67z" fill="currentColor"/></svg>
          </button>
        </div>
      </header>

      <!-- 画布区域 -->
      <main class="paint-canvas-wrap" ref="canvasWrapRef">
        <canvas
          ref="canvasRef"
          class="paint-canvas"
          :width="canvasWidth"
          :height="canvasHeight"
          @mousedown="startDrawing"
          @mousemove="draw"
          @mouseup="stopDrawing"
          @mouseleave="stopDrawing"
          @touchstart.prevent="startDrawingTouch"
          @touchmove.prevent="drawTouch"
          @touchend="stopDrawing"
          @touchcancel="stopDrawing"
        ></canvas>
      </main>

      <!-- 底部控制栏 -->
      <footer class="paint-footer">
        <!-- 颜色选择 -->
        <div class="paint-colors">
          <button
            v-for="color in presetColors"
            :key="color"
            class="paint-color-dot"
            :class="{ active: currentColor === color }"
            :style="{ backgroundColor: color }"
            :aria-label="'颜色 ' + color"
            @click="setColor(color)"
          ></button>
          <label class="paint-custom-color-label" aria-label="自定义颜色" :style="{ backgroundColor: currentColor }">
            <span class="paint-custom-plus">+</span>
            <input
              type="color"
              :value="currentColor"
              class="paint-custom-color-input"
              @input="setColor(($event.target as HTMLInputElement).value)"
            />
          </label>
        </div>
        <!-- 粗细 -->
        <div class="paint-size">
          <svg viewBox="0 0 24 24" width="16" height="16" class="paint-size-icon"><circle cx="12" cy="12" r="2" fill="currentColor"/></svg>
          <input
            type="range"
            :value="currentSize"
            min="1"
            max="40"
            class="paint-size-slider"
            @input="currentSize = parseInt(($event.target as HTMLInputElement).value)"
          />
          <svg viewBox="0 0 24 24" width="22" height="22" class="paint-size-icon"><circle cx="12" cy="12" r="6" fill="currentColor"/></svg>
          <span class="paint-size-value">{{ currentSize }}</span>
        </div>
      </footer>
    </div>
  </AppWindow>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import AppWindow from "@/components/appWindow/index.vue";

// ============ 画图状态 ============
const canvasRef = ref<HTMLCanvasElement | null>(null);
const canvasWrapRef = ref<HTMLDivElement | null>(null);
const canvasWidth = ref(1200);
const canvasHeight = ref(700);
const currentTool = ref("pencil");
const currentColor = ref("#000000");
const currentSize = ref(3);
const isDrawing = ref(false);
const startX = ref(0);
const startY = ref(0);
const coordinates = ref({ x: 0, y: 0 });
const undoStack = ref<string[]>([]);
const maxUndoSteps = 20;

let ctx: CanvasRenderingContext2D | null = null;
let snapshot: ImageData | null = null;

// ============ 工具配置 ============
const tools = [
  { id: "pencil",   name: "铅笔",   icon: "✏️" },
  { id: "brush",    name: "画笔",   icon: "🖌️" },
  { id: "eraser",   name: "橡皮",   icon: "🧹" },
  { id: "line",     name: "直线",   icon: "📏" },
  { id: "rectangle",name: "矩形",   icon: "⬜" },
  { id: "circle",   name: "圆形",   icon: "⭕" },
];

const presetColors = [
  "#000000", "#ff0000", "#00ff00", "#0000ff",
  "#ffff00", "#ff00ff", "#00ffff", "#ffffff",
];

// ============ 画布自适应 ============
let resizeTimer: ReturnType<typeof setTimeout> | null = null;

function fitCanvas() {
  if (!canvasWrapRef.value || !canvasRef.value) return;
  const wrap = canvasWrapRef.value;
  const rect = wrap.getBoundingClientRect();
  const w = Math.floor(rect.width);
  const h = Math.floor(rect.height);

  if (w <= 0 || h <= 0) return;
  if (w === canvasWidth.value && h === canvasHeight.value) return;

  // 保存当前内容
  const dataUrl = canvasRef.value.toDataURL();

  // 改变画布尺寸（会清空画布）
  canvasWidth.value = w;
  canvasHeight.value = h;

  // 恢复内容
  nextTick(() => {
    if (!ctx) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);
    const img = new Image();
    img.src = dataUrl;
    img.onload = () => {
      if (ctx && canvasRef.value) {
        ctx.drawImage(img, 0, 0);
      }
    };
  });
}

function onResize() {
  if (resizeTimer) clearTimeout(resizeTimer);
  resizeTimer = setTimeout(fitCanvas, 200);
}

// ============ 状态管理 ============
function saveState() {
  if (!canvasRef.value) return;
  if (undoStack.value.length >= maxUndoSteps) {
    undoStack.value.shift();
  }
  undoStack.value.push(canvasRef.value.toDataURL());
}

function undo() {
  if (undoStack.value.length === 0 || !canvasRef.value || !ctx) return;
  const lastState = undoStack.value.pop()!;
  const img = new Image();
  img.src = lastState;
  img.onload = () => {
    if (!ctx || !canvasRef.value) return;
    ctx.clearRect(0, 0, canvasWidth.value, canvasHeight.value);
    ctx.drawImage(img, 0, 0);
  };
}

function setTool(tool: string) {
  currentTool.value = tool;
}

function setColor(color: string) {
  currentColor.value = color;
}

// ============ 坐标计算 ============
function getCanvasPos(clientX: number, clientY: number) {
  if (!canvasRef.value) return { x: 0, y: 0 };
  const rect = canvasRef.value.getBoundingClientRect();
  return {
    x: clientX - rect.left,
    y: clientY - rect.top,
  };
}

// ============ 鼠标绘制 ============
function startDrawing(e: MouseEvent) {
  if (!ctx || e.button !== 0) return;
  isDrawing.value = true;
  const pos = getCanvasPos(e.clientX, e.clientY);
  startX.value = pos.x;
  startY.value = pos.y;

  beginPath(pos.x, pos.y);
  saveState();
}

function draw(e: MouseEvent) {
  if (!ctx || !isDrawing.value) return;
  const pos = getCanvasPos(e.clientX, e.clientY);
  drawToPos(pos.x, pos.y);
}

function stopDrawing() {
  if (isDrawing.value && ctx) {
    isDrawing.value = false;
    ctx.closePath();
  }
}

// ============ 触摸绘制 ============
function startDrawingTouch(e: TouchEvent) {
  if (!ctx || !e.touches.length) return;
  isDrawing.value = true;
  const pos = getCanvasPos(e.touches[0].clientX, e.touches[0].clientY);
  startX.value = pos.x;
  startY.value = pos.y;

  beginPath(pos.x, pos.y);
  saveState();
}

function drawTouch(e: TouchEvent) {
  if (!ctx || !e.touches.length || !isDrawing.value) return;
  const pos = getCanvasPos(e.touches[0].clientX, e.touches[0].clientY);
  drawToPos(pos.x, pos.y);
}

// ============ 核心绘制逻辑 ============
function beginPath(x: number, y: number) {
  if (!ctx) return;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.strokeStyle = currentTool.value === "eraser" ? "#ffffff" : currentColor.value;
  ctx.lineWidth = currentSize.value;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  if (currentTool.value !== "pencil" && currentTool.value !== "brush" && currentTool.value !== "eraser") {
    snapshot = ctx.getImageData(0, 0, canvasWidth.value, canvasHeight.value);
  }
}

function drawToPos(x: number, y: number) {
  if (!ctx) return;
  coordinates.value = { x: Math.round(x), y: Math.round(y) };

  if (currentTool.value === "pencil" || currentTool.value === "brush" || currentTool.value === "eraser") {
    ctx.lineTo(x, y);
    ctx.stroke();
    return;
  }

  // 形状工具：先恢复快照，再画形状
  if (snapshot) ctx.putImageData(snapshot, 0, 0);
  ctx.beginPath();
  ctx.strokeStyle = currentColor.value;
  ctx.lineWidth = currentSize.value;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  switch (currentTool.value) {
    case "line":
      ctx.moveTo(startX.value, startY.value);
      ctx.lineTo(x, y);
      break;
    case "rectangle":
      ctx.strokeRect(startX.value, startY.value, x - startX.value, y - startY.value);
      return;
    case "circle": {
      const rx = x - startX.value;
      const ry = y - startY.value;
      const r = Math.sqrt(rx * rx + ry * ry);
      ctx.arc(startX.value, startY.value, r, 0, Math.PI * 2);
      break;
    }
  }
  ctx.stroke();
}

// ============ 操作 ============
function clearCanvas() {
  if (!ctx || !canvasRef.value) return;
  saveState();
  ctx.clearRect(0, 0, canvasWidth.value, canvasHeight.value);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvasWidth.value, canvasHeight.value);
}

function saveCanvas() {
  if (!canvasRef.value) return;
  const link = document.createElement("a");
  link.download = "drawing.png";
  link.href = canvasRef.value.toDataURL();
  link.click();
}

// ============ 键盘快捷键 ============
function handleKeydown(e: KeyboardEvent) {
  if ((e.ctrlKey || e.metaKey) && e.key === "z") {
    e.preventDefault();
    undo();
  }
}

// ============ 生命周期 ============
onMounted(() => {
  ctx = canvasRef.value!.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvasWidth.value, canvasHeight.value);
  }
  document.addEventListener("keydown", handleKeydown);
  window.addEventListener("resize", onResize);
  nextTick(fitCanvas);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeydown);
  window.removeEventListener("resize", onResize);
  if (resizeTimer) clearTimeout(resizeTimer);
});
</script>

<style lang="scss" scoped>
@use "@/style/responsive" as *;

// ==========================================
// 画图应用 — 移动优先三段式布局
// ==========================================
.paint-app {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #e8e8e8;
  user-select: none;
  -webkit-user-select: none;
}

// ========== 顶部工具栏 ==========
.paint-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 6px;
  background: #f5f5f5;
  border-bottom: 1px solid #d0d0d0;
  flex-shrink: 0;
  gap: 6px;
}

.paint-tools {
  display: flex;
  gap: 2px;
  flex-shrink: 1;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }
}

.paint-tool-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1px;
  min-width: 48px;
  height: 48px;
  padding: 4px 6px;
  border: 2px solid transparent;
  border-radius: 6px;
  background: transparent;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.12s;

  .paint-tool-icon {
    font-size: 20px;
    line-height: 1;
  }

  .paint-tool-name {
    font-size: 10px;
    color: #666;
    line-height: 1;
  }

  &:active {
    background: #e0e0e0;
  }

  &.active {
    background: #d0e4f7;
    border-color: #4a90d9;

    .paint-tool-name {
      color: #4a90d9;
      font-weight: 600;
    }
  }
}

.paint-actions {
  display: flex;
  gap: 2px;
  flex-shrink: 0;
}

.paint-action-btn {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: #fff;
  color: #444;
  cursor: pointer;
  flex-shrink: 0;

  &:active {
    background: #e0e0e0;
  }
}

// ========== 画布区域 ==========
.paint-canvas-wrap {
  flex: 1;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #c8c8c8;
  // 格子背景
  background-image:
    linear-gradient(45deg, #d0d0d0 25%, transparent 25%),
    linear-gradient(-45deg, #d0d0d0 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #d0d0d0 75%),
    linear-gradient(-45deg, transparent 75%, #d0d0d0 75%);
  background-size: 16px 16px;
  background-position: 0 0, 0 8px, 8px -8px, -8px 0;
}

.paint-canvas {
  display: block;
  background: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
  cursor: crosshair;
  touch-action: none;
}

// ========== 底部控制栏 ==========
.paint-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 8px;
  background: #f5f5f5;
  border-top: 1px solid #d0d0d0;
  flex-shrink: 0;
  gap: 8px;
  overflow: hidden;
}

// 颜色选择
.paint-colors {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 1;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }
}

.paint-color-dot {
  width: 32px;
  height: 32px;
  min-width: 32px;
  border: 2px solid #bbb;
  border-radius: 50%;
  cursor: pointer;
  flex-shrink: 0;
  transition: transform 0.1s;

  &:active {
    transform: scale(0.88);
  }

  &.active {
    border-color: #333;
    border-width: 3px;
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.15);
  }
}

.paint-custom-color-label {
  position: relative;
  width: 32px;
  height: 32px;
  min-width: 32px;
  border: 2px dashed #bbb;
  border-radius: 50%;
  cursor: pointer;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  .paint-custom-plus {
    font-size: 16px;
    color: #888;
    pointer-events: none;
    line-height: 1;
  }
}

.paint-custom-color-input {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

// 粗细
.paint-size {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;

  .paint-size-icon {
    color: #666;
    flex-shrink: 0;
  }
}

.paint-size-slider {
  width: 80px;
  height: 4px;
  accent-color: #4a90d9;
  cursor: pointer;
}

.paint-size-value {
  font-size: 12px;
  color: #666;
  min-width: 20px;
  text-align: right;
  font-variant-numeric: tabular-nums;
}

// ==========================================
// 桌面端适配
// ==========================================
@include desktop {
  .paint-app {
    background: #f0f0f0;
  }

  .paint-header {
    padding: 6px 10px;
    gap: 12px;
  }

  .paint-tools {
    gap: 4px;
    overflow-x: visible;
  }

  .paint-tool-btn {
    min-width: 56px;
    height: 52px;
    padding: 4px 8px;

    .paint-tool-icon {
      font-size: 22px;
    }

    .paint-tool-name {
      font-size: 11px;
    }
  }

  .paint-action-btn {
    width: 40px;
    height: 40px;
  }

  .paint-footer {
    padding: 8px 12px;
  }

  .paint-colors {
    gap: 6px;
    overflow-x: visible;
  }

  .paint-color-dot {
    width: 28px;
    height: 28px;
    min-width: 28px;

    &:hover {
      transform: scale(1.15);
    }
  }

  .paint-custom-color-label {
    width: 28px;
    height: 28px;
    min-width: 28px;
  }

  .paint-size-slider {
    width: 100px;
  }
}
</style>
