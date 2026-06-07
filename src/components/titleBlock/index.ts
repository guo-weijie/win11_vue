import { h, defineComponent, onMounted, ref, resolveDirective, withDirectives, type Directive, type VNode, type Ref } from "vue";
import { appStore, type statusObjType } from "@/store/app";
import "./style.scss";
import { Subtract16Regular, Dismiss20Regular, SquareMultiple16Regular } from "@vicons/fluent";
import { NButton, NIcon } from "naive-ui";

// ==================== 常量定义 ====================
// 按钮类型常量
const BUTTON_TYPE = {
  MINIMIZE: "mini",
  WINDOW: "win",
  CLOSE: "close",
} as const;

// ==================== 类型定义 ====================
interface WindowSizeChild {
  id: string;
  class?: string;
}

interface WindowSizeItem {
  class: string;
  children: WindowSizeChild[];
}

interface ButtonConfig {
  type: string;
  icon: any;
  title: string;
}

export default defineComponent({
  name: "TitleBlock",
  props: {
    title: {
      type: String,
      required: true,
    },
    bgColor: {
      type: String,
      default: "",
    },
  },
  setup(props, { slots }) {
    const store = appStore();
    
    // 父元素引用
    let parentInstance: HTMLElement | null = null;
    
    // 窗口尺寸面板显示状态
    const showWinSizePanel = ref(false);
    
    // 标题栏元素引用
    const titleBlockRef: Ref<HTMLElement | null> = ref(null);
    
    onMounted(() => {
      // 通过 ref 获取当前组件实例的标题栏元素
      if (titleBlockRef.value) {
        parentInstance = titleBlockRef.value.parentElement;
      }
    });

    // 提升窗口层级到最前
    const bringToFront = () => {
      if (!parentInstance) return;
      
      // 获取当前最高 z-index 并累加
      const currentZIndex = store.zIndex;
      parentInstance.style.zIndex = String(currentZIndex);
      store.changeZIndex();
      
      // 同步更新 isTop 状态，确保任务栏下划线正确显示
      store.changeAppStatus({
        name: props.title,
        key: "isTop",
        value: true,
      } as statusObjType);
    };

    // 窗口尺寸配置
    const windowSizeObj: WindowSizeItem[] = [
      {
        class: "item1",
        children: [{ id: "halfOnLeft" }, { id: "halfOnRight" }],
      },
      {
        class: "item2",
        children: [{ id: "moreOnLeft" }, { id: "moreOnRight" }],
      },
      {
        class: "item3",
        children: [{ id: "thirdOnLeft" }, { id: "thirdOnCenter" }, { id: "thirdOnRight" }],
      },
      {
        class: "item4",
        children: [{ id: "halfOnLeft", class: "item4A" }, { id: "thirdOnTop" }, { id: "thirdOnBottom" }],
      },
      {
        class: "item5",
        children: [
          { id: "quarterOnLeftTop" },
          { id: "thirdOnTop" },
          { id: "quarterOnLeftBottom" },
          { id: "thirdOnBottom" },
        ],
      },
      {
        class: "item6",
        children: [{ id: "moreThirdLeft" }, { id: "moreThirdCenter" }, { id: "moreThirdRight" }],
      },
    ];

    // 右侧按钮点击事件
    const rightBtn = (value?: string) => {
      if (!parentInstance) return;
      
      if (value === "mini") {
        // 最小化：设置 mini=true，handleMiniStateChange 会自动取消置顶并提升下一个应用
        store.changeAppStatus({
          name: props.title,
          key: "mini",
          value: true,
        } as statusObjType);
      } else if (value === "close") {
        store.changeAppStatus({
          name: props.title,
          key: "open",
          value: false,
        } as statusObjType);
      } else {
        // 最大化/还原
        parentInstance.style.left = "";
        parentInstance.style.top = "";
        parentInstance.className = parentInstance.className === "appContainer"
          ? "appContainer centerCenter"
          : "appContainer";
        // 关闭窗口尺寸悬浮面板
        showWinSizePanel.value = false;
      }
    };

    // 窗口尺寸切换
    const changeWinSize = (className: string) => {
      if (!parentInstance) return;
      
      parentInstance.style.left = "";
      parentInstance.style.top = "";
      parentInstance.className = `appContainer ${className}`;
      
      // 点击后关闭面板
      showWinSizePanel.value = false;
    };

    // 创建二级窗口尺寸节点
    const createSecondStepSize = (data: WindowSizeChild[]): VNode[] => {
      return data.map((item) =>
        h("div", {
          class: item.class || "",
          id: item.id,
          onClick: () => {
            changeWinSize(item.id);
          },
        })
      );
    };

    // 创建一级窗口尺寸节点
    const createWinSize = (): VNode[] => {
      return windowSizeObj.map((item) =>
        h(
          "div",
          {
            class: item.class,
          },
          createSecondStepSize(item.children)
        )
      );
    };

    // 创建右侧按钮
    const createRight = (): VNode => {
      // 按钮配置列表
      const buttons: ButtonConfig[] = [
        {
          type: "mini",
          icon: Subtract16Regular,
          title: "最小化",
        },
        {
          type: "win",
          icon: SquareMultiple16Regular,
          title: "向下还原",
        },
        {
          type: "close",
          icon: Dismiss20Regular,
          title: "关闭",
        },
      ];

      const btnNodes = buttons.map((item): VNode => {
        // 按钮通用配置
        const buttonProps = {
          style: {
            width: "40px",
            height: "40px",
            fontSize: "18px",
          },
          class: {
            closeBtn: item.type === BUTTON_TYPE.CLOSE,
            otherBtn: item.type !== BUTTON_TYPE.CLOSE,
          },
          size: "tiny" as const,
          title: item.title,
          bordered: false,
          text: true,
          onClick: (event: MouseEvent) => {
            event.stopPropagation();
            rightBtn(item.type);
          },
        };
        
        const button = h(
          NButton,
          buttonProps,
          () => h(NIcon, null, () => h(item.icon))
        );

        // 窗口按钮 - 使用自定义面板代替 Popover
        if (item.type === BUTTON_TYPE.WINDOW) {
          return h(
            "div",
            {
              class: "winButtonWrapper",
              style: { position: "relative" },
              onMouseenter: () => {
                showWinSizePanel.value = true;
              },
            },
            button
          );
        }

        return button;
      });

      return h(
        "div",
        {
          class: "btnBox",
        },
        [
          ...btnNodes,
          createWinSizePanel()
        ]
      );
    };

    // 创建窗口尺寸面板
    const createWinSizePanel = (): VNode => {
      return h(
        "div",
        {
          class: "winSizePanel",
          style: {
            visibility: showWinSizePanel.value ? "visible" : "hidden",
            opacity: showWinSizePanel.value ? 1 : 0,
            pointerEvents: showWinSizePanel.value ? "auto" : "none",
            transition: "opacity 0.15s ease-in-out",
          },
          onMouseenter: () => {
            // 鼠标进入面板时保持显示
            showWinSizePanel.value = true;
          },
          onMouseleave: (event: MouseEvent) => {
            // 只有真正离开面板时才关闭
            const panel = event.currentTarget as HTMLElement;
            const relatedTarget = event.relatedTarget as HTMLElement;
            if (!panel.contains(relatedTarget)) {
              showWinSizePanel.value = false;
            }
          },
        },
        createWinSize()
      );
    };

    // 渲染函数
    return () => {
      const dragable = resolveDirective("drag");
      
      return withDirectives(
        h(
          "div",
          {
            ref: titleBlockRef,
            style: {
              backgroundColor: props.bgColor || "var(--global-bg-color)",
            },
            class: "titleBlock",
            onDblclick: () => rightBtn(),
            onClick: () => {
              // 点击标题栏时提升窗口层级
              bringToFront();
            },
          },
          [
            // 左侧标题区域
            slots.default ? slots.default() : h("div", { class: "titleBlockLeft" }, props.title),
            // 右侧按钮区域
            createRight(),
          ]
        ),
        [[dragable as Directive]]
      );
    };
  },
});
