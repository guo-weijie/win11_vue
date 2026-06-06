import { createRouter, createWebHashHistory, type RouteRecordRaw } from "vue-router";
import Home from "@/views/home.vue";

// 路由配置
const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "PowerOn",
    component: () => import("@/views/powerOn/index.vue"),
    meta: {
      title: "开机",
    },
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/login/index.vue"),
    meta: {
      title: "登录",
    },
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
    meta: {
      title: "主页"
    },
  },
];

// 创建路由实例
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// 全局前置守卫
router.beforeEach((to, _from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = to.meta.title as string;
  }
  next();
});

export default router;
