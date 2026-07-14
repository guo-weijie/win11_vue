# win11_vue

## 起因

看到有大神用 react 写了一个 windows11 的界面，[仓库地址](https://github.com/blueedgetechno/windows11)，这段时间正好在学习 vue3，于是就试着用 vue3 写了个 windows11 的界面

## 预览地址

[https://win11.keep-silent.com](https://win11.keep-silent.com)

开发人员：[我](https://github.com/guo-weijie) & [Ha aaaaaaaa666](https://github.com/xiaoxianxv666)

## 技术栈

- vue3
- vue-router
- pinia
- typescript
- sass
- naive-ui
- mitt

## 功能

- [x] 日历
- [x] Edge浏览器
- [x] 设置
- [x] 照片
- [x] 贪吃蛇

## 已知问题

1、~~同时打开两个应用时，任务栏图标下划线显示不正常且应用层级错误~~

- 原因分析：桌面同时打开两个应用时，应用的状态都为 `open: true, mini: false, hidden: false`，此时点击任务栏应用图标：
  - 如果点击应用层级在上，理想处理为该应用最小化并隐藏，实际处理为 `hidden: false, mini: true`，即最小化，但不隐藏，其他应用最小化，不隐藏
  - 如果点击的应用层级在下，理想处理为该应用层级放置于最顶层，实际处理结果同上

2、~~点击最小化、最大化、关闭按钮时，会触发拖拽事件~~

3、~~从开始菜单打开应用时，如果先打开设置，再打开 Edge，Edge 的层级显示有问题~~

- 问题原因：应用关闭时，实例销毁。再次打开时，实例还未加载完成，添加不了样式层级
