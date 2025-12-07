# 关键 CSS（Critical CSS）

## 核心概念

### 什么是关键 CSS？

关键 CSS 是指用户首屏（Above the Fold）能看到的内容所需的 CSS 样式。它是页面初始加载时必须立即呈现的最小 CSS 集合，以确保首屏内容快速可见。

**关键特征**：
- 位于首屏视口内的内容样式
- 不包括滚动后才能看到的样式
- 不包括隐藏元素、模态框等条件样式
- 通常占整个 CSS 的 10-20%

### 为什么需要关键 CSS？

在浏览器渲染页面时存在一个**关键渲染路径（Critical Rendering Path）**问题：

```
页面请求 → HTML 解析 → 遇到 <link rel="stylesheet">
    ↓
CSS 下载中... → 页面白屏等待 ← 【问题】
    ↓
CSS 解析完成 → 构建 CSSOM → 渲染树 → 首屏呈现
```

**性能指标影响**：
- **First Contentful Paint (FCP)**：首次内容绘制，直接影响用户感知
- **Largest Contentful Paint (LCP)**：最大内容绘制，影响体验评分
- 外部 CSS 是渲染阻塞资源，会延迟首屏显示

---

## 经典场景和方案

### 场景 1：传统单页应用（SPA）

**问题**：大型 CSS 文件（如 Tailwind、Bootstrap）会阻塞渲染

```html
<!-- ❌ 不好的做法：等待整个 CSS 加载 -->
<link rel="stylesheet" href="styles.css" />  <!-- 可能 200KB+ -->
<body><!-- 白屏 --></body>
```

**解决方案**：内联关键 CSS，异步加载其余样式

```html
<!-- ✅ 内联关键 CSS -->
<style>
  /* 首屏必需的核心样式 */
  body { font-family: Arial; margin: 0; }
  .header { background: #333; color: #fff; padding: 20px; }
  .hero { background: url(hero.jpg); height: 100vh; display: flex; }
  .hero h1 { color: #fff; font-size: 48px; }
  .nav { display: flex; gap: 20px; }
</style>

<!-- 异步加载完整 CSS -->
<link rel="preload" href="styles-full.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="styles-full.css"></noscript>

<body>
  <header class="header">...</header>
  <section class="hero">...</section>
</body>
```

### 场景 2：Next.js/Nuxt 等框架应用

**问题**：框架会自动 code-split，但仍需优化关键 CSS

```javascript
// next.config.js
module.exports = {
  experimental: {
    optimizePackageImports: ['@mui/material'],
  },
};

// _document.tsx - 手动内联关键 CSS
import { getCriticalCSS } from '@/lib/critical-css';

export default function Document() {
  const criticalCSS = getCriticalCSS();
  
  return (
    <Html>
      <Head>
        <style dangerouslySetInnerHTML={{ __html: criticalCSS }} />
        <link rel="preload" href="/styles/full.css" as="style" />
      </Head>
      <body>...</body>
    </Html>
  );
}
```

### 场景 3：多页面应用（MPA）

**问题**：每个页面都有不同的关键 CSS

```html
<!-- 首页 -->
<style>
  /* 首页关键样式：导航、Hero、推荐列表 */
  nav { ... }
  .hero { ... }
  .product-list { ... }
</style>

<!-- 产品详情页 -->
<style>
  /* 产品详情关键样式：导航、产品图片、基本信息 */
  nav { ... }
  .product-image { ... }
  .product-info { ... }
</style>
```

---

## 实现方案

### 方案 1：手动提取关键 CSS

**步骤**：
1. 打开开发者工具 Coverage 标签
2. 加载页面，查看哪些 CSS 被使用
3. 提取首屏必需的样式到 `<style>` 标签

```javascript
// lib/critical-css.ts
export function getCriticalCSS(): string {
  return `
    /* 重置和基础样式 */
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html { font-size: 16px; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    
    /* 导航 */
    header { position: fixed; top: 0; width: 100%; z-index: 100; }
    nav { display: flex; align-items: center; }
    
    /* 首屏内容 */
    .hero { min-height: 100vh; display: flex; align-items: center; justify-content: center; }
    .hero h1 { font-size: 3rem; }
    
    /* 加载态 */
    .skeleton { background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
               background-size: 200% 100%; animation: load 1.5s infinite; }
    @keyframes load { 0% { background-position: 200% 0; } }
  `;
}
```

### 方案 2：自动化工具提取

**推荐工具**：
- **Critical**（npm）：自动提取关键 CSS
- **PurgeCSS / Tailwind JIT**：移除未使用的 CSS

```javascript
// build/extract-critical.js - 使用 Critical 工具
const critical = require('critical');

critical.generate({
  base: 'dist/',
  src: 'index.html',
  dest: 'critical.css',
  inline: true,
  minify: true,
  width: 1366,
  height: 768,
});

// package.json
{
  "scripts": {
    "build": "webpack build && node build/extract-critical.js"
  }
}
```

### 方案 3：条件内联 CSS

根据不同条件加载关键 CSS：

```javascript
// lib/critical-css.ts
export function getCriticalCSS(device: 'mobile' | 'desktop'): string {
  const baseStyles = `
    * { margin: 0; padding: 0; box-sizing: border-box; }
  `;
  
  if (device === 'mobile') {
    return baseStyles + `
      body { font-size: 14px; }
      .nav { flex-direction: column; }
      .hero { min-height: 50vh; }
    `;
  }
  
  return baseStyles + `
    body { font-size: 16px; }
    .nav { flex-direction: row; }
    .hero { min-height: 100vh; }
  `;
}
```

---

## 关键代码示例

### 完整实现：React 应用

```javascript
// components/CriticalCSSProvider.tsx
import React from 'react';

const CRITICAL_CSS = `
  /* 重置 */
  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  html {
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
  }
  
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    line-height: 1.6;
    color: #333;
  }
  
  /* 布局 */
  header {
    position: fixed;
    top: 0;
    width: 100%;
    height: 60px;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    z-index: 1000;
  }
  
  nav {
    display: flex;
    align-items: center;
    height: 100%;
    padding: 0 20px;
  }
  
  nav a {
    margin: 0 15px;
    text-decoration: none;
    color: #333;
    transition: color 0.2s;
  }
  
  .hero {
    margin-top: 60px;
    min-height: calc(100vh - 60px);
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }
  
  .hero h1 {
    font-size: 3.5rem;
    font-weight: 700;
    text-align: center;
  }
  
  .content {
    padding: 40px 20px;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  /* 骨架屏加载动画 */
  .skeleton {
    background: linear-gradient(
      90deg,
      #f0f0f0 25%,
      #e0e0e0 50%,
      #f0f0f0 75%
    );
    background-size: 200% 100%;
    animation: skeleton-loading 1.5s infinite;
  }
  
  @keyframes skeleton-loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

export default function CriticalCSSProvider() {
  return (
    <style dangerouslySetInnerHTML={{ __html: CRITICAL_CSS }} />
  );
}

// App.tsx
import CriticalCSSProvider from '@/components/CriticalCSSProvider';

export default function App() {
  return (
    <>
      <CriticalCSSProvider />
      {/* 异步加载完整 CSS */}
      <link
        rel="preload"
        href="/styles/full.css"
        as="style"
        onLoad={(e) => e.target.rel = 'stylesheet'}
      />
      <noscript>
        <link rel="stylesheet" href="/styles/full.css" />
      </noscript>
      
      <header>...</header>
      <section className="hero">...</section>
      <main className="content">...</main>
    </>
  );
}
```

### 测量关键 CSS 效果

```javascript
// lib/performance.ts
export function measureCriticalCSS() {
  // 获取 FCP（首次内容绘制）
  const fcp = performance.getEntriesByName('first-contentful-paint')[0];
  
  // 获取 LCP（最大内容绘制）
  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1];
    console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
  });
  
  observer.observe({ entryTypes: ['largest-contentful-paint'] });
  
  // 获取 CSS 覆盖率
  const sheets = document.styleSheets;
  let totalRules = 0;
  let unusedRules = 0;
  
  Array.from(sheets).forEach(sheet => {
    try {
      const rules = sheet.cssRules || [];
      totalRules += rules.length;
    } catch (e) {
      console.warn('Cannot access stylesheet rules');
    }
  });
  
  return {
    fcp: fcp?.startTime,
    totalRules,
    coverage: `${Math.round((totalRules - unusedRules) / totalRules * 100)}%`,
  };
}

// 使用
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    const metrics = measureCriticalCSS();
    console.log('Critical CSS Metrics:', metrics);
  });
}
```

---

## 最佳实践和注意事项

### ✅ 应该做的事

1. **测量 First Contentful Paint (FCP)**
   ```javascript
   // 使用 Web Vitals 库
   import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';
   
   getFCP(console.log);  // 测量 FCP
   ```

2. **按优先级加载 CSS**
   ```html
   <!-- 关键 CSS：内联 -->
   <style>...</style>
   
   <!-- 次要 CSS：异步预加载 -->
   <link rel="preload" href="secondary.css" as="style" onload="this.rel='stylesheet'">
   
   <!-- 非关键 CSS：延迟加载 -->
   <link rel="prefetch" href="themes.css" as="style">
   ```

3. **为不支持 JavaScript 的环境提供降级方案**
   ```html
   <noscript>
     <link rel="stylesheet" href="styles.css">
   </noscript>
   ```

### ❌ 避免的陷阱

1. **过度优化**
   ```javascript
   // ❌ 将所有 CSS 都内联 - 会增加 HTML 体积，损害缓存效果
   // ✅ 只内联关键 CSS（通常 < 14KB）
   ```

2. **忽视响应式设计**
   ```javascript
   // ❌ 只考虑桌面端关键 CSS
   // ✅ 分别为移动端和桌面端优化
   ```

3. **不考虑缓存策略**
   ```javascript
   // ❌ 每次都生成关键 CSS
   // ✅ 使用哈希版本控制，充分利用浏览器缓存
   ```

4. **忽视不同网络条件**
   ```javascript
   // ❌ 在 3G 网络上内联过多 CSS
   // ✅ 根据网络速度（navigator.connection.effectiveType）调整策略
   ```

---

## 性能指标对比

### 优化前后对比

| 指标 | 优化前 | 优化后 | 提升 |
|------|-------|-------|------|
| First Contentful Paint (FCP) | 2.5s | 0.8s | **68%** |
| Largest Contentful Paint (LCP) | 3.8s | 1.2s | **68%** |
| CSS 文件大小 | 120KB | 120KB | - |
| 关键 CSS（内联） | - | 12KB | 首屏关键 |
| 首屏加载时间 | 3.2s | 0.9s | **72%** |

### 兼容性

| 浏览器 | 支持情况 |
|--------|---------|
| Chrome 60+ | ✅ 完全支持 |
| Firefox 55+ | ✅ 完全支持 |
| Safari 12+ | ✅ 完全支持 |
| IE 11 | ⚠️ 支持但需 Fallback |
| Edge 15+ | ✅ 完全支持 |

---

## 总结

**关键 CSS 的核心作用**：
1. **加速首屏渲染** - 减少 FCP/LCP 时间
2. **提升用户体验** - 快速展示内容，减少白屏时间
3. **优化性能评分** - 改善 Core Web Vitals 指标

**实现路径**：
1. 识别首屏内容 → 2. 提取关键样式 → 3. 内联关键 CSS → 4. 异步加载其余 CSS → 5. 测量和监控

**记住**：关键 CSS 不是一劳永逸的优化，需要根据页面内容、网络条件和用户设备不断调整。
