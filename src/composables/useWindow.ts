import { ref, onMounted, onUnmounted, nextTick } from "vue";
import { appStore } from "@/store/app";
import bus from "@/utils/bus";

/**
 * 应用窗口通用 composable
 * 封装 bringToFront、z-index 管理、事件总线注册/清理
 *
 * @param appName 应用名称，对应 store 中的 name 和 bus 事件名
 * @returns { windowRef, bringToFront } 窗口容器 ref 和置顶函数
 *
 * @example
 * // 在应用窗口组件中：
 * const { windowRef, bringToFront } = useWindow("Edge");
 * // 模板中：<div class="appContainer" ref="windowRef" @click.stop="bringToFront">
 */
export function useWindow(appName: string) {
  const store = appStore();
  const windowRef = ref<HTMLElement | null>(null);

  /**
   * 提升窗口层级到最前
   */
  const bringToFront = async () => {
    await nextTick();
    if (!windowRef.value) return;

    windowRef.value.style.zIndex = String(store.zIndex);
    store.changeZIndex();

    // 同步更新 isTop 状态，确保任务栏下划线正确显示
    store.changeAppStatus({
      name: appName,
      key: "isTop",
      value: true,
    });
  };

  // 注册事件总线监听（由任务栏点击触发置顶）
  onMounted(() => {
    bringToFront();
    bus.on(appName, bringToFront);
  });

  // 清理事件总线监听，防止内存泄漏
  onUnmounted(() => {
    bus.off(appName, bringToFront);
  });

  return {
    windowRef,
    bringToFront,
  };
}
