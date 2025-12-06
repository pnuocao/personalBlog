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
          ],
        },
      ],
    },
  ],
};
