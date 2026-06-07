import { ref, computed, onMounted, onUnmounted, nextTick } from "vue";
import { appStore } from "@/store/app";
import bus from "@/utils/bus";

/**
 * 应用窗口通用 composable
 * 封装 bringToFront、z-index 管理、事件总线注册/清理、窗口可见性
 *
 * @param appName 应用名称，对应 store 中的 name 和 bus 事件名
 * @returns { windowRef, bringToFront, isHidden } 窗口容器 ref、置顶函数、是否隐藏
 *
 * @example
 * // 在应用窗口组件中：
 * const { windowRef, bringToFront, isHidden } = useWindow("Edge");
 * // 模板中：<div class="appContainer" ref="windowRef" v-show="!isHidden" @click.stop="bringToFront">
 */
export function useWindow(appName: string) {
  const store = appStore();
  const windowRef = ref<HTMLElement | null>(null);

  /** 窗口是否隐藏（mini=true 时 display:none，DOM 保留） */
  const isHidden = computed(() => {
    const app = store.getMyApp(appName);
    return app ? app.mini : false;
  });

  /**
   * 提升窗口层级到最前
   */
  const bringToFront = async () => {
    await nextTick();
    if (!windowRef.value) return;

    store.changeZIndex();
    const newZIndex = store.zIndex;
    windowRef.value.style.zIndex = String(newZIndex);

    // 同步更新 app 的 zIndex 字段
    const app = store.getMyApp(appName);
    if (app) {
      app.zIndex = newZIndex;
    }

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
    isHidden,
  };
}
