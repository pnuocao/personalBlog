import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Pinocao",
  description: "Pinocao's Blog",
  head: [
    ["link", { rel: "icon", href: "/avatar.png" }], //浏览器的标签栏的网页图标
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: "/avatar.png",
    search: {
      provider: "local",
    },
    // 更新配置
    lastUpdated: {
      text: "更新于",
      formatOptions: {
        dateStyle: "full",
        timeStyle: "medium",
      },
    },
    // 文档页脚配置
    docFooter: {
      prev: "上一篇",
      next: "下一篇",
    },
    nav: [
      { text: "首页", link: "/" },
      {
        text: "前端面试合集",
        items: [
          {
            text: "代码手写",
            link: "/pages/write-by-Hand/debounce.md",
          },
        ],
      },
    ],
    // sidebar: [
    //   {
    //     text: "Examples",
    //     items: [
    //       { text: "Markdown Examples", link: "/markdown-examples" },
    //       { text: "Runtime API Examples", link: "/api-examples" },
    //     ],
    //   },
    //   {
    //     text: "222",
    //     items: [
    //       { text: "Markdown Examples", link: "/pages/writeByHand/debounce" },
    //     ],
    //   },
    // ],
    sidebar: {
      "/pages/writeByHand/": [
        {
          text: "手写系列", // 必要的
          items: [{ link: "/pages/writeByHand/index.md", text: "手写题" }],
        },
      ],
    },
    socialLinks: [
      { icon: "github", link: "https://github.com/pnuocao/personalBlog" },
    ],
    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2024-present pinocao  粤ICP备2024272493号 ",
    },
  },
});
