export const sidebar = {
  // 面试合集--手写JS系列
  "/pages/write-by-Hand/": [
    {
      text: "手写JS", // 必要的
      items: [
        { link: "/pages/write-by-Hand/debounce", text: "防抖函数" },
        { link: "/pages/write-by-Hand/throttle", text: "节流函数" },
        {
          link: "/pages/write-by-Hand/eventEmitter",
          text: "事件总线-发布订阅模式",
        },
      ],
    },
  ],
  // 面试合集--CSS专题
  "/pages/css/": [
    {
      text: "CSS专题",
      items: [
        {
          text: "CSS基础",
          collapsed: false,
          items: [
            { link: "/pages/css/import-and-priority", text: "CSS引入方式与优先级" },
            { link: "/pages/css/selectors", text: "CSS选择器与优先级" },
            { link: "/pages/css/inherited-properties", text: "CSS继承属性" },
            { link: "/pages/css/display", text: "display 属性与元素隐藏" },
            { link: "/pages/css/pseudo", text: "伪类与伪元素" },
            { link: "/pages/css/units", text: "CSS单位详解" },
          ],
        },
        {
          text: "CSS盒模型",
          collapsed: false,
          items: [
            { link: "/pages/css/box-model", text: "CSS 盒模型" },
            { link: "/pages/css/margin-collapse", text: "Margin 塌陷问题" },
            { link: "/pages/css/percentage", text: "百分比计算" },
            { link: "/pages/css/clear-float", text: "清除浮动" },
          ],
        },
        {
          text: "Flex 布局",
          collapsed: false,
          items: [
            { link: "/pages/css/flex-layout", text: "Flex 布局原理与实践" },
            { link: "/pages/css/flex-one", text: "flex:1 完全指南" },
          ],
        },
        {
          text: "性能优化",
          collapsed: false,
          items: [
            { link: "/pages/css/css-performance-optimization", text: "CSS 性能优化综合指南" },
            { link: "/pages/css/reflow-repaint", text: "减少重排和重绘" },
            { link: "/pages/css/critical-css", text: "关键 CSS（Critical CSS）" },
            { link: "/pages/css/animation-performance", text: "CSS 动画性能优化" },
            { link: "/pages/css/compression-and-merge", text: "CSS 压缩和合并" },
          ],
        },
      ],
    },
  ],
};
