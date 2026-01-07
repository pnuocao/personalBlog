# 移动端适配方案有哪些

## 概述

移动端适配是指使网站和应用在不同屏幕尺寸和设备上都能正常显示和使用。由于移动设备的多样性（屏幕尺寸、分辨率、像素密度等），我们需要采用多种适配方案来解决这些问题。

## 1. 像素概念理解

### 物理像素 vs 逻辑像素

```
物理像素（Physical Pixel）：
- 屏幕实际拥有的最小发光单位
- 是固定不变的
- 例如：iPhone 12 Pro 屏幕有 1170 × 2532 个物理像素

逻辑像素（Logical Pixel / CSS Pixel）：
- CSS 中使用的像素单位
- 是可变的，根据像素密度变化
- 例如：iPhone 12 Pro 的逻辑像素是 390 × 844
```

### 设备像素比（DPR / Device Pixel Ratio）

```javascript
// 设备像素比 = 物理像素 / 逻辑像素
const dpr = window.devicePixelRatio;
console.log(dpr); // iPhone 12: 3, 普通手机: 2, PC: 1
```

## 2. Viewport 视口适配

### Meta Viewport 标签

```html
<!-- 标准设置 -->
<meta name="viewport" 
      content="width=device-width, 
               initial-scale=1.0,
               maximum-scale=1.0,
               minimum-scale=1.0,
               user-scalable=no">
```

**关键参数说明：**
- `width=device-width`：视口宽度等于设备宽度
- `initial-scale=1.0`：初始缩放比为1:1
- `maximum-scale=1.0`：最大缩放比
- `minimum-scale=1.0`：最小缩放比
- `user-scalable=no`：禁用用户缩放

## 3. 流式布局（Fluid Layout）

### 百分比布局

```css
/* 使用百分比替代固定宽度 */
.container {
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.main {
  width: 100%;
}

.sidebar {
  width: 100%;
}

@media (min-width: 768px) {
  .main {
    width: 70%;
    float: left;
  }
  
  .sidebar {
    width: 30%;
    float: right;
  }
}
```

### Flexbox 布局

```css
.container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.item {
  flex: 1;
  min-width: 250px;
}

@media (max-width: 480px) {
  .item {
    min-width: 100%;
  }
}
```

### Grid 布局

```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}
```

## 4. 媒体查询（Media Query）

### 常见断点设置

```css
/* 手机竖屏 */
@media (max-width: 480px) {
  /* 样式 */
}

/* 手机横屏 */
@media (max-width: 768px) {
  /* 样式 */
}

/* 平板 */
@media (min-width: 768px) and (max-width: 1024px) {
  /* 样式 */
}

/* 桌面 */
@media (min-width: 1024px) {
  /* 样式 */
}
```

### 其他媒体查询特性

```css
/* 检测屏幕方向 */
@media (orientation: portrait) { /* 竖屏 */ }
@media (orientation: landscape) { /* 横屏 */ }

/* 检测设备像素比 */
@media (-webkit-min-device-pixel-ratio: 2) { /* 高清屏 */ }

/* 检测触屏设备 */
@media (hover: none) and (pointer: coarse) { /* 触屏 */ }
```

## 5. REM 适配方案

### 原理

```javascript
// 根据屏幕宽度动态计算 rem 基准值
function setRemUnit() {
  const docEl = document.documentElement;
  const clientWidth = docEl.clientWidth;
  
  // 通常设计稿宽度为 375px，设置 100px = 1rem
  const rem = (clientWidth / 375) * 100;
  docEl.style.fontSize = rem + 'px';
}

// 初始化和监听窗口变化
setRemUnit();
window.addEventListener('resize', setRemUnit);
```

### 使用示例

```css
/* 假设 1rem = 100px */
body {
  font-size: 16px; /* 0.16rem */
}

.container {
  width: 3.75rem; /* 375px */
  padding: 0.2rem; /* 20px */
  margin-bottom: 0.3rem; /* 30px */
}

.button {
  height: 0.44rem; /* 44px */
  font-size: 0.14rem; /* 14px */
}
```

## 6. VW/VH 适配方案

### 视口单位

```css
/* 1vw = 视口宽度的1% */
/* 1vh = 视口高度的1% */
/* 1vmin = 较小的那个（宽或高）的1% */
/* 1vmax = 较大的那个（宽或高）的1% */

.fullscreen {
  width: 100vw;
  height: 100vh;
}

.container {
  width: 90vw;
  max-width: 1200px;
  margin: 0 auto;
}

/* 响应式字体 */
.title {
  font-size: clamp(20px, 5vw, 40px);
}
```

### Flexible 库方案

```html
<!-- 使用 flexible.js 库 -->
<script src="http://g.tbcdn.cn/mtb/lib-flexible/0.3.4/flexible.js"></script>

<!-- 之后就可以使用 rem 单位 -->
```

```javascript
// flexible 的核心逻辑
(function(win, lib) {
  var doc = win.document;
  var docEl = doc.documentElement;
  
  var resizeEvt = 'orientationchange' in win ? 'orientationchange' : 'resize';
  var recalc = function() {
    var clientWidth = docEl.clientWidth;
    if (!clientWidth) return;
    docEl.style.fontSize = 20 * (clientWidth / 375) + 'px';
  };
  
  if (doc.addEventListener) {
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
  }
}(window));
```

## 7. 百分比 + 媒体查询混合方案

```css
/* 基础样式 */
.header {
  width: 100%;
  height: 60px;
  padding: 10px;
  box-sizing: border-box;
}

.nav {
  display: flex;
  justify-content: space-around;
}

.nav-item {
  flex: 1;
  text-align: center;
  padding: 10px;
}

/* 手机适配 */
@media (max-width: 480px) {
  .header {
    height: 50px;
    padding: 5px;
  }
  
  .nav-item {
    font-size: 12px;
  }
}

/* 平板适配 */
@media (min-width: 481px) and (max-width: 1024px) {
  .header {
    height: 60px;
  }
  
  .nav-item {
    font-size: 14px;
  }
}

/* 桌面适配 */
@media (min-width: 1025px) {
  .header {
    height: 80px;
  }
  
  .nav-item {
    font-size: 16px;
  }
}
```

## 8. 响应式图片

### srcset 方案

```html
<!-- 根据屏幕宽度加载不同大小的图片 -->
<img
  srcset="small.jpg 480w, medium.jpg 768w, large.jpg 1200w"
  sizes="(max-width: 480px) 100vw,
         (max-width: 768px) 50vw,
         100vw"
  src="medium.jpg"
  alt="responsive image">
```

### Picture 标签

```html
<picture>
  <source media="(max-width: 480px)" srcset="mobile.jpg">
  <source media="(max-width: 768px)" srcset="tablet.jpg">
  <source media="(min-width: 769px)" srcset="desktop.jpg">
  <img src="desktop.jpg" alt="fallback">
</picture>
```

## 9. 适配方案选择指南

| 方案 | 优点 | 缺点 | 适用场景 |
|-----|-----|-----|--------|
| **流式布局** | 简单、易维护 | 灵活性有限 | 简单页面 |
| **媒体查询** | 强大、灵活 | 断点设置麻烦 | 中等复杂页面 |
| **REM方案** | 全局适配、易扩展 | 需要JS脚本 | 复杂应用 |
| **VW/VH方案** | 原生支持、不需JS | 浏览器兼容性 | 现代浏览器应用 |
| **混合方案** | 综合优势明显 | 实现复杂 | 大型项目 |

## 10. 实战最佳实践

### 完整适配模板

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" 
        content="width=device-width, 
                 initial-scale=1.0,
                 viewport-fit=cover">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    html {
      font-size: 16px;
    }
    
    @media (max-width: 480px) {
      html {
        font-size: 14px;
      }
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
    }
    
    .container {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }
    
    @media (max-width: 480px) {
      .container {
        padding: 0 0.5rem;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- 内容 -->
  </div>
</body>
</html>
```

## 总结

现代移动端适配的最佳实践是：

1. **必须设置 viewport 元标签**
2. **使用流式布局作为基础**
3. **结合媒体查询进行微调**
4. **对于复杂应用考虑使用 REM 或 VW/VH**
5. **使用响应式图片减少带宽**
6. **充分测试不同设备和屏幕尺寸**
