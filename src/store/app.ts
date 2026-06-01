import { defineStore } from "pinia";

// 类型定义
export interface AppItem {
  name: string;
  url: string;
  isDesktop: boolean;
  isPinned: boolean;
  isTaskBar: boolean;
  open: boolean;
  mini: boolean;
  hidden: boolean;
  isTop: boolean;
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

/**
 * 应用程序状态说明：
 * - name: 程序名称
 * - url: 图标路径
 * - isDesktop: 是否在桌面显示
 * - isPinned: 是否固定在开始菜单
 * - isTaskBar: 是否固定在任务栏
 * - open: 是否为打开状态（组件是否加载 v-if，是否显示任务栏图标长下划线）
 * - mini: 是否显示任务栏图标短下划线（最小化状态）
 * - hidden: 是否隐藏（v-show，应用最小化在任务栏的状态）
 * - isTop: 应用是否在最顶层显示（处理多个应用时任务栏图标下划线和层级问题）
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
    hidden: false,
    isTop: false,
  },
  {
    name: "Edge",
    url: edgeIcon,
    isDesktop: true,
    isPinned: true,
    isTaskBar: true,
    open: false,
    mini: false,
    hidden: false,
    isTop: false,
  },
  {
    name: "Microsoft Store",
    url: storeIcon,
    isDesktop: false,
    isPinned: true,
    isTaskBar: true,
    open: false,
    mini: false,
    hidden: false,
    isTop: false,
  },
  {
    name: "照片",
    url: photosIcon,
    isDesktop: false,
    isPinned: true,
    isTaskBar: false,
    open: false,
    mini: false,
    hidden: false,
    isTop: false,
  },
  {
    name: "设置",
    url: settingsIcon,
    isDesktop: false,
    isPinned: true,
    isTaskBar: false,
    open: false,
    mini: false,
    hidden: false,
    isTop: false,
  },
  {
    name: "时钟",
    url: alarmIcon,
    isDesktop: false,
    isPinned: true,
    isTaskBar: false,
    open: false,
    mini: false,
    hidden: false,
    isTop: false,
  },
  {
    name: "回收站",
    url: binIcon,
    isDesktop: true,
    isPinned: false,
    isTaskBar: false,
    open: false,
    mini: false,
    hidden: false,
    isTop: false,
  },
  {
    name: "cortana",
    url: cortanaIcon,
    isDesktop: false,
    isPinned: false,
    isTaskBar: false,
    open: false,
    mini: false,
    hidden: false,
    isTop: false,
  },
  {
    name: "Visual Studio Code",
    url: codeIcon,
    isDesktop: true,
    isPinned: false,
    isTaskBar: false,
    open: false,
    mini: false,
    hidden: false,
    isTop: false,
  },
  {
    name: "终端",
    url: terminalIcon,
    isDesktop: false,
    isPinned: false,
    isTaskBar: false,
    open: false,
    mini: false,
    hidden: false,
    isTop: false,
  },
  {
    name: "贪吃蛇",
    url: snakeIcon,
    isDesktop: true,
    isPinned: true,
    isTaskBar: false,
    open: false,
    mini: false,
    hidden: false,
    isTop: false,
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
      
      // 处理 open 状态变化
      if (key === "open") {
        this.handleOpenStateChange(targetApp, name, value);
      } else {
        // 处理其他状态变化
        this.handleOtherStateChange(targetApp);
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
     * 打开应用
     */
    openApp(targetApp: AppItem, name: string) {
      targetApp.isTop = true;
      targetApp.mini = false;
      targetApp.hidden = false;
      
      // 如果不是常驻任务栏应用，则显示任务栏图标
      if (!this.alwaysTaskBar.includes(name)) {
        targetApp.isTaskBar = true;
      }
      
      // 将其他已打开的应用设置为非置顶并最小化
      this.app.forEach((item) => {
        if (item.name !== name && item.open) {
          item.isTop = false;
          item.mini = true;
        }
      });
    },
    
    /**
     * 关闭应用
     */
    closeApp(targetApp: AppItem, name: string) {
      targetApp.isTop = false;
      targetApp.mini = false;
      targetApp.hidden = false;
      
      // 如果不是常驻任务栏应用，则隐藏任务栏图标
      if (!this.alwaysTaskBar.includes(name)) {
        targetApp.isTaskBar = false;
      }
    },
    
    /**
     * 处理其他状态变化（mini, hidden 等）
     */
    handleOtherStateChange(targetApp: AppItem) {
      // 重新计算 isTop：如果既没有最小化也没有隐藏，则是顶层
      targetApp.isTop = !targetApp.mini && !targetApp.hidden;
    },
  },
});

// 导出类型（保持向后兼容）
export type { AppList as appList };
export type { AppItem as appItem };
export type { StatusObjType as statusObjType };
