import {
  Desktop20Regular,
  Bluetooth20Regular,
  Wifi120Regular,
  Color20Regular,
  Apps20Regular,
  PersonAccounts24Regular,
  Games20Regular,
  Accessibility20Regular,
  ShieldLock20Regular,
  Speaker220Regular,
  Alert20Regular,
  Battery820Regular,
  WindowApps20Regular,
  KeyMultiple20Regular,
  ArrowCounterclockwise20Regular,
  Clipboard20Regular,
  Info20Regular,
  Print20Regular,
  Phone20Regular,
  Camera20Regular,
  Globe20Regular,
  Server20Regular,
  Image20Regular,
  PaintBrush20Regular,
  Keyboard20Regular,
  Home20Regular,
  TextFont20Regular,
  Laptop20Regular,
  StoreMicrosoft20Regular,
  AppGeneric20Regular,
  Map20Regular,
  PuzzlePiece20Regular,
  Video20Regular,
  Flash20Regular,
  Person20Regular,
  Mail20Regular,
  People20Regular,
  Clock20Regular,
  Building20Regular,
  LocalLanguage20Regular,
  Translate20Regular,
  Mic20Regular,
  Eye20Regular,
  Cast20Regular,
  CursorHover20Regular,
  ZoomIn20Regular,
  Color20Filled,
  Headphones20Regular,
  ClosedCaption20Regular,
  Record20Regular,
  Shifts20Regular,
  EyeTracking20Regular,
  Shield20Regular,
  Location20Regular,
  Search20Regular,
  History20Regular,
  DocumentSearch20Regular,
  Folder20Regular,
  MusicNote120Regular,
  VideoClip20Regular,
  ContentViewGallery20Regular,
  BorderAll20Regular,
  Pause20Regular,
  Code20Regular,
  ChartPerson20Regular,
  TaskListSquareLtr20Regular,
  Chat20Regular,
  ArrowDownload20Regular,
  Document20Regular,
  Screenshot20Regular,
  Settings20Regular,
  Rocket20Regular,
  WeatherMoon20Regular,
  Database20Regular,
  WrenchScrewdriver20Regular,
  DesktopArrowRight20Regular,
  CloudSync20Regular,
  CalendarClock20Regular,
  Edit20Regular,
  UsbPlug20Regular,
  LockClosed20Regular,
  Window20Regular,
  XboxConsole20Regular,
  Connector20Regular,
  Compose20Regular,
  Table20Regular,
  Tent20Regular,
  NetworkCheck24Regular,
  VideoSecurity20Regular,
  TextT20Regular,
  CalendarAdd20Regular,
  RadioButton20Regular,
  Cut20Regular,
} from "@vicons/fluent";
import type { Component } from "vue";

export interface MenuItem {
  icon: Component;
  name: string;
  desc: string;
}

export interface MenuChild {
  title: string;
  itemList: MenuItem[];
}

export interface MenuData {
  icon: Component;
  name: string;
  children: MenuChild[];
}

export const menuItemData: MenuData[] = [
  {
    icon: Desktop20Regular,
    name: "系统",
    children: [
      {
        title: "",
        itemList: [
          { icon: Desktop20Regular, name: "显示", desc: "显示器、亮度、夜间模式、显示配置文件" },
          { icon: Speaker220Regular, name: "声音", desc: "音量级别、输出、声音设备" },
          { icon: Alert20Regular, name: "通知", desc: "来自应用和系统的警报" },
          { icon: WeatherMoon20Regular, name: "专注助手", desc: "通知、自动规则" },
          { icon: Battery820Regular, name: "电源", desc: "睡眠、电池使用情况、节电模式" },
          { icon: Database20Regular, name: "存储", desc: "存储空间、驱动器、配置规则" },
          { icon: WindowApps20Regular, name: "多任务处理", desc: "贴靠窗口、桌面、任务切换" },
          { icon: KeyMultiple20Regular, name: "激活", desc: "激活状态、订阅、产品密钥" },
          { icon: WrenchScrewdriver20Regular, name: "疑难解答", desc: "建议的疑难解答、首选项和历史记录" },
          { icon: ArrowCounterclockwise20Regular, name: "恢复", desc: "重置、高级启动、返回" },
          { icon: Cast20Regular, name: "投影到此电脑", desc: "权限、配对PIN、可发现性" },
          { icon: DesktopArrowRight20Regular, name: "远程桌面", desc: "远程桌面用户，连接权限" },
          { icon: Clipboard20Regular, name: "剪贴板", desc: "剪切和复制历史记录、同步、清除" },
          { icon: Info20Regular, name: "关于", desc: "设备规格，重命名电脑、Windows 规格" },
        ],
      },
    ],
  },
  {
    icon: Bluetooth20Regular,
    name: "蓝牙和其他设备",
    children: [
      {
        title: "",
        itemList: [
          { icon: Connector20Regular, name: "设备", desc: "鼠标、键盘、触笔、音频、显示器和扩展坞、其他设备" },
          { icon: Print20Regular, name: "打印机和扫描仪", desc: "首选项、疑难解答" },
          { icon: Phone20Regular, name: "你的手机", desc: "立即获取 Android 设备的照片、短信及其他" },
          { icon: Camera20Regular, name: "照相机", desc: "连接的相机、默认图像设置" },
          { icon: Compose20Regular, name: "鼠标", desc: "按钮、鼠标指针速度、滚动" },
          { icon: Edit20Regular, name: "笔和 Windows Ink", desc: "右手或左手、笔按钮快捷方式、手写" },
          { icon: UsbPlug20Regular, name: "自动播放", desc: "可移动驱动器和内存的默认设置" },
          { icon: Table20Regular, name: "USB", desc: "通知、USB 节电模式、移动设备首选项" },
        ],
      },
    ],
  },
  {
    icon: Wifi120Regular,
    name: "网络和 Internet",
    children: [
      {
        title: "",
        itemList: [
          { icon: Tent20Regular, name: "以太网", desc: "身份验证，IP 和 DNS 设置，按流量计费的网络" },
          { icon: Globe20Regular, name: "VPN", desc: "添加、连接、管理" },
          { icon: Server20Regular, name: "代理", desc: "用于 Wi-Fi 和以太网连接的代理服务器" },
          { icon: Phone20Regular, name: "拨号", desc: "设置拨号 Internet 连接" },
          { icon: NetworkCheck24Regular, name: "高级网络设置", desc: "查看所有网络适配器，网络重置" },
        ],
      },
    ],
  },
  {
    icon: Color20Regular,
    name: "个性化",
    children: [
      {
        title: "",
        itemList: [
          { icon: Image20Regular, name: "背景", desc: "背景图像、颜色、幻灯片" },
          { icon: PaintBrush20Regular, name: "颜色", desc: "主题色、透明效果、颜色主题" },
          { icon: Color20Regular, name: "主题", desc: "安装、创建、管理" },
          { icon: LockClosed20Regular, name: "锁屏界面", desc: "锁定屏幕图像、应用和动画" },
          { icon: Keyboard20Regular, name: "触摸键盘", desc: "主题、大小" },
          { icon: Home20Regular, name: "开始", desc: "最近使用的应用和项目、文件夹" },
          { icon: Window20Regular, name: "任务栏", desc: "任务栏行为，系统固定项" },
          { icon: TextFont20Regular, name: "字体", desc: "安装、管理" },
          { icon: Laptop20Regular, name: "设备使用情况", desc: "选择你计划使用设备的所有方法，以在 Microsoft 体验中获取个性化的提示、广告和建议" },
        ],
      },
    ],
  },
  {
    icon: Apps20Regular,
    name: "应用",
    children: [
      {
        title: "",
        itemList: [
          { icon: StoreMicrosoft20Regular, name: "应用和功能", desc: "已安装的应用，应用执行别名" },
          { icon: AppGeneric20Regular, name: "默认应用", desc: "根据文件和链接种类设置的默认应用，其他默认应用" },
          { icon: Map20Regular, name: "离线地图", desc: "下载、存储位置、地图更新" },
          { icon: PuzzlePiece20Regular, name: "可选功能", desc: "你的设备的额外功能" },
          { icon: Globe20Regular, name: "可打开网站的应用", desc: "可在应用而不是浏览器中打开的网站" },
          { icon: Video20Regular, name: "视频播放", desc: "视频调整、HDR流式处理、电池选项" },
          { icon: Flash20Regular, name: "启动", desc: "登录时自动启动的应用程序" },
        ],
      },
    ],
  },
  {
    icon: PersonAccounts24Regular,
    name: "账户",
    children: [
      {
        title: "",
        itemList: [
          { icon: Person20Regular, name: "你的 Microsoft 账户", desc: "订阅、奖励等" },
          { icon: Info20Regular, name: "账户信息", desc: "电子邮件、日历和联系人使用的账户" },
          { icon: Mail20Regular, name: "电子邮件和账户", desc: "电子邮件、日历和联系人使用的账户" },
          { icon: VideoSecurity20Regular, name: "登录选项", desc: "Windows Hello、安全密钥、密码、动态锁" },
          { icon: People20Regular, name: "家庭和其他用户", desc: "设备访问权限、工作或学校用户" },
          { icon: CloudSync20Regular, name: "Windows 备份", desc: "备份文件、应用和首选项，以便跨设备将其还原" },
          { icon: Building20Regular, name: "连接工作或学校账户", desc: "电子邮件、应用和网络等组织资源" },
        ],
      },
    ],
  },
  {
    icon: Clock20Regular,
    name: "时间和语言",
    children: [
      {
        title: "",
        itemList: [
          { icon: CalendarClock20Regular, name: "日期和时间", desc: "时区、自动时钟设置、日历显示" },
          { icon: LocalLanguage20Regular, name: "语言和区域", desc: "根据你所在的区域设置 Windows 和某些应用的日期和时间格式" },
          { icon: Translate20Regular, name: "输入", desc: "触摸键盘、文本建议、首选项" },
          { icon: Mic20Regular, name: "语音", desc: "语音语言、语音识别麦克风设置、声音" },
        ],
      },
    ],
  },
  {
    icon: Games20Regular,
    name: "游戏",
    children: [
      {
        title: "",
        itemList: [
          { icon: XboxConsole20Regular, name: "Xbox Game Bar", desc: "控制器和键盘快捷方式" },
          { icon: Record20Regular, name: "摄像", desc: "保存位置，录制首选项" },
          { icon: Games20Regular, name: "游戏模式", desc: "优化电脑以便畅玩" },
        ],
      },
    ],
  },
  {
    icon: Accessibility20Regular,
    name: "辅助功能",
    children: [
      {
        title: "视觉",
        itemList: [
          { icon: TextFont20Regular, name: "文本大小", desc: "在整个 Windows 和应用中显示的文本大小" },
          { icon: Eye20Regular, name: "视觉效果", desc: "滚动条、透明度、动画、通知超时" },
          { icon: CursorHover20Regular, name: "鼠标指针和触控", desc: "鼠标指针颜色、大小" },
          { icon: TextT20Regular, name: "文本光标", desc: "外观和粗细、文本光标指示器" },
          { icon: Cast20Regular, name: "对比度主题", desc: "弱视彩色主题、光敏度" },
        ],
      },
      {
        title: "影像",
        itemList: [
          { icon: ZoomIn20Regular, name: "放大镜", desc: "放大镜阅读、缩放增量" },
          { icon: Color20Filled, name: "颜色滤镜", desc: "色盲滤镜、灰度、反转" },
          { icon: Record20Regular, name: "讲述人", desc: "声音、详细信息、键盘、盲文" },
        ],
      },
      {
        title: "听力",
        itemList: [
          { icon: Headphones20Regular, name: "音频", desc: "单声道音频、音频通知" },
        ],
      },
      {
        title: "聆听",
        itemList: [
          { icon: ClosedCaption20Regular, name: "字幕", desc: "样式" },
        ],
      },
      {
        title: "交互",
        itemList: [
          { icon: Record20Regular, name: "语音", desc: "Windows 语音识别、语音输入" },
          { icon: Shifts20Regular, name: "键盘", desc: "粘滞键、筛选键和切换键，屏幕键盘" },
          { icon: Compose20Regular, name: "鼠标", desc: "鼠标键、速度、加速" },
          { icon: EyeTracking20Regular, name: "目视控制", desc: "眼动追踪仪，文本到语音转换" },
        ],
      },
    ],
  },
  {
    icon: ShieldLock20Regular,
    name: "隐私和安全性",
    children: [
      {
        title: "安全性",
        itemList: [
          { icon: Shield20Regular, name: "Windows 安全中心", desc: "适用于你的设备的防病毒、浏览器、防火墙和网络保护" },
          { icon: Location20Regular, name: "查找我的设备", desc: "如果认为设备已丢失，请跟踪设备" },
          { icon: Code20Regular, name: "开发者选项", desc: "这些设置仅供开发者使用" },
        ],
      },
      {
        title: "Windows 权限",
        itemList: [
          { icon: Apps20Regular, name: "常规", desc: "广告ID，本地内容，应用启动，设置建议，生产力工具" },
          { icon: Mic20Regular, name: "语音", desc: "英语听写和其他基于语言的交互的在线语音识别" },
          { icon: Edit20Regular, name: "墨迹书写和键入个性化", desc: "个人词典，词典中的字词" },
          { icon: ChartPerson20Regular, name: "诊断和反馈", desc: "诊断数据，墨迹书写和键入数据，定制体验，反馈频率" },
          { icon: History20Regular, name: "活动历史记录", desc: "从你的跨设备和账户的活动历史记录中获取更多搜索结果的选项" },
          { icon: Search20Regular, name: "搜索权限", desc: "安全搜索、云内容搜索、搜索历史记录" },
          { icon: DocumentSearch20Regular, name: "搜索 Windows", desc: "可更快得到搜索结果的搜索索引、找到我的文件、从搜索中排除的文件夹" },
        ],
      },
      {
        title: "应用权限",
        itemList: [
          { icon: Location20Regular, name: "位置", desc: "" },
          { icon: Camera20Regular, name: "相机", desc: "" },
          { icon: Mic20Regular, name: "麦克风", desc: "" },
          { icon: Record20Regular, name: "语音激活", desc: "" },
          { icon: Alert20Regular, name: "通知", desc: "" },
          { icon: Person20Regular, name: "账户信息", desc: "" },
          { icon: People20Regular, name: "联系人", desc: "" },
          { icon: CalendarAdd20Regular, name: "日历", desc: "" },
          { icon: Phone20Regular, name: "电话呼叫", desc: "" },
          { icon: History20Regular, name: "通话记录", desc: "" },
          { icon: Mail20Regular, name: "电子邮件", desc: "" },
          { icon: TaskListSquareLtr20Regular, name: "任务", desc: "" },
          { icon: Chat20Regular, name: "消息", desc: "" },
          { icon: RadioButton20Regular, name: "无线收发器", desc: "" },
          { icon: Connector20Regular, name: "其他设备", desc: "" },
          { icon: Apps20Regular, name: "应用诊断", desc: "" },
          { icon: ArrowDownload20Regular, name: "自动文件下载", desc: "" },
          { icon: Document20Regular, name: "文档", desc: "" },
          { icon: Folder20Regular, name: "下载文件夹", desc: "" },
          { icon: MusicNote120Regular, name: "音乐库", desc: "" },
          { icon: Image20Regular, name: "图片", desc: "" },
          { icon: VideoClip20Regular, name: "视频", desc: "" },
          { icon: ContentViewGallery20Regular, name: "文件系统", desc: "" },
          { icon: BorderAll20Regular, name: "屏幕截图边框", desc: "" },
          { icon: Screenshot20Regular, name: "屏幕截图和应用", desc: "" },
        ],
      },
    ],
  },
  {
    icon: Cut20Regular,
    name: "Windows 更新",
    children: [
      {
        title: "更多选项",
        itemList: [
          { icon: Pause20Regular, name: "暂停更新", desc: "" },
          { icon: History20Regular, name: "更新历史记录", desc: "" },
          { icon: Settings20Regular, name: "高级选项", desc: "传递优化、可选更新、活跃时间以及其他更新设置" },
          { icon: Rocket20Regular, name: "Windows 预览体验计划", desc: "获取 Windows 的预览版本，以分享有关新功能和更新的反馈" },
        ],
      },
    ],
  },
];
