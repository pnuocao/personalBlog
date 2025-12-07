# CSS 性能优化综合指南

## 概念定义

CSS 性能优化是指通过减少浏览器的解析、渲染和绘制成本，提升页面加载速度和运行时帧率的一系列策略和实践。CSS 虽然不阻塞 HTML 解析（异步加载时），但会阻塞页面渲染，因此 CSS 性能优化对整体页面性能有显著影响。

## 核心优化策略

### 1. 选择器性能

#### 关键概念
CSS 选择器的性能从右到左匹配，浏览器需要评估每个元素是否匹配选择器。

#### 实践经验
在大型项目中，选择器性能虽不是主要瓶颈，但规范写法能显著降低渲染时间。

#### 优化方案

**避免过深的选择器嵌套：**
```css
/* ❌ 不好：层级过深 */
.header .nav .list li a {
  color: #333;
}

/* ✅ 好：直接定位 */
.nav-link {
  color: #333;
}
```

**避免使用通用选择器：**
```css
/* ❌ 不好：对所有元素评估 */
* {
  margin: 0;
  padding: 0;
}

/* ✅ 好：明确指定 */
html, body, div, span {
  margin: 0;
  padding: 0;
}
```

**优先级顺序（从快到慢）：**
- ID 选择器：最快（#id）
- 类选择器：次快（.class）
- 标签选择器：较慢（div）
- 伪类/伪元素（:hover）
- 属性选择器（[type="text"]）
- 子选择器/相邻选择器（> 、+）
- 后代选择器（空格）：最慢

#### 性能考量
- 现代浏览器优化了选择器匹配，单个选择器性能差异微乎其微
- 真正的性能瓶颈通常在大量频繁匹配的场景
- 关键是保持代码的可维护性和可读性

---

### 2. 重排（Reflow）和重绘（Repaint）优化

#### 关键概念

**重排（Reflow）**
- 重新计算元素的几何属性（位置、大小）
- 影响文档流中的所有元素
- 成本高昂，会触发重新计算、布局和绘制

**重绘（Repaint）**
- 只更新元素的外观（颜色、阴影等）
- 不影响布局，成本较低
- 必然引发重绘的属性不需要重排

#### 触发重排的属性
```javascript
// 获取尺寸相关属性会强制同步重排
const height = element.offsetHeight;
const width = element.clientWidth;
const rect = element.getBoundingClientRect();

// 修改这些属性会触发重排
element.style.width = '100px';     // width
element.style.height = '100px';    // height
element.style.left = '10px';       // position
element.style.display = 'block';   // display
element.style.padding = '10px';    // padding
element.style.margin = '10px';     // margin
element.style.border = '1px';      // border
```

#### 优化实践

**批量 DOM 操作：**
```javascript
/* ❌ 不好：多次触发重排 */
const element = document.getElementById('app');
element.style.width = '100px';
element.style.height = '100px';
element.style.backgroundColor = 'red';
// 上面每一行都可能触发重排

/* ✅ 好：使用 cssText 或类 */
// 方法1：cssText 一次性修改
element.style.cssText = 'width: 100px; height: 100px; background-color: red;';

// 方法2：修改类名
element.classList.add('active');
// CSS 中定义
// .active { width: 100px; height: 100px; background-color: red; }

// 方法3：使用 DocumentFragment
const fragment = document.createDocumentFragment();
for (let i = 0; i < 1000; i++) {
  const div = document.createElement('div');
  fragment.appendChild(div);
}
document.body.appendChild(fragment); // 只触发一次重排
```

**缓存计算结果：**
```javascript
/* ❌ 不好：多次触发同步重排 */
for (let i = 0; i < 1000; i++) {
  element.style.height = element.offsetHeight + 10 + 'px';
  // 每次循环都读取 offsetHeight，每次都触发重排
}

/* ✅ 好：缓存计算值 */
let height = element.offsetHeight;
for (let i = 0; i < 1000; i++) {
  height += 10;
  element.style.height = height + 'px';
}
```

**使用 CSS transforms 和 opacity：**
```css
/* ❌ 会触发重排 */
.animate-bad {
  animation: slide-bad 1s;
}

@keyframes slide-bad {
  from { left: 0; }
  to { left: 100px; }
}

/* ✅ 只触发合成（Composite），不触发重排 */
.animate-good {
  animation: slide-good 1s;
}

@keyframes slide-good {
  from { transform: translateX(0); }
  to { transform: translateX(100px); }
}

/* ✅ 修改 opacity 也只触发合成 */
.fade {
  animation: fade 1s;
}

@keyframes fade {
  from { opacity: 1; }
  to { opacity: 0; }
}
```

#### 浏览器渲染管道
```
JavaScript → Style → Layout(重排) → Paint(重绘) → Composite
                                              ↓
                      transform/opacity 只走这里
```

---

### 3. 关键 CSS（Critical CSS）

#### 关键概念
关键 CSS 是指首屏（Above the Fold）所必需的样式，应内联到 HTML `<head>` 中，避免外部 CSS 文件加载阻塞渲染。

#### 实践场景
- 大型电商网站首屏加载优化
- 移动端性能敏感应用
- 弱网环境下的快速首屏呈现

#### 优化方案

**方案1：内联关键 CSS**
```html
<!DOCTYPE html>
<html>
<head>
  <!-- 内联关键 CSS，防止 FOUC（Flash of Unstyled Content） -->
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI'; }
    .header { background: #333; color: white; padding: 20px; }
    .hero { background: url('hero.jpg'); height: 500px; }
  </style>
  
  <!-- 非关键 CSS 异步加载 -->
  <link rel="preload" href="main.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="main.css"></noscript>
</head>
<body>
  <div class="header">...</div>
  <div class="hero">...</div>
</body>
</html>
```

**方案2：使用工具提取关键 CSS**
常用工具：
- `critical` - Node.js 库，自动提取关键 CSS
- `Penthouse` - Google 开源工具
- `gulp-critical` - Gulp 插件

```javascript
// 使用 critical 包
const critical = require('critical');

critical.generate({
  base: './',
  src: 'index.html',
  dest: 'index-critical.html',
  inline: true,
  minify: true,
  width: 1920,
  height: 1080
});
```

---

### 4. 动画性能优化

#### 关键概念
CSS 动画性能取决于使用的属性和浏览器的渲染管道优化。

#### 高性能属性

**最佳选择：**
```css
/* ✅ 只触发 Composite（合成），性能最好 */
.animate {
  animation: move 1s;
}

/* transform：直接在 GPU 上运算 */
@keyframes move {
  from { transform: translateX(0); }
  to { transform: translateX(100px); }
}

/* opacity：只改变透明度，无需重排/重绘 */
@keyframes fade {
  from { opacity: 1; }
  to { opacity: 0; }
}
```

**避免选择：**
```css
/* ❌ 触发重排 + 重绘 */
@keyframes bad-animate {
  from { left: 0; }           /* 重排 */
  to { left: 100px; }
}

@keyframes bad-animate2 {
  from { width: 100px; }      /* 重排 */
  to { width: 200px; }
}

@keyframes bad-animate3 {
  from { background: red; }   /* 重绘 */
  to { background: blue; }
}
```

#### 性能检测代码
```javascript
// 检测动画帧率
let lastTime = performance.now();
let frameCount = 0;

function checkPerformance() {
  const currentTime = performance.now();
  const deltaTime = currentTime - lastTime;
  
  if (deltaTime >= 1000) {
    const fps = frameCount;
    console.log(`FPS: ${fps}, Target: 60fps`);
    
    if (fps < 50) {
      console.warn('⚠️ 动画帧率过低，需要优化');
    }
    
    frameCount = 0;
    lastTime = currentTime;
  }
  frameCount++;
  requestAnimationFrame(checkPerformance);
}

checkPerformance();
```

---

### 5. CSS 文件优化

#### 加载策略

**1. 按需加载（按优先级）**
```html
<!-- 关键 CSS - 同步加载 -->
<link rel="stylesheet" href="critical.css">

<!-- 次要 CSS - 异步加载 -->
<link rel="preload" href="main.css" as="style" onload="this.rel='stylesheet'">

<!-- 低优先级 CSS - 延迟加载 -->
<link rel="preload" href="theme.css" as="style" onload="this.rel='stylesheet'">

<!-- 打印样式 - 按需加载 -->
<link rel="stylesheet" href="print.css" media="print">
```

**2. 代码分割**
```javascript
// Webpack 配置 - 按路由分割 CSS
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        styles: {
          name: 'styles',
          type: 'css/mini-extract',
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },
};
```

#### 压缩优化

**使用 PurgeCSS 移除未使用的 CSS**
```javascript
// postcss.config.js
const purgecss = require('@fullhuman/postcss-purgecss');

module.exports = {
  plugins: [
    purgecss({
      content: [
        './src/**/*.html',
        './src/**/*.vue',
        './src/**/*.jsx',
      ],
      whitelist: ['html', 'body'],
      defaultExtractor: content => content.match(/[A-Za-z0-9-_:/]+/g) || [],
    }),
  ],
};
```

---

### 6. 响应式设计性能

#### 媒体查询优化

```css
/* ❌ 加载所有媒体查询 */
@media (max-width: 768px) {
  .container { width: 100%; }
}

@media (max-width: 1024px) {
  .sidebar { display: none; }
}

/* ✅ 按优先级分离文件 */
/* mobile-first 策略 - 减少基础样式 */
.container { width: 100%; }

@media (min-width: 768px) {
  .container { width: 750px; }
}
```

#### 移动端首屏优化

```html
<!-- 1. 视口设置 -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">

<!-- 2. 预加载关键资源 -->
<link rel="preload" href="critical.css" as="style">

<!-- 3. DNS 预连接 -->
<link rel="dns-prefetch" href="//cdn.example.com">
<link rel="preconnect" href="//fonts.googleapis.com">
```

---

### 7. 字体加载性能

#### 关键问题：FOIT 和 FOUT
- **FOIT**（Flash of Invisible Text）：字体加载期间文本不可见
- **FOUT**（Flash of Unstyled Text）：字体加载期间显示降级字体

#### 优化方案

```css
/* 策略1：font-display 控制字体加载行为 */
@font-face {
  font-family: 'CustomFont';
  src: url('font.woff2') format('woff2');
  font-display: swap;  /* 立即显示降级字体，加载完替换 */
  /* 其他选项：auto | block | swap | fallback | optional */
}

/* 策略2：子集化 */
/* 只加载需要的字符 */
@font-face {
  font-family: 'CustomFont';
  src: url('font-subset.woff2') format('woff2');
  unicode-range: U+0020-007E; /* ASCII 字符 */
}

/* 策略3：异步加载 */
@font-face {
  font-family: 'AsyncFont';
  src: url('font-async.woff2') format('woff2');
  font-display: fallback;
}
```

JavaScript 实现：
```javascript
// 使用 FontFaceSet 检测字体加载状态
if ('fonts' in document) {
  document.fonts.ready.then(() => {
    console.log('所有字体加载完成');
    // 移除降级字体，应用自定义字体
  });
}

// 手动控制字体加载
const font = new FontFace('CustomFont', 'url(font.woff2)');
font.load().then(() => {
  document.fonts.add(font);
}).catch(() => {
  console.error('字体加载失败');
});
```

---

### 8. 布局抖动（Layout Thrashing）

#### 问题描述
在循环中交替读取和修改 DOM，导致多次触发重排。

#### 实际案例

```javascript
/* ❌ 布局抖动：导致多次重排 */
const elements = document.querySelectorAll('.box');
for (let i = 0; i < elements.length; i++) {
  // 读取：触发重排
  const currentHeight = elements[i].offsetHeight;
  
  // 修改：再次触发重排
  elements[i].style.height = currentHeight + 10 + 'px';
}

/* ✅ 批量读取，批量修改 */
const measurements = [];

// 步骤1：一次性读取所有值
for (let i = 0; i < elements.length; i++) {
  measurements.push(elements[i].offsetHeight);
}

// 步骤2：批量修改
for (let i = 0; i < elements.length; i++) {
  elements[i].style.height = measurements[i] + 10 + 'px';
}
```

#### 使用工具库
```javascript
// 使用 fastdom 库避免布局抖动
import fastdom from 'fastdom';

fastdom.measure(() => {
  // 读取阶段
  const height = element.offsetHeight;
  
  fastdom.mutate(() => {
    // 修改阶段
    element.style.height = height + 10 + 'px';
  });
});
```

---

### 9. 硬件加速（GPU 加速）

#### 触发硬件加速的属性

```css
/* 触发 GPU 加速的属性 */
.gpu-accelerated {
  /* 最佳：transform */
  transform: translateZ(0);      /* 开启 GPU 加速 */
  transform: translate3d(0, 0, 0);
  
  /* 次优：opacity */
  opacity: 0.5;
  
  /* 可用：will-change */
  will-change: transform;        /* 预告浏览器要修改此属性 */
}

/* ❌ 不会触发 GPU 加速 */
.cpu-bound {
  left: 0;      /* 重排 */
  width: 100px; /* 重排 */
  color: red;   /* 重绘 */
}
```

#### 谨慎使用 will-change

```css
/* ✅ 合理使用 */
.list-item:hover {
  will-change: transform;
  transform: scale(1.05);
  transition: transform 0.3s;
}

/* ❌ 过度使用 */
.every-element {
  will-change: transform;  /* 对每个元素都这样做会浪费资源 */
}
```

---

## 性能检测和监控

### 性能指标

```javascript
// 1. 获取 CSS 加载时间
const sheets = document.styleSheets;
console.log(`CSS 文件数：${sheets.length}`);

// 2. 获取页面重排/重绘次数（通过 DevTools 或 Performance API）
// Chrome DevTools → Performance → 记录并分析

// 3. 计算首次有效绘制（FCP）
const perfData = window.performance.getEntriesByType('navigation')[0];
console.log('FCP:', perfData.domContentLoadedEventEnd - perfData.fetchStart);

// 4. 监测动画帧率（已在上文提供）

// 5. 检测 CSS 规则数量
let totalRules = 0;
for (let sheet of sheets) {
  try {
    totalRules += sheet.cssRules.length;
  } catch (e) {
    console.warn('无法访问跨域样式表');
  }
}
console.log(`总 CSS 规则数：${totalRules}`);
```

### Chrome DevTools 分析

1. **打开 Performance 面板**
   - 记录页面加载过程
   - 查看红色警告（重排/重绘）
   - 分析主线程阻塞

2. **查看 Rendering 统计**
   - 右键菜单 → More Tools → Rendering
   - 启用"Paint flashing"和"Rendering stats"

3. **使用 Coverage 工具**
   - Ctrl+Shift+P → Coverage
   - 识别未使用的 CSS 代码

---

## 开发中需要关注的点

### 1. 兼容性考虑
- `will-change` 和 `contain` 在旧浏览器中不支持，需降级处理
- `transform` 在 IE9 及以下不支持，使用条件注释兼容
- 字体加载 API 在低版本浏览器需 polyfill

### 2. 性能 vs 可维护性
- 过度优化影响代码可读性
- 优先优化真正的瓶颈（通过测量确定）
- 遵循"优化 20% 代码获得 80% 收益"原则

### 3. 测试和验证
- 在真实设备和网络条件下测试
- 使用 Lighthouse 和 WebPageTest 进行定期审计
- 建立性能基准，追踪变化趋势

### 4. 跨浏览器差异
- Firefox 对 GPU 加速的策略不同
- Safari 对 CSS 动画的优化特性独特
- 移动端浏览器的资源限制更严格

---

## 面试总结

CSS 性能优化的核心是：

1. **理解浏览器渲染管道** - 知道什么会触发重排/重绘
2. **优先级策略** - 关键 CSS 优先加载，非关键异步加载
3. **属性选择** - 使用高性能属性（transform/opacity 优于 left/width）
4. **避免布局抖动** - 批量读写 DOM，缓存计算结果
5. **测量和验证** - 用数据说话，DevTools 是最好的工具
6. **平衡方案** - 在性能、可维护性和开发效率间找到平衡点

关键是让面试官看到你：
- 深入理解了浏览器工作原理
- 有实际项目优化经验
- 能够用数据驱动决策
- 懂得权衡和取舍
