import { ref, onMounted, onUnmounted } from "vue";

/**
 * 移动端检测与响应式 Composable
 * 提供设备类型检测、窗口尺寸监听、触摸优化等功能
 */
export function useMobile() {
  const BREAKPOINT_MOBILE = 768;

  const isMobile = ref(false);
  const isTablet = ref(false);
  const isDesktop = ref(true);
  const windowWidth = ref(window.innerWidth);
  const windowHeight = ref(window.innerHeight);

  /**
   * 检测是否为触摸设备
   */
  const isTouchDevice = ref(false);

  const updateDeviceType = () => {
    windowWidth.value = window.innerWidth;
    windowHeight.value = window.innerHeight;

    isMobile.value = windowWidth.value < BREAKPOINT_MOBILE;
    isTablet.value =
      windowWidth.value >= BREAKPOINT_MOBILE && windowWidth.value < 1024;
    isDesktop.value = windowWidth.value >= 1024;
  };

  const detectTouch = () => {
    isTouchDevice.value =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      // @ts-expect-error msMaxTouchPoints for IE
      navigator.msMaxTouchPoints > 0;
  };

  /**
   * 移动端安全区域 insets
   */
  const safeArea = ref({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  });

  const updateSafeArea = () => {
    const style = getComputedStyle(document.documentElement);
    safeArea.value = {
      top: parseInt(style.getPropertyValue("env(safe-area-inset-top)") || "0"),
      right: parseInt(
        style.getPropertyValue("env(safe-area-inset-right)") || "0"
      ),
      bottom: parseInt(
        style.getPropertyValue("env(safe-area-inset-bottom)") || "0"
      ),
      left: parseInt(
        style.getPropertyValue("env(safe-area-inset-left)") || "0"
      ),
    };
  };

  onMounted(() => {
    updateDeviceType();
    detectTouch();
    updateSafeArea();
    window.addEventListener("resize", updateDeviceType);
    window.addEventListener("orientationchange", updateSafeArea);
  });

  onUnmounted(() => {
    window.removeEventListener("resize", updateDeviceType);
    window.removeEventListener("orientationchange", updateSafeArea);
  });

  return {
    isMobile,
    isTablet,
    isDesktop,
    isTouchDevice,
    windowWidth,
    windowHeight,
    safeArea,
    BREAKPOINT_MOBILE,
  };
}
