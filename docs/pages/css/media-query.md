# 媒体查询的使用方法

## 什么是媒体查询

媒体查询（Media Query）是 CSS3 中引入的功能，用于根据不同的设备特性（如屏幕宽度、高度、方向等）应用不同的样式。

```css
@media (condition) {
  /* 当条件为真时，应用这些样式 */
}
```

---

## 基础语法

### 完整语法

```css
@media media_type and (media_feature) {
  /* 样式 */
}

@media media_type and (media_feature) and (media_feature) {
  /* 当多个条件都满足时 */
}

@media media_type or (media_feature) {
  /* 当任意条件满足时（CSS4） */
}
```

### 在 HTML 中使用

```html
<!-- 方式1：在 link 标签中 -->
<link rel="stylesheet" media="(max-width: 600px)" href="mobile.css">

<!-- 方式2：在 style 标签中 -->
<style>
  @media (max-width: 600px) {
    body { font-size: 14px; }
  }
</style>

<!-- 方式3：在 CSS 文件中 -->
/* styles.css */
@media (max-width: 600px) {
  body { font-size: 14px; }
}
```

---

## 媒体类型（Media Types）

```css
/* all - 所有设备（默认） */
@media all { }

/* screen - 屏幕设备 */
@media screen { }

/* print - 打印机 */
@media print { }

/* speech - 屏幕阅读器 */
@media speech { }
```

### 常见组合

```css
/* 仅在屏幕上应用 */
@media screen {
  body { background: white; }
}

/* 仅在打印时应用 */
@media print {
  body { color: black; }
  .no-print { display: none; }
}
```

---

## 媒体特性（Media Features）

### 1. 宽度相关

```css
/* 精确宽度 */
@media (width: 768px) { }

/* 最大宽度 */
@media (max-width: 768px) { }

/* 最小宽度 */
@media (min-width: 768px) { }

/* 宽度范围（CSS4） */
@media (768px <= width <= 1024px) { }
```

### 2. 高度相关

```css
@media (height: 1024px) { }
@media (max-height: 600px) { }
@media (min-height: 600px) { }
```

### 3. 方向

```css
/* 竖屏 */
@media (orientation: portrait) {
  /* 宽度 <= 高度 */
}

/* 横屏 */
@media (orientation: landscape) {
  /* 宽度 > 高度 */
}
```

### 4. 设备像素比

```css
/* 标准屏幕（1x） */
@media (resolution: 96dpi) { }

/* 高清屏（2x） */
@media (-webkit-min-device-pixel-ratio: 2) { }
@media (min-resolution: 192dpi) { }

/* 超清屏（3x） */
@media (-webkit-min-device-pixel-ratio: 3) { }
@media (min-resolution: 288dpi) { }
```

### 5. 颜色

```css
/* 彩色屏幕 */
@media (color) { }

/* 单色屏幕 */
@media (monochrome) { }

/* 颜色深度 */
@media (color-gamut: srgb) { }
```

### 6. 指针设备

```css
/* 有精确指针（鼠标） */
@media (pointer: fine) { }

/* 粗指针（触屏） */
@media (pointer: coarse) { }

/* 没有指针 */
@media (pointer: none) { }

/* 可以悬停 */
@media (hover: hover) { }

/* 不能悬停（触屏） */
@media (hover: none) { }
```

### 7. 亮度模式

```css
/* 浅色模式 */
@media (prefers-color-scheme: light) { }

/* 深色模式 */
@media (prefers-color-scheme: dark) { }
```

### 8. 其他特性

```css
/* 是否显示辅助技术 */
@media (prefers-reduced-motion: no-preference) { }
@media (prefers-reduced-motion: reduce) { }

/* 透明度 */
@media (prefers-contrast: more) { }

/* 强制颜色 */
@media (forced-colors: active) { }
```

---

## 常见断点设置

### 标准断点（Bootstrap 风格）

```css
/* 超小屏幕（手机竖屏） */
@media (max-width: 575px) { }

/* 小屏幕（手机横屏） */
@media (min-width: 576px) and (max-width: 767px) { }

/* 中等屏幕（平板竖屏） */
@media (min-width: 768px) and (max-width: 991px) { }

/* 大屏幕（平板横屏、小笔记本） */
@media (min-width: 992px) and (max-width: 1199px) { }

/* 特大屏幕（桌面、大屏） */
@media (min-width: 1200px) { }

/* 超大屏幕（4K） */
@media (min-width: 1920px) { }
```

### 移动优先断点

```css
/* 默认 - 手机样式 */
body { font-size: 14px; }

/* 平板及以上 */
@media (min-width: 768px) {
  body { font-size: 16px; }
}

/* 桌面及以上 */
@media (min-width: 1024px) {
  body { font-size: 18px; }
}

/* 超大屏及以上 */
@media (min-width: 1440px) {
  body { font-size: 20px; }
}
```

---

## 实战示例

### 响应式布局

```css
/* 手机版 - 单列布局 */
.container {
  display: block;
}

.sidebar {
  width: 100%;
  margin-bottom: 20px;
}

.main {
  width: 100%;
}

/* 平板版 - 两列布局 */
@media (min-width: 768px) {
  .container {
    display: flex;
    gap: 20px;
  }
  
  .sidebar {
    width: 30%;
    margin-bottom: 0;
  }
  
  .main {
    width: 70%;
  }
}

/* 桌面版 - 三列布局 */
@media (min-width: 1024px) {
  .aside-left {
    width: 20%;
  }
  
  .main {
    width: 60%;
  }
  
  .sidebar {
    width: 20%;
  }
}
```

### 响应式字体

```css
/* 基础字体大小 */
body {
  font-size: 14px;
  line-height: 1.5;
}

h1 {
  font-size: 24px;
}

h2 {
  font-size: 20px;
}

/* 平板优化 */
@media (min-width: 768px) {
  body {
    font-size: 16px;
  }
  
  h1 {
    font-size: 32px;
  }
  
  h2 {
    font-size: 24px;
  }
}

/* 桌面优化 */
@media (min-width: 1024px) {
  body {
    font-size: 18px;
  }
  
  h1 {
    font-size: 40px;
  }
  
  h2 {
    font-size: 28px;
  }
}
```

### 响应式网格

```css
/* 手机 - 1列 */
.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

/* 平板 - 2列 */
@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* 桌面 - 3列 */
@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* 超大屏 - 4列 */
@media (min-width: 1440px) {
  .grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

### 触屏设备优化

```css
/* 桌面（鼠标） */
@media (hover: hover) and (pointer: fine) {
  .button:hover {
    background-color: #0056b3;
    transform: scale(1.05);
  }
}

/* 触屏设备 */
@media (hover: none) and (pointer: coarse) {
  .button {
    /* 增加点击区域 */
    min-height: 44px;
    min-width: 44px;
    
    /* 去掉 hover 效果，改用 active */
  }
  
  .button:active {
    background-color: #0056b3;
  }
}
```

### 深色模式支持

```css
/* 浅色模式 */
:root {
  --bg-color: white;
  --text-color: black;
  --border-color: #ddd;
}

body {
  background-color: var(--bg-color);
  color: var(--text-color);
}

/* 深色模式 */
@media (prefers-color-scheme: dark) {
  :root {
    --bg-color: #1a1a1a;
    --text-color: #f0f0f0;
    --border-color: #444;
  }
}
```

### 打印优化

```css
/* 屏幕显示 */
.no-print {
  display: block;
}

.header {
  background: blue;
  color: white;
}

/* 打印模式 */
@media print {
  /* 隐藏不需要打印的元素 */
  .no-print,
  .navbar,
  .sidebar {
    display: none;
  }
  
  /* 调整页面样式 */
  body {
    font-size: 12pt;
    color: black;
  }
  
  .header {
    background: none;
    color: black;
    border: 1px solid black;
  }
  
  /* 避免分页符出现在这些元素内 */
  .section {
    page-break-inside: avoid;
  }
}
```

---

## 高级技巧

### 1. 多条件组合

```css
/* 同时满足多个条件（AND） */
@media (min-width: 768px) and (max-width: 1024px) and (orientation: landscape) {
  /* 平板横屏 */
}

/* 满足多个条件中的一个（OR） - CSS4 */
@media (768px <= width <= 1024px) or (orientation: portrait) {
  /* ... */
}

/* 负值判断 */
@media not (max-width: 500px) {
  /* 宽度大于 500px */
}
```

### 2. 使用 CSS 变量简化

```css
:root {
  /* 定义断点变量 */
  --mobile-width: 576px;
  --tablet-width: 768px;
  --desktop-width: 1024px;
}

@media (max-width: 576px) { }
@media (min-width: 768px) { }
@media (min-width: 1024px) { }
```

### 3. SCSS 混入

```scss
// 定义 mixin
@mixin respond-to($breakpoint) {
  @if $breakpoint == 'mobile' {
    @media (max-width: 575px) { @content; }
  }
  @else if $breakpoint == 'tablet' {
    @media (min-width: 576px) and (max-width: 767px) { @content; }
  }
  @else if $breakpoint == 'desktop' {
    @media (min-width: 768px) { @content; }
  }
}

// 使用
.container {
  width: 100%;
  
  @include respond-to('tablet') {
    width: 750px;
  }
  
  @include respond-to('desktop') {
    width: 1000px;
  }
}
```

### 4. JavaScript 与媒体查询

```javascript
// 检查媒体查询是否匹配
const isMobile = window.matchMedia('(max-width: 768px)').matches;

// 监听媒体查询变化
const mediaQuery = window.matchMedia('(max-width: 768px)');
mediaQuery.addEventListener('change', (e) => {
  if (e.matches) {
    console.log('变为手机尺寸');
  } else {
    console.log('变为桌面尺寸');
  }
});
```

---

## 浏览器支持

| 特性 | 支持情况 |
|-----|--------|
| 基础媒体查询 | IE 9+ |
| 高级媒体特性 | 现代浏览器 |
| `prefers-color-scheme` | Chrome 76+, Safari 12.1+ |
| `prefers-reduced-motion` | Chrome 63+, Safari 10.1+ |
| CSS4 范围语法 | Chrome 104+, Safari 15.4+ |

---

## 最佳实践

### ✅ 推荐做法

1. **采用移动优先策略**
```css
/* 先写手机样式 */
body { font-size: 14px; }

/* 再用媒体查询添加更大屏幕的样式 */
@media (min-width: 768px) {
  body { font-size: 16px; }
}
```

2. **使用 min-width 而不是 max-width**
```css
/* 好 */
@media (min-width: 768px) { }

/* 避免 */
@media (max-width: 767px) { }
```

3. **使用合理的断点**
```css
@media (min-width: 576px) { }  /* 手机横屏 */
@media (min-width: 768px) { }  /* 平板 */
@media (min-width: 1024px) { } /* 桌面 */
@media (min-width: 1440px) { } /* 超大屏 */
```

### ❌ 避免做法

1. **过多的断点**
```css
/* 不要创建太多的断点 */
@media (min-width: 360px) { }
@media (min-width: 380px) { }
@media (min-width: 400px) { }
/* ... */
```

2. **混乱的嵌套**
```css
/* 避免复杂的嵌套 */
@media screen and (orientation: landscape) and (max-width: 900px) and (-webkit-min-device-pixel-ratio: 2) {
  /* 这太复杂了 */
}
```

---

## 完整响应式模板

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    /* 基础样式 - 手机 */
    body {
      font-size: 14px;
      line-height: 1.6;
      color: #333;
    }
    
    .container {
      width: 100%;
      padding: 0 15px;
    }
    
    .header {
      height: 60px;
      background: #007bff;
      color: white;
      display: flex;
      align-items: center;
    }
    
    .grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 20px;
    }
    
    /* 平板 */
    @media (min-width: 768px) {
      body {
        font-size: 16px;
      }
      
      .container {
        max-width: 720px;
        margin: 0 auto;
      }
      
      .grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    
    /* 桌面 */
    @media (min-width: 1024px) {
      body {
        font-size: 18px;
      }
      
      .container {
        max-width: 960px;
      }
      
      .grid {
        grid-template-columns: repeat(3, 1fr);
      }
      
      /* 桌面有 hover 效果 */
      .card:hover {
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      }
    }
    
    /* 触屏设备 */
    @media (hover: none) and (pointer: coarse) {
      .button {
        min-height: 44px;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="container">Header</div>
  </div>
  
  <div class="container">
    <div class="grid">
      <div class="card">Item 1</div>
      <div class="card">Item 2</div>
      <div class="card">Item 3</div>
    </div>
  </div>
</body>
</html>
```

---

## 总结

媒体查询是响应式设计的核心工具，通过合理使用可以创建适配各种设备的高质量网站。记住以下要点：

1. **使用移动优先策略**
2. **选择合理的断点**
3. **测试各种设备**
4. **考虑无障碍访问**
5. **优化性能**
