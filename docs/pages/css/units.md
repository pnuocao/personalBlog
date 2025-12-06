# CSS 单位详解

## 前言

CSS 单位是前端开发中的基础但常被忽视的知识点。在实际项目中，我经常看到因为单位选择不当而导致的响应式设计问题或布局混乱。这道题考察的是开发者对 CSS 长度单位的深度理解，能否根据不同场景选择合适的单位，直接影响代码的健壮性和可维护性。

## 常见 CSS 单位分类

### 绝对单位（Absolute Units）

绝对单位与屏幕无关，在任何设备上的大小都是固定的。

#### px（像素）
```css
.box {
    width: 100px;      /* 100 个设备独立像素 */
    font-size: 16px;   /* 基础字体大小 */
    border: 1px solid; /* 边框宽度 */
}
```

**特点：**
- 最常用的单位
- 1px = 1 个设备独立像素（DIP）
- 在不同 DPI 的设备上会自动缩放
- 精确度高，但不够灵活

**实际应用场景：**
- 固定宽度设计：`width: 100px`
- 极小的尺寸：`border: 1px solid`
- 阴影和其他效果：`box-shadow: 0 2px 4px rgba(0,0,0,0.1)`

#### 其他绝对单位（了解即可）
```css
.unit-comparison {
    /* cm - 厘米 */
    width: 1cm;  /* 约 37.8px */
    
    /* mm - 毫米 */
    height: 10mm;  /* 约 37.8px */
    
    /* in - 英寸 */
    border: 0.1in solid;  /* 1 英寸 = 96px */
    
    /* pt - 磅 */
    font-size: 12pt;  /* 1pt = 1/72 英寸 */
    
    /* pc - 皮卡 */
    margin: 1pc;  /* 1pc = 12pt */
}
```

这些单位在 Web 开发中几乎不使用，主要用于打印样式（`@media print`）。

---

### 相对单位（Relative Units）

相对单位的大小取决于其他值（如父元素、根元素或视口大小），具有很强的灵活性。

#### em（相对于字体大小）

**定义：** 1em = 当前元素的 font-size 值

```css
.container {
    font-size: 16px;  /* 基准 */
}

.child {
    font-size: 1.5em;  /* 1.5 × 16px = 24px */
    padding: 1em;      /* 1 × 24px = 24px（相对于 child 的 font-size）*/
}

.grandchild {
    font-size: 0.8em;  /* 0.8 × 24px = 19.2px（继承自 child） */
}
```

**核心特点：**
- 相对于当前元素的 `font-size`
- **关键点：** 嵌套使用会产生复合效应
- 字体大小继承，em 值会逐层相乘

**实战例子 - 可能出现的问题：**

```html
<style>
    body { font-size: 14px; }
    .level1 { font-size: 2em; }      /* 2 × 14px = 28px */
    .level2 { font-size: 2em; }      /* 2 × 28px = 56px ❌ 嵌套倍增 */
    .level3 { font-size: 2em; }      /* 2 × 56px = 112px ❌ 持续倍增 */
</style>

<div class="level1">
    Level 1: 28px
    <div class="level2">
        Level 2: 56px (不是预期的 28px) ❌
        <div class="level3">
            Level 3: 112px (更大) ❌
        </div>
    </div>
</div>
```

**em 的应用场景：**

1. **相对字体大小调整**
```css
/* 标题相对于当前字体大小缩放 */
h1 {
    font-size: 2em;    /* 相对于父元素 */
    line-height: 1.2em; /* 相对于 h1 自身的 font-size */
}

h2 { font-size: 1.5em; }
h3 { font-size: 1.2em; }
```

2. **内边距和外边距**
```css
.button {
    font-size: 14px;
    padding: 0.5em 1em;  /* 7px 14px（相对于 14px）*/
}

.button.large {
    font-size: 18px;
    padding: 0.5em 1em;  /* 9px 18px（自动放大）*/
    /* 通过 font-size 变化自动调整 padding */
}
```

3. **媒体查询中的响应式设计**
```css
@media (max-width: 768px) {
    body { font-size: 14px; }
    .button { font-size: 1em; } /* 14px */
    .title { font-size: 1.5em; } /* 21px */
}
```

#### rem（相对于根元素 html 的字体大小）

**定义：** 1rem = `<html>` 元素的 `font-size` 值

```css
html {
    font-size: 16px;  /* 基准 */
}

.container {
    width: 50rem;    /* 50 × 16px = 800px */
    padding: 1rem;   /* 1 × 16px = 16px */
}

.child {
    font-size: 2rem;  /* 2 × 16px = 32px（不受父元素影响！）*/
    padding: 1rem;    /* 1 × 16px = 16px（始终相对 html）*/
}

.grandchild {
    /* rem 不会继续复合增长 */
    font-size: 1rem;  /* 1 × 16px = 16px（始终相对 html）*/
}
```

**核心优势：**
- 统一基准，避免 em 的嵌套倍增问题
- 所有 rem 单位都相对同一个基准（html 的 font-size）
- 灵活性强，易于维护

**实战例子 - 响应式设计的最佳实践：**

```css
/* 基础设置 */
html {
    font-size: 16px;  /* PC 端 */
}

body {
    font-size: 1rem;  /* 16px */
}

.title {
    font-size: 2rem;  /* 32px */
}

.content {
    font-size: 1rem;  /* 16px */
    line-height: 1.6;
    padding: 1rem;    /* 16px */
}

.button {
    padding: 0.5rem 1rem;  /* 8px 16px */
    font-size: 1rem;       /* 16px */
}

/* 平板设备 */
@media (max-width: 1024px) {
    html { font-size: 15px; }
    /* 所有 rem 单位自动缩放至 15px 基准 */
}

/* 手机设备 */
@media (max-width: 768px) {
    html { font-size: 14px; }
    /* 所有 rem 单位自动缩放至 14px 基准 */
}

@media (max-width: 480px) {
    html { font-size: 12px; }
    /* 所有 rem 单位自动缩放至 12px 基准 */
}
```

**rem 的应用场景：**

1. **全局响应式设计**
```css
/* 通过修改根元素 font-size，实现整体缩放 */
html { font-size: 16px; }
.container { width: 50rem; } /* 800px */
.sidebar { width: 10rem; }   /* 160px */
```

2. **组件库统一尺寸**
```css
/* Ant Design、Bootstrap 等组件库常用 rem */
.ant-btn {
    font-size: 1rem;
    padding: 0.5rem 1rem;
}

.ant-input {
    font-size: 1rem;
    padding: 0.5rem 0.75rem;
}
```

3. **与 em 比较的优势**
```css
/* 使用 em 的问题 */
.nav { font-size: 12px; }
.nav .item { font-size: 1em; }        /* 12px */
.nav .item .text { font-size: 1em; }  /* 12px */
.nav .item .text .mark { 
    font-size: 1em;  /* 还是 12px */
}

/* 使用 rem 更清晰 */
html { font-size: 16px; }
.nav { font-size: 0.75rem; }        /* 12px，明确相对 html */
.nav .item { font-size: 0.75rem; }  /* 12px */
.nav .item .text { font-size: 0.75rem; }
/* 所有都清晰地相对 html，不会产生嵌套问题 */
```

---

#### vh（视口高度的百分比）

**定义：** 1vh = 视口（viewport）高度的 1%

```css
.hero {
    height: 100vh;  /* 等于整个视口的高度 */
    width: 100vw;   /* 等于整个视口的宽度 */
}

.section {
    height: 50vh;   /* 视口高度的一半 */
}

.button {
    font-size: 5vh;  /* 视口高度的 5% */
}
```

**关键特性：**
- 与视口大小相关联
- 在用户改变浏览器窗口大小时实时响应
- 不受字体大小影响

**实战例子 - 全屏设计：**

```html
<style>
    /* 全屏幻灯片 */
    .slide {
        height: 100vh;
        width: 100vw;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .slide-1 { background: #3498db; }
    .slide-2 { background: #e74c3c; }
    .slide-3 { background: #2ecc71; }

    .slide h1 {
        font-size: 8vh;   /* 响应式字体 */
        color: white;
    }

    .slide p {
        font-size: 3vh;   /* 响应式描述文本 */
        color: rgba(255, 255, 255, 0.9);
    }

    /* 防止垂直滚动条影响 */
    @media (max-height: 600px) {
        .slide h1 { font-size: 5vh; }
        .slide p { font-size: 2vh; }
    }
</style>

<div class="slide slide-1">
    <div>
        <h1>Welcome</h1>
        <p>Full viewport height and responsive font size</p>
    </div>
</div>

<div class="slide slide-2">
    <div>
        <h1>Features</h1>
        <p>Automatic scaling based on viewport</p>
    </div>
</div>
```

**vh 的应用场景：**

1. **全屏页面**
```css
.fullscreen-page { height: 100vh; }
.modal-backdrop { height: 100vh; }
```

2. **响应式字体大小**
```css
body { font-size: 2vh; }  /* 随视口高度变化 */
h1 { font-size: 5vh; }
h2 { font-size: 3vh; }
```

3. **固定高度容器**
```css
.header { height: 10vh; }
.sidebar { height: calc(100vh - 10vh); }
.footer { height: 10vh; }
```

---

#### vw（视口宽度的百分比）

**定义：** 1vw = 视口（viewport）宽度的 1%

```css
.container {
    width: 100vw;   /* 等于整个视口的宽度 */
    max-width: 50vw; /* 视口宽度的一半 */
}

.responsive-text {
    font-size: 3vw;  /* 视口宽度的 3% */
}
```

**实战例子 - 完全响应式布局：**

```css
/* 响应式排版 */
html {
    font-size: clamp(12px, 2.5vw, 18px);
    /* 最小 12px，优先 2.5vw，最大 18px */
}

h1 { font-size: clamp(1.5rem, 5vw, 3rem); }
h2 { font-size: clamp(1.2rem, 4vw, 2rem); }
body { font-size: clamp(0.875rem, 2vw, 1rem); }

/* 响应式间距 */
.container {
    width: 90vw;
    max-width: 1200px;
    margin: 0 auto;
    padding: 2vw;
}

.card {
    padding: 2vw;
    margin: 1vw;
}
```

**vw 的应用场景：**

1. **流体响应式布局**
```css
.grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(20vw, 1fr));
    gap: 2vw;
}
```

2. **响应式字体**
```css
.headline { font-size: 5vw; }
.subtitle { font-size: 3vw; }
.body-text { font-size: 2vw; }
```

3. **防止超出视口**
```css
.modal {
    width: 90vw;
    max-width: 600px;
    max-height: 90vh;
    overflow: auto;
}
```

---

#### vmin 和 vmax

```css
/* vmin - 视口宽度和高度中的较小值的 1% */
.adaptive {
    width: 100vmin;  /* 正方形，边长为较小尺寸 */
    height: 100vmin;
}

/* vmax - 视口宽度和高度中的较大值的 1% */
.fullcover {
    width: 100vmax;  /* 覆盖整个视口 */
    height: 100vmax;
}

/* 实战：自适应方形 */
.square {
    width: 80vmin;
    height: 80vmin;
    background: #3498db;
    margin: auto;
}
```

---

#### %（百分比）

**定义：** 百分比相对于父元素的相应属性

```css
.parent {
    width: 500px;
    height: 300px;
    font-size: 16px;
}

.child {
    width: 50%;      /* 250px（相对于父元素宽度）*/
    height: 100%;    /* 300px（相对于父元素高度）*/
    font-size: 150%; /* 24px（相对于父元素字体大小）*/
    margin: 10%;     /* 50px（相对于父元素宽度，不是高度！）*/
    padding: 10%;    /* 50px（相对于父元素宽度）*/
}
```

**关键点：** margin 和 padding 的百分比都相对于**父元素的宽度**，不管是上下还是左右。

**百分比的应用场景：**

```css
/* 响应式布局 */
.container { width: 100%; }
.row { display: flex; }
.col { flex: 1; }  /* 等同于 width: 33.33% × 3 */

/* 流体网格 */
.grid {
    display: grid;
    grid-template-columns: 25% 25% 25% 25%;
}

/* 百分比嵌套问题 */
.parent { width: 500px; }
.child { width: 50%; }      /* 250px */
.grandchild { width: 50%; } /* 125px（相对于 child 的 250px）*/
```

---

## 单位对比速查表

| 单位 | 相对于 | 适用场景 | 响应式 | 嵌套问题 |
|------|-------|---------|-------|--------|
| **px** | 固定值 | 精确尺寸、边框 | ❌ | ❌ |
| **em** | 当前元素 font-size | 相对大小、组件 | ⚠️ | ✅ 有 |
| **rem** | 根元素 font-size | 全局响应式 | ✅ | ❌ |
| **%** | 父元素相应属性 | 流体布局 | ✅ | ⚠️ |
| **vh** | 视口高度 | 全屏设计 | ✅ | ❌ |
| **vw** | 视口宽度 | 响应式字体 | ✅ | ❌ |
| **vmin** | 视口小值 | 自适应方形 | ✅ | ❌ |
| **vmax** | 视口大值 | 覆盖整个视口 | ✅ | ❌ |

---

## px vs em vs rem 详细对比

### 1. 基础差异

```html
<style>
    body { font-size: 16px; }
    
    /* 三个单位 */
    .px-box { width: 100px; }
    .em-box { width: 100em; }  /* 100 × 当前 font-size */
    .rem-box { width: 100rem; } /* 100 × 16px = 1600px */
</style>

<div class="px-box">100px - 固定</div>
<div class="em-box">100em - 浮动</div>
<div class="rem-box">100rem - 固定基准</div>
```

### 2. 嵌套场景

```css
/* em 的嵌套问题 */
.container { font-size: 20px; }
.item { font-size: 2em; }      /* 40px */
.item .sub-item { font-size: 2em; } /* 80px ❌ 不期望 */

/* rem 解决方案 */
html { font-size: 16px; }
.item { font-size: 2rem; }      /* 32px */
.item .sub-item { font-size: 2rem; } /* 32px ✅ 一致 */
```

### 3. 响应式设计

```css
/* 方案 1：使用 rem（推荐）*/
html { font-size: 16px; }

@media (max-width: 768px) {
    html { font-size: 14px; }  /* 一个改动，全局调整 */
}

/* 方案 2：使用 px（传统）*/
body { font-size: 16px; }
@media (max-width: 768px) {
    body { font-size: 14px; }
    /* 需要手动调整每个样式 */
}
```

---

## 实战推荐方案

### 最佳实践

```css
/* 1. 设置 html 基础字体大小 */
html {
    font-size: 16px;  /* PC 端标准 */
}

/* 2. 使用 rem 定义全局尺寸 */
body {
    font-size: 1rem;
    line-height: 1.5;
}

h1 { font-size: 2rem; }
h2 { font-size: 1.5rem; }
h3 { font-size: 1.2rem; }

p { font-size: 1rem; }

.button {
    padding: 0.5rem 1rem;
    font-size: 1rem;
}

/* 3. 响应式调整基础字体 */
@media (max-width: 1024px) {
    html { font-size: 15px; }
}

@media (max-width: 768px) {
    html { font-size: 14px; }
}

@media (max-width: 480px) {
    html { font-size: 12px; }
}

/* 4. 特殊场景使用 em（组件内相对缩放）*/
.badge {
    padding: 0.25em 0.5em;  /* 相对于自身 font-size */
    border-radius: 0.2em;
}

.badge.small { font-size: 0.85rem; }
.badge.large { font-size: 1.2rem; }

/* 5. 全屏或视口相关使用 vw/vh */
.hero { height: 100vh; }
.header { height: 10vh; }
```

### 使用 clamp() 简化响应式

```css
/* CSS 现代方案：clamp() */
html {
    font-size: clamp(12px, 2vw, 18px);
    /* 最小 12px，优先 2vw，最大 18px */
}

.container {
    width: clamp(300px, 90vw, 1200px);
    /* 最小 300px，优先 90vw，最大 1200px */
}

.title {
    font-size: clamp(1.5rem, 5vw, 3rem);
    /* 最小 24px，优先 5vw，最大 48px */
}

.padding {
    padding: clamp(1rem, 5vw, 2rem);
}
```

---

## 单位选择决策树

```
需要响应式吗？
├─ 否 → 使用 px（精确像素）
└─ 是
    ├─ 全屏/视口高度？ 
    │  ├─ 是 → 使用 vh
    │  └─ 否
    │     └─ 响应式字体/布局？
    │        ├─ 是 → 使用 clamp(px, vw/vh, px)
    │        └─ 否
    │           └─ 相对父元素？
    │              ├─ 是 → 使用 %（布局）或 em（字体）
    │              └─ 否 → 使用 rem（推荐全局）

特殊场景：
├─ 组件内部缩放 → em
├─ 组件库全局 → rem
├─ 响应式排版 → clamp() + vw
├─ 背景相关 → vmax/vmin
└─ 精确控制 → px
```

---

## 性能考虑

### 浏览器计算开销

```css
/* 高效的计算量少 */
.simple { font-size: 16px; }      /* 直接渲染 */
.rem-direct { padding: 1rem; }    /* 简单计算 */

/* 需要计算但可接受 */
.em-nested { padding: 1em; }      /* 需要查找字体大小 */
.percent-nested { width: 50%; }   /* 需要计算百分比 */

/* 大量动画时避免 */
/* ❌ 不推荐 - 频繁重排 */
@keyframes grow {
    from { width: 10vh; }
    to { width: 100vh; }
}

/* ✅ 推荐 - 简单变换 */
@keyframes grow {
    from { transform: scale(0.1); }
    to { transform: scale(1); }
}
```

---

## 兼容性情况

| 单位 | IE 11 | 现代浏览器 |
|------|-------|----------|
| px | ✅ | ✅ |
| em | ✅ | ✅ |
| rem | ⚠️ IE9+ | ✅ |
| % | ✅ | ✅ |
| vh/vw | ⚠️ IE9+ | ✅ |
| vmin | ⚠️ IE9+ | ✅ |
| vmax | ❌ IE | ✅ |
| clamp() | ❌ IE | ✅ (2020+) |

**兼容性降级方案：**

```css
.container {
    width: 50%;        /* 兼容 IE */
    width: clamp(300px, 90vw, 1200px);  /* 现代浏览器优先 */
}

.title {
    font-size: 2rem;   /* 兼容 IE9+ */
    font-size: clamp(1.5rem, 5vw, 3rem); /* 现代浏览器优先 */
}
```

---

## 常见错误

### ❌ 错误 1：混乱使用单位

```css
/* 不推荐 - 单位混乱 */
.container {
    width: 80%;
    padding: 1rem;
    margin: 20px;
    font-size: 1em;
}

/* 推荐 - 单位统一 */
.container {
    width: 90%;          /* 或 1200px */
    padding: 1rem;
    margin: 1rem;        /* 统一使用 rem */
    font-size: 1rem;
}
```

### ❌ 错误 2：em 的嵌套倍增

```css
/* ❌ 问题代码 */
.nav { font-size: 12px; }
.nav li { font-size: 1.2em; }           /* 14.4px */
.nav li span { font-size: 1.2em; }      /* 17.28px ❌ 意外放大 */
.nav li span i { font-size: 1.2em; }    /* 20.736px ❌ 更大 */

/* ✅ 使用 rem 避免 */
.nav { font-size: 0.75rem; }            /* 12px */
.nav li { font-size: 1rem; }            /* 16px */
.nav li span { font-size: 1rem; }       /* 16px ✅ 一致 */
.nav li span i { font-size: 1rem; }     /* 16px ✅ 一致 */
```

### ❌ 错误 3：忘记百分比是相对宽度

```css
/* ❌ 错误理解 */
.parent { width: 600px; height: 400px; }
.child { 
    margin: 10%;  /* 错误：相对父元素宽度，所以是 60px，不是 40px */
}

/* ✅ 正确理解 */
.parent { width: 600px; height: 400px; }
.child { 
    margin: 10%;  /* 60px（600px 的 10%） */
}
```

### ❌ 错误 4：混用 px 和 rem 导致响应式失效

```css
/* ❌ 不推荐 */
html { font-size: 16px; }
.title { 
    font-size: 2rem;    /* 32px */
    line-height: 30px;  /* 固定 px，不会响应式缩放 */
}

/* ✅ 推荐 */
html { font-size: 16px; }
.title { 
    font-size: 2rem;
    line-height: 1.5;   /* 相对值，会自动缩放 */
}
```

---

## 面试常见问题

**Q: px、em、rem 分别什么时候用？**

A: `px` 用于精确像素值（边框、阴影等），`em` 用于组件内部相对缩放（按钮、徽章等相对自身字体大小变化），`rem` 用于全局响应式设计（根据根元素统一调整）。现在推荐优先使用 rem，因为避免了 em 嵌套倍增问题，且响应式处理更统一。

**Q: em 嵌套时为什么会倍增？**

A: 因为 em 是相对于当前元素的 font-size。嵌套元素继承了父元素放大后的 font-size，再按 em 比例计算，结果就是倍增。例如父元素 20px、设置 `font-size: 2em` 变成 40px，子元素继承这个 40px，再设置 `font-size: 2em` 就变成 80px。

**Q: rem 如何实现响应式设计？**

A: 在 html 元素设置基础 `font-size`，然后在不同媒体查询中改变这个值。因为所有 rem 单位都相对 html 的 font-size，只需改一个地方就能实现全局缩放。例如 PC 端 `html { font-size: 16px; }`，手机端 `html { font-size: 12px; }`。

**Q: vh 和 vw 的区别是什么？**

A: `vh` 是相对视口高度的百分比，`vw` 是相对视口宽度的百分比。`100vh` 等于整个屏幕高度，`100vw` 等于整个屏幕宽度。实际应用中，`100vh` 常用于全屏容器，`vw` 常用于响应式字体。

**Q: 为什么 margin 的百分比相对宽度而不是高度？**

A: 这是 CSS 的设计规范。margin、padding、width、left、right 等的百分比都相对于父元素的宽度。这样做的好处是保持一致性和可预测性。

**Q: clamp() 函数是什么？**

A: `clamp(min, preferred, max)` 是现代 CSS 函数，返回 min 和 max 之间、最接近 preferred 值的值。例如 `clamp(1rem, 2vw, 3rem)` 最小 1rem，优先 2vw，最大 3rem，自动在范围内选择合适值。用于简化响应式设计。

**Q: 移动端响应式设计用 vw 还是 rem？**

A: 两种都可以，看具体需求。`vw` 更直观（直接相对视口），但有时过度响应导致字体在某些屏幕大小不合适。`rem` 结合媒体查询更可控。现在趋势是用 `clamp()` 结合 vw/vh，既保证响应式又确保在极端情况下的可用性。

---

## 总结

| 单位 | 特点 | 最佳应用 |
|------|------|---------|
| **px** | 精确、固定 | 边框、阴影、精确尺寸 |
| **em** | 相对字体大小、有嵌套问题 | 组件内部相对缩放 |
| **rem** | 相对根元素、易于维护 | **全局响应式设计（推荐）** |
| **%** | 相对父元素 | 流体布局、自适应宽度 |
| **vh/vw** | 相对视口 | 全屏设计、响应式字体 |
| **vmin/vmax** | 视口最小/最大值 | 自适应正方形、背景覆盖 |

**最佳实践：**

1. 全局使用 rem，在 html 设置基础字体大小
2. 在不同媒体查询中调整 html 字体大小实现响应式
3. 特殊场景（全屏、动态字体）使用 vw/vh + clamp()
4. 组件内部可以用 em 实现相对缩放
5. 尽量避免混用不同单位，保持代码一致性

掌握好 CSS 单位，是写出高效、可维护、真正响应式网站的关键。
