import { defineStore } from "pinia";

// 类型定义
export interface AppItem {
  name: string;
  url: string;
  isDesktop: boolean;
  isPinned: boolean;
  isTaskBar: boolean;
  /** 应用是否打开（true=DOM存在，false=销毁） */
  open: boolean;
  /** 应用是否隐藏（true=display:none，false=显示） */
  mini: boolean;
  /** 应用是否在最顶层 */
  isTop: boolean;
  /** 应用窗口的 z-index 层级 */
  zIndex: number;
}

type AppList = AppItem[];

interface AppState {
  app: AppList;
  zIndex: number;
  alwaysTaskBar: string[];
}

export interface StatusObjType {
  name: string;
  key: keyof AppItem;
  value: boolean;
}

// 导入所有图标资源
import explorerIcon from "@/assets/icon/appIcon/explorer.png";
import edgeIcon from "@/assets/icon/appIcon/edge.png";
import storeIcon from "@/assets/icon/appIcon/store.png";
import photosIcon from "@/assets/icon/appIcon/photos.png";
import settingsIcon from "@/assets/icon/appIcon/settings.png";
import alarmIcon from "@/assets/icon/appIcon/alarm.png";
import binIcon from "@/assets/icon/appIcon/bin1.png";
import cortanaIcon from "@/assets/icon/appIcon/cortana.png";
import codeIcon from "@/assets/icon/appIcon/code.png";
import terminalIcon from "@/assets/icon/appIcon/terminal.png";
import snakeIcon from "@/assets/icon/appIcon/snake.jpg";
import PaintIcon from "@/assets/icon/appIcon/paint.png";

/**
 * 应用程序状态说明：
 * - name: 程序名称
 * - url: 图标路径
 * - isDesktop: 是否在桌面显示
 * - isPinned: 是否固定在开始菜单
 * - isTaskBar: 是否固定在任务栏
 * - open: 应用是否打开（true=组件挂载，false=销毁）
 * - mini: 应用是否隐藏（true=display:none，false=显示，DOM保留）
 * - isTop: 应用是否在最顶层（影响任务栏下划线样式和层级）
 */

// 默认应用列表
const defaultApps: AppList = [
  {
    name: "文件资源管理器",
    url: explorerIcon,
    isDesktop: false,
    isPinned: true,
    isTaskBar: true,
    open: false,
    mini: false,
    isTop: false,
    zIndex: 0,
  },
  {
    name: "Edge",
    url: edgeIcon,
    isDesktop: true,
    isPinned: true,
    isTaskBar: true,
    open: false,
    mini: false,
    isTop: false,
    zIndex: 0,
  },
  {
    name: "Microsoft Store",
    url: storeIcon,
    isDesktop: false,
    isPinned: true,
    isTaskBar: true,
    open: false,
    mini: false,
    isTop: false,
    zIndex: 0,
  },
  {
    name: "照片",
    url: photosIcon,
    isDesktop: false,
    isPinned: true,
    isTaskBar: false,
    open: false,
    mini: false,
    isTop: false,
    zIndex: 0,
  },
  {
    name: "设置",
    url: settingsIcon,
    isDesktop: false,
    isPinned: true,
    isTaskBar: false,
    open: false,
    mini: false,
    isTop: false,
    zIndex: 0,
  },
  {
    name: "时钟",
    url: alarmIcon,
    isDesktop: false,
    isPinned: true,
    isTaskBar: false,
    open: false,
    mini: false,
    isTop: false,
    zIndex: 0,
  },
  {
    name: "回收站",
    url: binIcon,
    isDesktop: true,
    isPinned: false,
    isTaskBar: false,
    open: false,
    mini: false,
    isTop: false,
    zIndex: 0,
  },
  {
    name: "cortana",
    url: cortanaIcon,
    isDesktop: false,
    isPinned: false,
    isTaskBar: false,
    open: false,
    mini: false,
    isTop: false,
    zIndex: 0,
  },
  {
    name: "Visual Studio Code",
    url: codeIcon,
    isDesktop: true,
    isPinned: false,
    isTaskBar: false,
    open: false,
    mini: false,
    isTop: false,
    zIndex: 0,
  },
  {
    name: "终端",
    url: terminalIcon,
    isDesktop: false,
    isPinned: false,
    isTaskBar: false,
    open: false,
    mini: false,
    isTop: false,
    zIndex: 0,
  },
  {
    name: "贪吃蛇",
    url: snakeIcon,
    isDesktop: true,
    isPinned: true,
    isTaskBar: false,
    open: false,
    mini: false,
    isTop: false,
    zIndex: 0,
  },
  {
    name: "画图",
    url: PaintIcon,
    isDesktop: true,
    isPinned: true,
    isTaskBar: false,
    open: false,
    mini: false,
    isTop: false,
    zIndex: 0,
  },
];

// 常驻任务栏应用
const ALWAYS_TASKBAR_APPS = ["文件资源管理器", "Edge", "Microsoft Store"];

export const appStore = defineStore("app-store", {
  state: (): AppState => ({
    app: defaultApps,
    zIndex: 2,
    alwaysTaskBar: ALWAYS_TASKBAR_APPS,
  }),
  
  getters: {
    // 获取所有应用
    getApp(): AppList {
      return this.app;
    },
    
    // 根据类型获取应用
    getTypeApp() {
      return (appType: keyof AppItem) => this.app.filter((item) => item[appType]);
    },
    
    // 根据名称获取应用
    getMyApp() {
      return (appName: string) => this.app.find((item) => item.name === appName);
    },
    
    // 获取 z-index
    getZIndex(): number {
      return this.zIndex;
    },
  },
  
  actions: {
    // 增加 z-index
    changeZIndex() {
      this.zIndex++;
    },
    
    /**
     * 修改应用状态
     * @param statusObj - 状态对象 { name, key, value }
     */
    changeAppStatus(statusObj: StatusObjType) {
      const { name, key, value } = statusObj;
      
      // 查找目标应用
      const targetApp = this.app.find((item) => item.name === name);
      
      if (!targetApp) {
        console.warn(`App with name "${name}" not found.`);
        return;
      }
      
      // 更新状态
      (targetApp as any)[key] = value;
      
      // 根据变更的 key 分发处理
      if (key === "open") {
        this.handleOpenStateChange(targetApp, name, value);
      } else if (key === "mini") {
        this.handleMiniStateChange(targetApp, value);
      } else if (key === "isTop") {
        this.handleIsTopStateChange(targetApp, value);
      }
    },
    
    /**
     * 处理 open 状态变化
     */
    handleOpenStateChange(targetApp: AppItem, name: string, isOpen: boolean) {
      if (isOpen) {
        // 打开应用
        this.openApp(targetApp, name);
      } else {
        // 关闭应用
        this.closeApp(targetApp, name);
      }
    },
    
    /**
     * 处理 mini 状态变化
     * @param targetApp 目标应用
     * @param isMini true=最小化（隐藏），false=最大化（显示）
     */
    handleMiniStateChange(targetApp: AppItem, isMini: boolean) {
      if (isMini) {
        // 最小化：取消置顶，找到其他已打开且未隐藏应用中 z-index 最大的，置顶
        targetApp.isTop = false;
        this.promoteNextTopApp(targetApp.name);
      } else {
        // 最大化（mini 从 true 变为 false）：应用应当置顶
        targetApp.isTop = true;
        // 将其他已打开应用设为非置顶
        this.app.forEach((item) => {
          if (item.name !== targetApp.name && item.open) {
            item.isTop = false;
          }
        });
      }
    },
    
    /**
     * 处理 isTop 状态变化
     */
    handleIsTopStateChange(targetApp: AppItem, isTop: boolean) {
      if (isTop) {
        // 置顶：将其他已打开应用设为非置顶
        this.app.forEach((item) => {
          if (item.name !== targetApp.name && item.open) {
            item.isTop = false;
          }
        });
      }
    },
    
    /**
     * 找到其他已打开且未隐藏应用中 z-index 最大的，将其置顶
     * @param excludeName 排除的应用名称
     */
    promoteNextTopApp(excludeName: string) {
      const candidates = this.app.filter(
        (item) => item.name !== excludeName && item.open && !item.mini,
      );
      if (candidates.length === 0) return;
      
      let maxApp = candidates[0];
      for (let i = 1; i < candidates.length; i++) {
        if (candidates[i].zIndex > maxApp.zIndex) {
          maxApp = candidates[i];
        }
      }
      maxApp.isTop = true;
    },
    
    /**
     * 打开应用：置顶、取消隐藏、将其他应用设为非置顶
     */
    openApp(targetApp: AppItem, name: string) {
      targetApp.isTop = true;
      targetApp.mini = false;
      
      // 如果不是常驻任务栏应用，则显示任务栏图标
      if (!this.alwaysTaskBar.includes(name)) {
        targetApp.isTaskBar = true;
      }
      
      // 将其他已打开的应用设置为非置顶（但不隐藏）
      this.app.forEach((item) => {
        if (item.name !== name && item.open) {
          item.isTop = false;
        }
      });
    },
    
    /**
     * 关闭应用：重置所有状态
     */
    closeApp(targetApp: AppItem, name: string) {
      targetApp.isTop = false;
      targetApp.mini = false;
      targetApp.zIndex = 0;
      
      // 如果不是常驻任务栏应用，则隐藏任务栏图标
      if (!this.alwaysTaskBar.includes(name)) {
        targetApp.isTaskBar = false;
      }
      
      // 将其他已打开且未隐藏应用中 z-index 最大的置顶
      this.promoteNextTopApp(name);
    },
  },
});

// 导出类型（保持向后兼容）
export type { AppList as appList };
export type { AppItem as appItem };
export type { StatusObjType as statusObjType };
