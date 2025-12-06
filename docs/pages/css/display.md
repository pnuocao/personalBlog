# display 属性与元素隐藏方案

## 前言

`display` 是 CSS 中最常用、最重要的属性之一。它直接控制了元素的盒模型和布局方式。在实际项目中，理解 `display` 的各个值至关重要。同时，隐藏元素看似简单，但 `display: none`、`visibility: hidden`、`opacity: 0` 三者虽然都能隐藏元素，却各有不同的影响，这也是面试的常见问题。本文将深入讨论这些概念及其实际应用。

## display 属性的核心概念

`display` 属性指定了元素生成的盒类型，决定了元素在文档流中的渲染方式。

### 显示值的分类

CSS 的 `display` 值可以分为以下几类：

1. **外部显示值**（Outer display）：决定元素本身如何参与流布局
2. **内部显示值**（Inner display）：决定元素子元素如何布局

## display 的主要值

### 1. block（块级元素）

块级元素会：
- 占据整行，前后都有换行符
- 宽度默认为 100%（继承父元素宽度）
- 高度由内容撑开或设置
- 可以设置 margin、padding、width、height

```css
/* 块级元素示例 */
div { display: block; }
p { display: block; }
h1, h2, h3 { display: block; }
ul, ol, li { display: block; }
section, article, header, footer, nav { display: block; }
```

**HTML 默认块级元素：** `<div>`, `<p>`, `<h1-h6>`, `<ul>`, `<ol>`, `<li>`, `<section>`, `<article>`, `<header>`, `<footer>`, `<nav>`, `<aside>`, `<blockquote>`, `<pre>`, `<table>` 等

**实战场景：**

```html
<style>
    .container {
        display: block;
        width: 300px;
        margin: 20px;
        padding: 20px;
        background: #f5f5f5;
    }
</style>

<div class="container">我是块级元素，占据整行</div>
<div class="container">我也是块级元素</div>
```

### 2. inline（内联元素）

内联元素会：
- 与其他元素在同一行显示
- 宽度由内容撑开
- 忽略 width、height、margin-top、margin-bottom 设置
- 可以设置 padding、margin-left、margin-right、border
- 只有水平方向的 margin 和 padding 有效

```css
/* 内联元素示例 */
span { display: inline; }
a { display: inline; }
img { display: inline; }
button, input { display: inline; }
strong, em, code { display: inline; }
```

**HTML 默认内联元素：** `<span>`, `<a>`, `<img>`, `<button>`, `<input>`, `<label>`, `<strong>`, `<em>`, `<code>`, `<br>`, `<sup>`, `<sub>` 等

**实战场景：**

```html
<style>
    .inline-box {
        display: inline;
        background: #ddd;
        padding: 10px;    /* 只有水平方向有效 */
        margin: 20px;     /* 上下 margin 无效 */
    }
</style>

<span class="inline-box">我是内联元素 1</span>
<span class="inline-box">我是内联元素 2</span>
<!-- 显示在同一行 -->
```

**常见问题：**

```html
<!-- ❌ 错误：给 inline 元素设置高度无效 -->
<img src="..." style="display: inline; height: 100px;">

<!-- ✅ 正确：改为 inline-block 或 block -->
<img src="..." style="display: inline-block; height: 100px;">
```

### 3. inline-block（内联块级元素）

内联块级元素结合了 inline 和 block 的特性：
- 与其他元素在同一行显示（inline 特性）
- 可以设置 width、height、margin、padding（block 特性）
- 宽高由设置值或内容撑开
- 前后没有换行符

```css
/* 内联块级元素示例 */
button { display: inline-block; }
input { display: inline-block; }
img { display: inline-block; }
```

**HTML 默认内联块级元素：** `<img>`, `<button>`, `<input>`, `<select>`, `<textarea>` 等

**实战场景：** 水平排列的按钮

```html
<style>
    .btn {
        display: inline-block;
        width: 100px;
        height: 40px;
        margin: 10px;
        padding: 10px;
        background: #1890ff;
        color: white;
        border-radius: 4px;
    }
</style>

<button class="btn">按钮 1</button>
<button class="btn">按钮 2</button>
<button class="btn">按钮 3</button>
<!-- 按钮在同一行，但可以设置宽高 -->
```

### 4. none（隐藏元素）

- 元素完全隐藏，不占据任何空间
- 不参与文档流
- 等同于删除了该元素

```css
.hidden {
    display: none;
}
```

**实战场景：** 隐藏响应式菜单

```html
<style>
    .mobile-menu {
        display: none;
    }

    @media (max-width: 768px) {
        .mobile-menu {
            display: block;
        }
    }
</style>
```

**详见下文：** [display:none vs visibility:hidden vs opacity:0](#显示隐藏方案对比)

### 5. flex（弹性盒子）

Flexbox 是一维布局方案，用于创建灵活的行或列布局。

```css
.flex-container {
    display: flex;
    /* 主轴方向：row（默认） | column | row-reverse | column-reverse */
    flex-direction: row;
    /* 主轴对齐：flex-start | center | flex-end | space-between | space-around */
    justify-content: center;
    /* 交叉轴对齐：flex-start | center | flex-end | stretch */
    align-items: center;
    /* 换行：nowrap（默认） | wrap | wrap-reverse */
    flex-wrap: wrap;
    /* 行间距 */
    gap: 10px;
}

.flex-item {
    /* 伸缩比例 */
    flex: 1;
}
```

**常见布局：**

```html
<style>
    /* 水平居中 */
    .center-h {
        display: flex;
        justify-content: center;
    }

    /* 垂直居中 */
    .center-v {
        display: flex;
        align-items: center;
        height: 200px;
    }

    /* 水平垂直居中 */
    .center {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 200px;
    }

    /* 两端对齐 */
    .space-between {
        display: flex;
        justify-content: space-between;
    }
</style>

<div class="center">
    <span>我被完美居中了</span>
</div>
```

**优势：**
- 简化复杂布局
- 自动处理子元素间距
- 对齐更方便
- 响应式设计友好

### 6. grid（网格布局）

Grid 是二维布局方案，同时处理行和列。

```css
.grid-container {
    display: grid;
    /* 定义列 */
    grid-template-columns: repeat(3, 1fr);
    /* 定义行 */
    grid-template-rows: repeat(2, 100px);
    /* 间距 */
    gap: 10px;
}

.grid-item {
    /* 占据多列 */
    grid-column: span 2;
}
```

**常见布局：**

```html
<style>
    /* 3 列等宽布局 */
    .grid-3 {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
    }

    /* 响应式网格 */
    .grid-responsive {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
    }

    /* 定位栏 + 内容 + 侧栏 */
    .layout {
        display: grid;
        grid-template-columns: 200px 1fr 250px;
        gap: 20px;
    }
</style>

<div class="layout">
    <header>Header</header>
    <main>Main Content</main>
    <aside>Sidebar</aside>
</div>
```

**优势：**
- 二维布局，行列同时控制
- 自动流式布局（auto-fit、auto-fill）
- 适合复杂的多列布局

### 7. table（表格元素）

让非表格元素以表格方式显示。

```css
.table-row {
    display: table-row;
}

.table-cell {
    display: table-cell;
    border: 1px solid #ccc;
    padding: 10px;
}
```

**实战场景：** 模拟表格布局（现代应该用 grid 或 flex）

```html
<style>
    .table-layout {
        display: table;
        width: 100%;
        border-collapse: collapse;
    }

    .table-row {
        display: table-row;
    }

    .table-cell {
        display: table-cell;
        border: 1px solid #ccc;
        padding: 10px;
    }
</style>

<div class="table-layout">
    <div class="table-row">
        <div class="table-cell">单元格 1</div>
        <div class="table-cell">单元格 2</div>
    </div>
</div>
```

**注意：** 现在通常用 `grid` 或 `flex` 代替 `table` 布局，因为：
- 代码更清晰
- 性能更好
- 响应式更方便

### 8. contents（内容显示）

这是一个相对较新的值，较少使用。

```css
.wrapper {
    display: contents;
    /* 元素本身不生成盒，但子元素正常显示 */
}
```

**效果：** 元素本身消失，但子元素直接插入父容器中。

```html
<style>
    .wrapper {
        display: contents;
    }

    .wrapper {
        /* 自己的样式会被忽略 */
        color: red;
        padding: 20px;
    }
</style>

<!-- 
<div class="wrapper">        <- 这个 div 本身不显示
    <p>内容</p>             <- 这个 p 直接插入父容器
</div>
相当于只显示 <p>内容</p>
-->
```

**浏览器支持：** Firefox 37+, Chrome 65+, Safari 16.4+（需要检查兼容性）

### 9. 其他值（较少使用）

| 值 | 说明 |
|------|------|
| `list-item` | 显示为列表项（带项目符号） |
| `run-in` | 混合行内/块级（大多数浏览器不支持） |
| `flow` | 默认行为（新规范） |
| `flow-root` | 建立新的块级格式化上下文 |

**flow-root 例子：**

```css
.container {
    display: flow-root;
    /* 等价于 overflow: hidden 的容器扩展效果 */
}

.float-item {
    float: left;
}

/* .float-item 浮动不会超出 .container */
```

## 显示隐藏方案对比

这是一个面试高频问题。三种隐藏方案看起来都能隐藏元素，但影响完全不同。

### 方案对比表

| 方案 | 是否隐藏 | 是否占据空间 | 参与文档流 | 子元素可交互 | 动画支持 | 常见用途 |
|------|--------|-----------|----------|----------|---------|---------|
| `display: none` | ✅ 隐藏 | ❌ 不占据 | ❌ 否 | ❌ 否 | ❌ 无法 | 完全移除元素 |
| `visibility: hidden` | ✅ 隐藏 | ✅ 占据 | ✅ 是 | ❌ 否 | ✅ 可以 | 保留布局位置 |
| `opacity: 0` | ✅ 隐藏 | ✅ 占据 | ✅ 是 | ✅ 是 | ✅ 可以 | 透明效果 |

### 1. display: none（完全移除）

```css
.hidden {
    display: none;
}
```

**特点：**
- 元素完全隐藏，**不占据空间**
- 不参与文档流计算
- 子元素无法交互
- 过渡/动画无法应用（display 不能渐变）
- 重排（reflow）成本高

**代码示例：**

```html
<style>
    .box1 { background: red; }
    .box2 { display: none; background: green; }
    .box3 { background: blue; }
</style>

<!-- box1 和 box3 相邻，box2 不存在 -->
<div class="box1">Box 1</div>
<div class="box2">Box 2</div>
<div class="box3">Box 3</div>
```

**实战场景 1：** 响应式隐藏

```html
<style>
    .sidebar {
        display: block;
    }

    @media (max-width: 768px) {
        .sidebar {
            display: none; /* 小屏幕完全隐藏 */
        }
    }
</style>
```

**实战场景 2：** 条件显示

```html
<style>
    .admin-panel {
        display: none;
    }

    .admin-panel.visible {
        display: block;
    }
</style>

<div class="admin-panel" id="admin">Admin Tools</div>

<script>
    // JavaScript 控制
    if (isAdmin) {
        document.getElementById('admin').classList.add('visible');
    }
</script>
```

**性能影响：**

```javascript
// ⚠️ 频繁切换 display:none 会导致重排
for (let i = 0; i < 1000; i++) {
    element.style.display = element.style.display === 'none' ? 'block' : 'none';
    // 每次都重排！
}

// ✅ 更好做法：批量修改
element.style.display = 'none';
// 然后一起修改多个元素
```

### 2. visibility: hidden（保留空间）

```css
.hidden {
    visibility: hidden;
}
```

**特点：**
- 元素隐藏，**但仍占据空间**
- 参与文档流计算
- 子元素无法交互（继承特性）
- 可以过渡/动画
- 重排成本相对较低

**代码示例：**

```html
<style>
    .box1 { background: red; }
    .box2 { visibility: hidden; background: green; }
    .box3 { background: blue; }
</style>

<!-- box1 和 box3 不相邻，box2 留下空白 -->
<div class="box1">Box 1</div>
<div class="box2">Box 2（隐藏但占据空间）</div>
<div class="box3">Box 3</div>
```

**实战场景 1：** 占位隐藏（如加载占位符）

```html
<style>
    .placeholder {
        visibility: hidden;
        height: 100px;
        background: #f0f0f0;
    }

    .placeholder.loaded {
        visibility: visible;
    }
</style>

<div class="placeholder">内容加载中...</div>
```

**实战场景 2：** 过渡动画

```html
<style>
    .tooltip {
        visibility: hidden;
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .tooltip.show {
        visibility: visible;
        opacity: 1;
    }
</style>

<div class="tooltip">提示文本</div>

<script>
    // 先设置 visibility，再过渡 opacity
    element.classList.add('show');
</script>
```

**继承特性（坑！）：**

```html
<style>
    .parent {
        visibility: hidden;
    }

    .parent .child {
        visibility: visible; /* ❌ 无效！子元素无法显示 */
    }
</style>

<div class="parent">
    <div class="child">我想显示，但无法</div>
</div>

<!-- 解决：用 opacity 代替 -->
<style>
    .parent {
        opacity: 0;
    }

    .parent .child {
        opacity: 1; /* ✅ 有效！可以显示 */
    }
</style>
```

### 3. opacity: 0（透明隐藏）

```css
.hidden {
    opacity: 0;
}
```

**特点：**
- 元素透明，**完全隐藏但占据空间**
- 参与文档流计算
- 子元素仍可交互（鼠标事件、表单提交等）
- 可以过渡/动画
- 重排成本最低（只影响合成）
- 可以用 `pointer-events: none` 禁用交互

**代码示例：**

```html
<style>
    .box1 { background: red; }
    .box2 { opacity: 0; background: green; }
    .box3 { background: blue; }
</style>

<!-- box1 和 box3 不相邻，box2 留下空白但隐形 -->
<!-- 如果有链接在 box2 中，仍可点击 -->
<div class="box1">Box 1</div>
<div class="box2">
    <a href="#">这个链接仍可点击</a>
</div>
<div class="box3">Box 3</div>
```

**实战场景 1：** 淡入淡出过渡

```html
<style>
    .fade-element {
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .fade-element.active {
        opacity: 1;
    }
</style>

<div class="fade-element">内容</div>

<script>
    // 平滑过渡
    element.classList.add('active');
</script>
```

**实战场景 2：** 禁用表单但保留布局

```html
<style>
    .disabled-form {
        opacity: 0.5;
        pointer-events: none; /* 禁用所有交互 */
    }
</style>

<form class="disabled-form">
    <input type="text" placeholder="被禁用的输入框">
    <button>被禁用的按钮</button>
</form>
```

**实战场景 3：** 悬停效果

```html
<style>
    .card {
        opacity: 0.7;
        transition: opacity 0.3s ease;
    }

    .card:hover {
        opacity: 1;
    }
</style>

<div class="card">卡片内容</div>
```

**性能优势：**

```javascript
// opacity 只触发合成（Composite），性能最好
element.style.opacity = '0';

// visibility 可能触发重绘（Paint）
element.style.visibility = 'hidden';

// display 触发重排（Layout）+ 重绘（Paint），性能最差
element.style.display = 'none';
```

## 深度对比与选择指南

### 选择决策流程

```
是否需要保留空间？
├─ 否 → 使用 display: none（完全移除）
└─ 是 ┐
    └─ 是否需要过渡动画？
        ├─ 是 ┐
        │     └─ 是否需要子元素交互？
        │         ├─ 否 → visibility: hidden（保留空间，支持动画）
        │         └─ 是 → opacity: 0（保留空间，支持交互）
        └─ 否 → visibility: hidden（更好的性能）
```

### 实战场景选择

#### 场景 1：侧边栏响应式隐藏

```html
<style>
    .sidebar {
        display: flex;
    }

    @media (max-width: 768px) {
        .sidebar {
            display: none; /* 完全移除，节省空间 */
        }
    }
</style>
```

**选择理由：** 不需要保留空间，`display: none` 最高效

#### 场景 2：加载占位符

```html
<style>
    .skeleton {
        visibility: hidden;
        height: 100px;
    }

    .skeleton.loaded {
        visibility: visible;
    }
</style>
```

**选择理由：** 需要保留布局空间，防止内容加载后跳变

#### 场景 3：模态框遮罩淡入淡出

```html
<style>
    .modal-overlay {
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
    }

    .modal-overlay.active {
        opacity: 1;
        pointer-events: auto;
    }
</style>
```

**选择理由：** 需要平滑过渡，保留交互，性能好

#### 场景 4：图片加载中状态

```html
<style>
    .image-placeholder {
        opacity: 0.3;
        background: linear-gradient(90deg, #f0f0f0 0%, #e0e0e0 50%, #f0f0f0 100%);
        background-size: 200% 100%;
        animation: shimmer 2s infinite;
    }

    @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
    }
</style>
```

**选择理由：** 需要动画效果，保留布局

## 性能对比详解

### 浏览器渲染过程

```
输入 → 样式计算 → 布局 → 绘制 → 合成 → 输出
                 ↓
              重排
                 ↓
              重绘
                 ↓
              重合成
```

### 各隐藏方案的性能影响

```javascript
// 1. display: none
// 性能成本：重排 + 重绘 + 重合成（最高）
element.style.display = 'none';

// 2. visibility: hidden
// 性能成本：重绘 + 重合成（中等）
element.style.visibility = 'hidden';

// 3. opacity: 0
// 性能成本：仅重合成（最低 ⭐）
element.style.opacity = '0';
```

**性能测试代码：**

```javascript
// 测试大量元素隐藏的性能
const elements = document.querySelectorAll('.item');

console.time('display: none');
elements.forEach((el, i) => {
    el.style.display = i % 2 === 0 ? 'none' : 'block';
});
console.timeEnd('display: none');
// 结果：通常 10-30ms（取决于元素数量）

console.time('visibility: hidden');
elements.forEach((el, i) => {
    el.style.visibility = i % 2 === 0 ? 'hidden' : 'visible';
});
console.timeEnd('visibility: hidden');
// 结果：通常 5-15ms

console.time('opacity: 0');
elements.forEach((el, i) => {
    el.style.opacity = i % 2 === 0 ? '0' : '1';
});
console.timeEnd('opacity: 0');
// 结果：通常 2-5ms（最快 ⭐）
```

## 实战综合示例

### 示例 1：完整的弹窗组件

```html
<style>
    /* 弹窗背景 */
    .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        opacity: 0;           /* 初始透明 */
        visibility: hidden;   /* 初始不可交互 */
        transition: opacity 0.3s ease, visibility 0.3s ease;
        z-index: 1000;
    }

    .modal-backdrop.active {
        opacity: 1;
        visibility: visible;
    }

    /* 弹窗内容 */
    .modal-content {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0.8);
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s ease, visibility 0.3s ease, transform 0.3s ease;
        z-index: 1001;
    }

    .modal-content.active {
        opacity: 1;
        visibility: visible;
        transform: translate(-50%, -50%) scale(1);
    }
</style>

<div class="modal-backdrop"></div>
<div class="modal-content">
    <h2>弹窗标题</h2>
    <p>弹窗内容</p>
    <button class="close-btn">关闭</button>
</div>

<script>
    const backdrop = document.querySelector('.modal-backdrop');
    const content = document.querySelector('.modal-content');
    const closeBtn = document.querySelector('.close-btn');

    function openModal() {
        backdrop.classList.add('active');
        content.classList.add('active');
    }

    function closeModal() {
        backdrop.classList.remove('active');
        content.classList.remove('active');
    }

    backdrop.addEventListener('click', closeModal);
    closeBtn.addEventListener('click', closeModal);
</script>
```

### 示例 2：响应式布局

```html
<style>
    .layout {
        display: grid;
        grid-template-columns: 250px 1fr 200px;
        gap: 20px;
    }

    /* 平板：隐藏侧栏 */
    @media (max-width: 1024px) {
        .layout {
            grid-template-columns: 1fr 200px;
        }

        .sidebar-left {
            display: none; /* 完全移除 */
        }
    }

    /* 手机：只显示主内容 */
    @media (max-width: 768px) {
        .layout {
            grid-template-columns: 1fr;
        }

        .sidebar-right {
            display: none; /* 完全移除 */
        }
    }
</style>

<div class="layout">
    <aside class="sidebar-left">左侧栏</aside>
    <main>主内容</main>
    <aside class="sidebar-right">右侧栏</aside>
</div>
```

### 示例 3：加载动画

```html
<style>
    .loader {
        opacity: 1;
        visibility: visible;
        transition: opacity 0.3s ease, visibility 0.3s ease;
    }

    .loader.hidden {
        opacity: 0;
        visibility: hidden;
        pointer-events: none;
    }

    .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #1890ff;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
</style>

<div class="loader" id="loader">
    <div class="spinner"></div>
</div>

<script>
    // 模拟数据加载
    setTimeout(() => {
        document.getElementById('loader').classList.add('hidden');
        // 加载完毕，加载器平滑淡出
    }, 2000);
</script>
```

## 开发建议

### ✅ 推荐做法

1. **优先使用 opacity 做动画**
   - 性能最好
   - 配合 `pointer-events: none` 禁用交互

```css
.fade-in-out {
    opacity: 0;
    transition: opacity 0.3s ease;
}

.fade-in-out.active {
    opacity: 1;
}
```

2. **响应式隐藏用 display: none**
   - 节省空间
   - 不影响布局

```css
@media (max-width: 768px) {
    .desktop-only {
        display: none;
    }
}
```

3. **保留占位符用 visibility: hidden**
   - 防止布局跳变
   - 适合加载状态

```css
.placeholder {
    visibility: hidden;
}

.placeholder.loaded {
    visibility: visible;
}
```

### ❌ 避免做法

1. **不要过度使用 display: none**
   - 频繁切换造成重排
   - 性能浪费

```javascript
// ❌ 错误
for (let i = 0; i < 100; i++) {
    elements[i].style.display = 'none';
}
```

2. **不要在 visibility: hidden 中隐藏子元素**
   - 继承无法覆盖
   - 无法显示子内容

```css
/* ❌ 错误 */
.parent { visibility: hidden; }
.parent .child { visibility: visible; } /* 不起作用 */
```

3. **不要用 opacity 做需要移除元素的场景**
   - 浪费空间
   - 占位符位置混乱

```css
/* ❌ 错误做法 */
.should-hide {
    opacity: 0;  /* 占用空间，影响布局 */
}

/* ✅ 正确做法 */
.should-hide {
    display: none;
}
```

## 面试常见问题

**Q: display: none、visibility: hidden、opacity: 0 有什么区别？**

A: 三者都能隐藏元素，但影响不同。`display: none` 完全移除元素，不占据空间，子元素无法交互；`visibility: hidden` 隐藏元素但保留空间，子元素无法交互；`opacity: 0` 透明隐藏，保留空间，子元素仍可交互。性能上 `opacity: 0` 最好（仅重合成），`display: none` 最差（重排+重绘+重合成）。

**Q: 什么时候用 display: none？**

A: 当不需要保留元素的空间位置时，如响应式隐藏侧栏、条件隐藏某些模块。它会从文档流中移除，最高效地节省空间。

**Q: 什么时候用 visibility: hidden？**

A: 需要保留元素空间但隐藏内容时，如骨架屏加载、占位符。但要注意子元素无法显示（继承问题）。

**Q: 什么时候用 opacity: 0？**

A: 需要过渡动画或子元素交互时，如模态框、淡入淡出效果、悬停状态。性能最好，应该优先使用做动画。

**Q: visibility: hidden 和 opacity: 0 的继承有什么区别？**

A: `visibility: hidden` 会被继承，子元素无法通过 `visibility: visible` 显示；`opacity: 0` 也会被继承，但可以通过 `opacity: 1` 显示子元素。这是 `visibility` 的一个"坑"。

**Q: 为什么 opacity 做动画性能最好？**

A: 因为 `opacity` 只影响合成层（Composite）, 不触发布局（Layout）和绘制（Paint）。而 `display` 和 `visibility` 会触发重排或重绘，开销更大。

**Q: display 都有哪些值？**

A: 主要有 `block`（块级）、`inline`（内联）、`inline-block`（内联块）、`flex`（弹性盒）、`grid`（网格）、`none`（隐藏）、`table` 系列等。其中 `flex` 和 `grid` 是现代布局的核心。

**Q: flex 和 grid 怎么选择？**

A: `flex` 是一维布局（行或列），适合简单的行列排列；`grid` 是二维布局（行列同时控制），适合复杂的多列布局。通常 `flex` 用于导航、按钮组等，`grid` 用于页面主体布局。

## 总结

- **display 属性** 控制元素的盒类型和布局方式，`block`、`inline`、`flex`、`grid` 是最常用的值
- **display: none** 完全移除元素，不占据空间，性能开销最大，适合响应式隐藏
- **visibility: hidden** 隐藏但保留空间，可过渡动画，但子元素无法显示（继承坑）
- **opacity: 0** 透明隐藏，保留空间，性能最好，子元素可交互，最适合做动画
- **性能排序**（快到慢）：`opacity: 0` > `visibility: hidden` > `display: none`
- **实战选择**：根据是否需要保留空间、是否需要动画、是否需要交互来选择

掌握好 `display` 和三种隐藏方案的区别，是写出高效前端代码的基础。
