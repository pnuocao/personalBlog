# viewport的作用和配置

## 什么是 Viewport

Viewport（视口）是用户在浏览器中看到的区域。在移动设备上，视口与物理屏幕可能不同，因此需要通过 meta 标签进行配置。

## Viewport Meta 标签

### 标准配置

```html
<meta name="viewport" 
      content="width=device-width, 
               initial-scale=1.0,
               maximum-scale=5.0,
               minimum-scale=0.5,
               user-scalable=yes">
```

## 关键参数说明

### 1. width

```html
<!-- 设置视口宽度为设备宽度 -->
<meta name="viewport" content="width=device-width">

<!-- 设置固定宽度 -->
<meta name="viewport" content="width=980">

<!-- 通常使用 device-width -->
<meta name="viewport" content="width=device-width">
```

### 2. initial-scale

```html
<!-- 初始缩放比例为 1:1 -->
<meta name="viewport" content="initial-scale=1.0">

<!-- 2.0 表示放大 200% -->
<meta name="viewport" content="initial-scale=2.0">

<!-- 0.5 表示缩小 50% -->
<meta name="viewport" content="initial-scale=0.5">
```

### 3. maximum-scale / minimum-scale

```html
<!-- 最大缩放比例 -->
<meta name="viewport" content="maximum-scale=3.0">

<!-- 最小缩放比例 -->
<meta name="viewport" content="minimum-scale=0.5">

<!-- 禁用用户缩放 -->
<meta name="viewport" 
      content="maximum-scale=1.0, minimum-scale=1.0">
```

### 4. user-scalable

```html
<!-- 允许用户缩放 -->
<meta name="viewport" content="user-scalable=yes">

<!-- 禁止用户缩放 -->
<meta name="viewport" content="user-scalable=no">
```

## 常见配置方案

### 方案 1：标准移动响应式

```html
<meta name="viewport" 
      content="width=device-width, initial-scale=1.0">
```

**作用：**
- ✅ 视口宽度等于设备宽度
- ✅ 初始不缩放
- ✅ 允许用户缩放

**适用：** 大多数现代网站

### 方案 2：禁止用户缩放

```html
<meta name="viewport" 
      content="width=device-width, 
               initial-scale=1.0, 
               maximum-scale=1.0, 
               minimum-scale=1.0,
               user-scalable=no">
```

**作用：**
- ✅ 固定在 1:1 缩放比例
- ✅ 移除 300ms 延迟（参考 300ms 延迟文档）
- ✅ 防止缩放导致布局混乱

**适用：** 游戏、应用程序

### 方案 3：允许一定范围的缩放

```html
<meta name="viewport" 
      content="width=device-width, 
               initial-scale=1.0,
               maximum-scale=5.0,
               minimum-scale=0.5">
```

**作用：**
- ✅ 允许用户缩放到 0.5x - 5x
- ✅ 保留灵活性

**适用：** 阅读类应用

### 方案 4：iOS 独特配置

```html
<!-- 针对 iOS Safari -->
<meta name="viewport" 
      content="width=device-width, 
               initial-scale=1.0,
               viewport-fit=cover">

<!-- iOS 避免工具栏变化 -->
<meta name="viewport" 
      content="width=device-width, 
               initial-scale=1.0,
               viewport-fit=cover,
               user-scalable=no">
```

## Viewport 的工作原理

### 移动设备屏幕宽度

```
物理屏幕宽度：375px（iPhone）

不设置 viewport：
  -> 浏览器默认视口宽度 980px
  -> 页面被缩小到 375px 显示
  -> 文字太小，需要手动放大

设置 viewport=device-width：
  -> 视口宽度 375px
  -> 页面以 1:1 显示
  -> 文字清晰，无需放大
```

### 缩放原理

```
initial-scale=1.0 表示：
  1px CSS = 1px 逻辑像素

initial-scale=2.0 表示：
  1px CSS = 2px 逻辑像素（放大）

initial-scale=0.5 表示：
  1px CSS = 0.5px 逻辑像素（缩小）
```

## 特殊配置

### 安全区域适配（iPhone X 及以上）

```html
<!-- viewport-fit 参数 -->
<meta name="viewport" 
      content="width=device-width, 
               initial-scale=1.0,
               viewport-fit=cover">

<!-- viewport-fit 选项：
  auto - 不处理 safe area（默认）
  cover - 延伸到屏幕边缘
-->
```

CSS 中使用：

```css
/* 为刘海屏留出空间 */
body {
  padding-top: max(20px, env(safe-area-inset-top));
  padding-left: max(20px, env(safe-area-inset-left));
  padding-right: max(20px, env(safe-area-inset-right));
  padding-bottom: max(20px, env(safe-area-inset-bottom));
}
```

### 颜色方案

```html
<!-- 深色模式支持 -->
<meta name="theme-color" content="#fff">
<meta name="color-scheme" content="light dark">
```

### 格式化

```html
<!-- 防止电话号码被转换为链接 -->
<meta name="format-detection" content="telephone=no">

<!-- 允许电话号码链接 -->
<meta name="format-detection" content="telephone=yes">
```

## 完整的现代 Viewport 配置

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  
  <!-- 基础 Viewport 配置 -->
  <meta name="viewport" 
        content="width=device-width, 
                 initial-scale=1.0,
                 maximum-scale=5.0,
                 minimum-scale=0.5,
                 viewport-fit=cover,
                 user-scalable=yes">
  
  <!-- 主题颜色 -->
  <meta name="theme-color" content="#007bff">
  
  <!-- 颜色方案 -->
  <meta name="color-scheme" content="light dark">
  
  <!-- 格式检测 -->
  <meta name="format-detection" content="telephone=no">
  
  <!-- iOS 特定配置 -->
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="App Title">
  
  <!-- 其他重要元标签 -->
  <meta name="description" content="页面描述">
  <meta name="keywords" content="关键词">
  
  <style>
    /* 处理安全区域 */
    body {
      padding-left: env(safe-area-inset-left);
      padding-right: env(safe-area-inset-right);
      padding-top: env(safe-area-inset-top);
      padding-bottom: env(safe-area-inset-bottom);
    }
  </style>
</head>
<body>
  <!-- 内容 -->
</body>
</html>
```

## Viewport 的常见问题

### Q1：为什么页面显示太小？

**A：** 很可能没有设置 viewport meta 标签

```html
<!-- 添加这一行 -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

### Q2：为什么禁止缩放后用户反馈不好？

**A：** 用户可能需要放大看清细节

```html
<!-- 使用折中方案 -->
<meta name="viewport" 
      content="width=device-width, 
               initial-scale=1.0,
               maximum-scale=3.0,
               user-scalable=yes">
```

### Q3：iPhone X 刘海屏如何处理？

**A：** 使用 viewport-fit 和 env()

```html
<meta name="viewport" 
      content="viewport-fit=cover">

<style>
  body {
    padding-top: env(safe-area-inset-top);
  }
</style>
```

## Viewport 与响应式的关系

```
没有 viewport：
  页面默认 980px 宽
  -> 被压缩显示在 375px 屏幕上
  -> 文字太小
  -> 媒体查询不生效

有 viewport：
  页面 375px 宽
  -> 在 375px 屏幕上正常显示
  -> 媒体查询生效
  -> 响应式设计才能工作
```

## 浏览器兼容性

| 特性 | 兼容性 |
|-----|-------|
| 基础 viewport | iOS 3.2+, Android 2.3+ |
| viewport-fit | iOS 11.2+ |
| env() 函数 | iOS 11.2+, Chrome 69+ |
| color-scheme | Chrome 76+, Safari 12.1+ |

## 最佳实践

### ✅ 推荐

```html
<!-- 现代标准配置 -->
<meta name="viewport" 
      content="width=device-width, 
               initial-scale=1.0">
```

### ✅ 对于应用

```html
<!-- 应用程序配置 -->
<meta name="viewport" 
      content="width=device-width, 
               initial-scale=1.0,
               maximum-scale=1.0,
               minimum-scale=1.0,
               user-scalable=no,
               viewport-fit=cover">
```

### ✅ 对于内容

```html
<!-- 内容网站配置 -->
<meta name="viewport" 
      content="width=device-width, 
               initial-scale=1.0,
               maximum-scale=5.0">
```

## 总结

Viewport 是移动端开发的基础，正确的配置使得：
- ✅ 响应式设计生效
- ✅ 文字清晰易读
- ✅ 提供良好用户体验
- ✅ 媒体查询工作正常
