# REM适配原理、VW/VH适配方案

## REM 适配方案详解

### 什么是 REM

```javascript
/* REM = Root EM */
/* 相对于根元素（html）的字体大小 */

// 如果 html 的 font-size 为 16px
// 那么 1rem = 16px
// 2rem = 32px
```

### REM 工作原理

```css
/* 传统 EM 的问题 */
.parent {
  font-size: 16px;
}

.parent .child {
  font-size: 2em; /* 相对于父元素的 16px，所以是 32px */
}

.parent .child .grandchild {
  font-size: 2em; /* 相对于父元素的 32px，所以是 64px */
}

/* REM 的优势 */
html {
  font-size: 16px; /* 基准值 */
}

.parent {
  font-size: 2rem; /* 32px（相对于 html） */
}

.parent .child {
  font-size: 1rem; /* 16px（相对于 html，不受父元素影响） */
}
```

### REM 核心实现原理

#### 1. 设置 HTML 基准值

```javascript
function setRemUnit() {
  const docEl = document.documentElement;
  const clientWidth = docEl.clientWidth;
  
  // 标准做法：将设计稿平均分成 10 份
  // 例如设计稿宽度为 375px，则设置 html font-size = 37.5px
  // 这样 1rem = 37.5px，便于计算
  const rem = clientWidth / 10;
  
  docEl.style.fontSize = rem + 'px';
}

// 初始化
setRemUnit();

// 屏幕变化时重新计算
window.addEventListener('resize', setRemUnit);
window.addEventListener('orientationchange', setRemUnit);
```

#### 2. 设计稿转换公式

```javascript
/* 假设设计稿宽度 375px，设置 1rem = 37.5px */

// 如果设计稿中某元素的宽度是 100px
// 转换为 rem 的公式：100 / 37.5 = 2.67rem

// 为了便于计算，也可以设置 1rem = 100px
function setRemUnit() {
  const docEl = document.documentElement;
  const clientWidth = docEl.clientWidth;
  
  // 设计稿宽度假设为 375px
  // 我们将其等分为 3.75 份，使 1rem = 100px
  const rem = (clientWidth / 375) * 100;
  
  docEl.style.fontSize = rem + 'px';
}

// 这样：
// 设计稿 100px = 1rem（容易心算）
// 设计稿 10px = 0.1rem
// 设计稿 14px = 0.14rem
```

### REM 完整实现示例

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" 
        content="width=device-width, initial-scale=1.0">
  <style>
    * {
      margin: 0;
      padding: 0;
    }
    
    html {
      font-size: 100px; /* 在 375px 屏幕上 */
    }
    
    body {
      font-family: Arial, sans-serif;
    }
    
    .container {
      width: 3.75rem; /* 375px */
      margin: 0 auto;
      padding: 0.2rem; /* 20px */
    }
    
    .header {
      height: 0.88rem; /* 88px */
      background: #007bff;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 0.32rem; /* 32px */
      margin-bottom: 0.3rem; /* 30px */
    }
    
    .content {
      padding: 0.2rem; /* 20px */
    }
    
    .title {
      font-size: 0.24rem; /* 24px */
      margin-bottom: 0.2rem; /* 20px */
      font-weight: bold;
    }
    
    .text {
      font-size: 0.14rem; /* 14px */
      line-height: 0.22rem; /* 22px */
      color: #666;
    }
  </style>
  <script>
    function setRemUnit() {
      const docEl = document.documentElement;
      const clientWidth = docEl.clientWidth;
      
      // 在 375px 时，1rem = 100px
      const rem = (clientWidth / 375) * 100;
      docEl.style.fontSize = rem + 'px';
    }
    
    // DOM 加载前设置
    setRemUnit();
    
    // 监听变化
    window.addEventListener('resize', setRemUnit);
  </script>
</head>
<body>
  <div class="container">
    <div class="header">标题</div>
    <div class="content">
      <div class="title">内容标题</div>
      <div class="text">这是内容文本</div>
    </div>
  </div>
</body>
</html>
```

### REM 的优点和缺点

**优点：**
- ✅ 全局控制：只需改变 html 的 font-size 就能改变整体
- ✅ 适配简单：一套代码适应所有屏幕
- ✅ 易于维护：统一管理字体大小
- ✅ 精确度高：可精确到小数点

**缺点：**
- ❌ 需要 JavaScript 计算
- ❌ 转换计算繁琐
- ❌ 某些场景不适用（如 border、box-shadow 等）
- ❌ 旧浏览器兼容性问题

---

## VW/VH 适配方案详解

### 什么是 VW/VH

```css
/* 1vw = 视口（viewport）宽度的 1% */
/* 1vh = 视口高度的 1% */
/* 1vmin = 宽度和高度中较小值的 1% */
/* 1vmax = 宽度和高度中较大值的 1% */

/* 例如：屏幕宽度 375px */
/* 1vw = 3.75px */
/* 100vw = 375px */
```

### VW 工作原理

```css
.container {
  /* 这样设置会让 1rem 始终等于视口宽度的 10% */
  font-size: 10vw;
}

div {
  width: 2rem; /* 20vw，即屏幕宽度的 20% */
  height: 3rem; /* 30vw */
}

/* 在 375px 屏幕上：1rem = 37.5px */
/* 在 750px 屏幕上：1rem = 75px */
/* 完全响应式，自动缩放 */
```

### VW 完整实现示例

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" 
        content="width=device-width, initial-scale=1.0">
  <style>
    :root {
      /* 将视口宽度分成 100 份，1rem = 1vw */
      font-size: 1vw;
    }
    
    * {
      margin: 0;
      padding: 0;
    }
    
    body {
      font-family: Arial, sans-serif;
    }
    
    .container {
      width: 100%; /* 100vw */
      max-width: 50rem; /* 限制最大宽度 50vw */
      margin: 0 auto;
      padding: 0.5rem; /* 0.5vw */
    }
    
    .header {
      height: 2.2rem; /* 2.2vw，在 375px 时约 82.5px */
      background: #007bff;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 0.8rem; /* 0.8vw */
      margin-bottom: 0.75rem;
    }
    
    .content {
      padding: 0.5rem;
    }
    
    .title {
      font-size: 0.6rem; /* 0.6vw */
      margin-bottom: 0.5rem;
      font-weight: bold;
    }
    
    .text {
      font-size: 0.35rem; /* 0.35vw */
      line-height: 0.55rem;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">标题</div>
    <div class="content">
      <div class="title">内容标题</div>
      <div class="text">这是内容文本</div>
    </div>
  </div>
</body>
</html>
```

### VW 的优点和缺点

**优点：**
- ✅ 无需 JavaScript：原生 CSS 支持
- ✅ 真正响应式：自动随视口变化
- ✅ 计算简单：直接使用百分比思维
- ✅ 现代浏览器完全支持
- ✅ 布局稳定：无 FOUC 问题

**缺点：**
- ❌ 旧浏览器不支持（IE 11 及以下）
- ❌ 在某些极端宽度下效果不理想
- ❌ 需要结合 max-width 限制最大值
- ❌ 可能出现滚动条时视口宽度变化的问题

---

## 深入理解 VW 的计算

### 与 REM 的对应关系

```javascript
// 设计稿宽度 375px，分成 10 份
// REM 方案：1rem = 37.5px = 10vw

// 推导：
// 如果 1rem = (clientWidth / 375) * 100
// 当 clientWidth = 375 时，1rem = 100px
// 当 clientWidth = 750 时，1rem = 200px

// 对应的 VW 方案：
// font-size: 26.67vw; // 即 100px / 375px * 100% ≈ 26.67vw
// 不过通常我们设置 font-size: 10vw 来简化计算
```

### 优化 VW 方案

```css
/* 基础方案 */
:root {
  font-size: 10vw;
}

/* 改进方案：限制范围 */
:root {
  font-size: 10vw;
  /* 最小 12px，最大 18px */
  font-size: clamp(12px, 10vw, 18px);
}

/* 另一种常见设置 */
:root {
  font-size: 5.333vw; /* 20px / 375px * 100% */
  font-size: clamp(14px, 5.333vw, 20px);
}
```

---

## REM vs VW 对比

| 方面 | REM | VW |
|-----|-----|-----|
| **原理** | 相对根元素字体大小 | 相对视口宽度百分比 |
| **是否需要 JS** | ✅ 需要 | ❌ 不需要 |
| **响应性** | 手动计算 | 自动响应 |
| **浏览器兼容性** | 好（IE 9+） | 中等（IE 12+，即 Edge） |
| **性能** | 稍差（需要 JS） | 更好 |
| **代码复杂度** | 中等 | 简单 |
| **精确度** | 高 | 高 |
| **实现难度** | 中等 | 简单 |

---

## 混合方案推荐

### 最佳实践

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" 
        content="width=device-width, initial-scale=1.0">
  <style>
    :root {
      /* 使用 clamp 实现弹性响应 */
      /* 在 320px 时为 16px，375px 时为 20px，1200px 时为 40px */
      font-size: clamp(16px, 5.33vw, 40px);
    }
    
    body {
      font-size: 1rem; /* 16px 到 40px */
    }
    
    .container {
      width: min(100%, 1200px);
      margin: 0 auto;
      padding: 1rem;
    }
    
    .title {
      font-size: 2rem;
      margin-bottom: 1rem;
    }
    
    .text {
      font-size: 1rem;
      line-height: 1.6;
    }
    
    /* 在极端情况下调整 */
    @media (max-width: 320px) {
      :root {
        font-size: 12px;
      }
    }
    
    @media (min-width: 1440px) {
      :root {
        font-size: 18px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1 class="title">标题</h1>
    <p class="text">内容</p>
  </div>
</body>
</html>
```

---

## 实战推荐

**选择 REM 的场景：**
- 需要支持旧浏览器
- 已有成熟的 REM 工具链
- 需要精细控制

**选择 VW 的场景：**
- 现代浏览器应用
- 想要简洁的代码
- 无法引入 JavaScript

**选择混合方案的场景：**
- 大型复杂应用
- 需要最大灵活性
- 追求最佳用户体验

## 总结

1. **REM 方案**：通过计算 HTML 基准值实现全局缩放
2. **VW 方案**：通过视口百分比实现自动响应
3. **混合方案**：使用 clamp 或媒体查询结合两者优势
4. **现代推荐**：优先使用 VW + clamp，辅以媒体查询
