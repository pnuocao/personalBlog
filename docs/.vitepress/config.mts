import { defineConfig } from "vitepress";
import { sidebar } from "./configs";

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
            text: "JS手写",
            link: "/pages/write-by-Hand/debounce.md",
          },
        ],
      },
    ],
    sidebar,
    socialLinks: [
      { icon: "github", link: "https://github.com/pnuocao/personalBlog" },
    ],
    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2024-present pinocao  粤ICP备2024272493号 ",
    },
  },
});
