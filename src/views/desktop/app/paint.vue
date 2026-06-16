<template>
  <AppWindow title="画图">
    <!-- 工具栏 -->
    <div class="toolbar">
      <div class="tool-group">
        <button
          v-for="tool in tools"
          :key="tool.id"
          class="tool-btn"
          :class="{ active: currentTool === tool.id }"
          :title="tool.name"
          @click="setTool(tool.id)"
        >
          {{ tool.icon }}
        </button>
      </div>

      <div class="tool-group color-picker">
        <div
          v-for="color in presetColors"
          :key="color"
          class="color-btn"
          :class="{ active: currentColor === color }"
          :style="{ backgroundColor: color }"
          @click="setColor(color)"
        ></div>
        <input
          type="color"
          :value="currentColor"
          @input="setColor(($event.target as HTMLInputElement).value)"
          title="自定义颜色"
        />
      </div>

      <div class="tool-group size-slider">
        <label>粗细:</label>
        <input
          type="range"
          :value="currentSize"
          min="1"
          max="50"
          @input="currentSize = parseInt(($event.target as HTMLInputElement).value)"
        />
        <span>{{ currentSize }}</span>
      </div>

      <div class="tool-group">
        <button class="action-btn" @click="undo">↩ 撤销</button>
        <button class="action-btn" @click="clearCanvas">🗑 清空</button>
        <button class="action-btn" @click="saveCanvas">💾 保存</button>
      </div>
    </div>

    <!-- 画布 -->
    <div class="canvas-container">
      <canvas
        ref="canvasRef"
        :width="canvasWidth"
        :height="canvasHeight"
        @mousedown="startDrawing"
        @mousemove="draw"
        @mouseup="stopDrawing"
        @mouseout="stopDrawing"
      ></canvas>
    </div>

    <!-- 状态栏 -->
    <div class="status-bar">
      <span>坐标: ({{ coordinates.x }}, {{ coordinates.y }})</span>
      <span>画布: {{ canvasWidth }} x {{ canvasHeight }}</span>
    </div>
  </AppWindow>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from "vue";
import AppWindow from "@/components/appWindow/index.vue";

// ============ 画图状态 ============
const canvasRef = ref<HTMLCanvasElement | null>(null);
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
  { id: "pencil", name: "铅笔", icon: "✏️" },
  { id: "brush", name: "画笔", icon: "🖌️" },
  { id: "eraser", name: "橡皮擦", icon: "🧹" },
  { id: "line", name: "直线", icon: "📏" },
  { id: "rectangle", name: "矩形", icon: "⬜" },
  { id: "circle", name: "圆形", icon: "⭕" },
];

const presetColors = [
  "#000000",
  "#ff0000",
  "#00ff00",
  "#0000ff",
  "#ffff00",
  "#ff00ff",
  "#00ffff",
  "#ffffff",
];

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

// ============ 鼠标工具 ============
function getMousePos(e: MouseEvent) {
  if (!canvasRef.value) return { x: 0, y: 0 };
  const rect = canvasRef.value.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };
}

function startDrawing(e: MouseEvent) {
  if (!ctx) return;
  isDrawing.value = true;
  const pos = getMousePos(e);
  startX.value = pos.x;
  startY.value = pos.y;

  ctx.beginPath();
  ctx.moveTo(startX.value, startY.value);

  ctx.strokeStyle = currentTool.value === "eraser" ? "#ffffff" : currentColor.value;
  ctx.lineWidth = currentSize.value;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  if (currentTool.value !== "pencil" && currentTool.value !== "brush" && currentTool.value !== "eraser") {
    snapshot = ctx.getImageData(0, 0, canvasWidth.value, canvasHeight.value);
  }

  saveState();
}

function draw(e: MouseEvent) {
  if (!ctx) return;
  const pos = getMousePos(e);
  coordinates.value = { x: Math.round(pos.x), y: Math.round(pos.y) };

  if (!isDrawing.value) return;

  if (currentTool.value === "pencil" || currentTool.value === "brush" || currentTool.value === "eraser") {
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  } else {
    if (snapshot) ctx.putImageData(snapshot, 0, 0);
    ctx.beginPath();
    ctx.strokeStyle = currentColor.value;
    ctx.lineWidth = currentSize.value;

    if (currentTool.value === "line") {
      ctx.moveTo(startX.value, startY.value);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    } else if (currentTool.value === "rectangle") {
      ctx.strokeRect(startX.value, startY.value, pos.x - startX.value, pos.y - startY.value);
    } else if (currentTool.value === "circle") {
      const radius = Math.sqrt(
        Math.pow(pos.x - startX.value, 2) + Math.pow(pos.y - startY.value, 2)
      );
      ctx.arc(startX.value, startY.value, radius, 0, 2 * Math.PI);
      ctx.stroke();
    }
  }
}

function stopDrawing() {
  if (isDrawing.value && ctx) {
    isDrawing.value = false;
    ctx.closePath();
  }
}

function clearCanvas() {
  if (!ctx) return;
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
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeydown);
});
</script>

<style lang="scss" scoped>
@use "@/style/public" as *;

.toolbar {
  background: linear-gradient(to bottom, #ffffff, #e8e8e8);
  border-bottom: 1px solid #c0c0c0;
  padding: 8px 12px;
  display: flex;
  gap: 12px;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  flex-shrink: 0;
}

.tool-group {
  display: flex;
  gap: 4px;
  padding: 4px;
  border: 1px solid #d0d0d0;
  border-radius: 4px;
  background-color: #fafafa;
}

.tool-btn {
  width: 34px;
  height: 34px;
  border: 2px solid transparent;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: all 0.15s;

  &:hover {
    background-color: #e3f2fd;
    border-color: #90caf9;
  }

  &.active {
    background-color: #bbdefb;
    border-color: #2196f3;
  }
}

.color-picker {
  display: flex;
  gap: 4px;
  align-items: center;
}

.color-btn {
  width: 26px;
  height: 26px;
  border: 2px solid #ccc;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.15s;

  &:hover {
    transform: scale(1.15);
  }

  &.active {
    border-color: #333;
    border-width: 3px;
  }
}

input[type="color"] {
  width: 36px;
  height: 36px;
  border: none;
  cursor: pointer;
}

.size-slider {
  display: flex;
  align-items: center;
  gap: 8px;

  label {
    font-size: 13px;
    color: #333;
    white-space: nowrap;
  }

  input {
    width: 90px;
  }

  span {
    font-size: 13px;
    min-width: 20px;
    text-align: center;
  }
}

.canvas-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px;
  background-color: #d0d0d0;
  overflow: auto;
}

canvas {
  background-color: white;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
  cursor: crosshair;
  max-width: 100%;
  max-height: 100%;
}

.action-btn {
  padding: 6px 12px;
  border: 1px solid #999;
  border-radius: 4px;
  background: linear-gradient(to bottom, #ffffff, #e0e0e0);
  cursor: pointer;
  font-size: 13px;
  white-space: nowrap;
  transition: all 0.15s;

  &:hover {
    background: linear-gradient(to bottom, #e0e0e0, #d0d0d0);
  }
}

.status-bar {
  background-color: #f0f0f0;
  border-top: 1px solid #c0c0c0;
  padding: 4px 10px;
  font-size: 12px;
  color: #666;
  display: flex;
  justify-content: space-between;
  flex-shrink: 0;
}
</style>
