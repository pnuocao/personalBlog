# 伪类与伪元素

## 前言

伪类和伪元素是 CSS 中容易混淆的两个概念。它们看起来相似，但本质完全不同。在实际项目中，用错它们会导致样式不生效或代码难以维护。这也是面试中的常见问题，答好这道题能显著提升对 CSS 的理解深度。

## 核心概念

### 伪类（Pseudo-class）

**定义：** 伪类是选择器，用于选择处于特定**状态**的元素。

**特点：**
- 选择已存在的真实元素
- 元素处于某种状态时才匹配
- 用单冒号 `:` 表示
- 权重为 `(0, 0, 1, 0)`
- 不会在 DOM 中创建新元素

**本质：** 伪类是对元素状态的描述

```css
/* 示例：选择鼠标悬停状态的链接 */
a:hover { color: red; }

/* 链接本身存在，伪类只是描述其状态 */
```

### 伪元素（Pseudo-element）

**定义：** 伪元素是用于创建**虚拟元素**的选择器，在 DOM 中不存在，但在渲染树中存在。

**特点：**
- 创建不存在于 DOM 中的虚拟元素
- 用双冒号 `::` 表示（CSS 3 规范，单冒号 `:` 在 CSS 2 中也可用）
- 权重为 `(0, 0, 0, 1)`
- 只能有一个伪元素存在于一个选择器中（除了 `::before` 和 `::after` 可同时存在）
- 可以设置宽高、背景等属性

**本质：** 伪元素创建虚拟的新元素

```css
/* 示例：在段落前插入虚拟元素 */
p::before { content: '→ '; }

/* DOM 中没有新的 p 子元素，但渲染时会显示"→" */
```

## 伪类详解

### 1. 动态伪类（基于用户交互）

#### :hover（鼠标悬停）

```css
/* 鼠标悬停在元素上时 */
a:hover {
    color: red;
    text-decoration: underline;
}

button:hover {
    background-color: #0056b3;
    cursor: pointer;
}

/* 任何元素都可以有 hover 状态 */
.box:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    transform: scale(1.05);
}
```

**实战场景：** 交互反馈

```html
<style>
    .card {
        transition: all 0.3s ease;
    }

    .card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    }
</style>

<div class="card">卡片内容</div>
```

#### :active（激活状态）

```css
/* 元素被激活时（鼠标按下） */
button:active {
    background-color: #003d7a;
    transform: scale(0.98);
}

a:active {
    color: purple;
}
```

#### :focus（获得焦点）

```css
/* 元素获得焦点时 */
input:focus {
    outline: 2px solid #1890ff;
    border-color: #1890ff;
    box-shadow: 0 0 0 3px rgba(24, 144, 255, 0.2);
}

button:focus {
    outline: 2px solid #1890ff;
}

/* 获得焦点或包含获得焦点元素 */
form:focus-within {
    border: 2px solid #1890ff;
}
```

**实战场景：** 表单交互

```html
<style>
    .form-group {
        margin-bottom: 20px;
    }

    input {
        padding: 8px 12px;
        border: 1px solid #ddd;
        transition: border-color 0.3s ease;
    }

    input:focus {
        border-color: #1890ff;
        box-shadow: 0 0 0 3px rgba(24, 144, 255, 0.1);
    }
</style>

<div class="form-group">
    <input type="text" placeholder="输入内容">
</div>
```

#### :visited（访问过的链接）

```css
/* 已访问的链接 */
a:visited {
    color: purple;
}

/* 出于安全原因，只允许修改有限的属性 */
a:visited {
    color: purple;           /* ✅ 允许 */
    background-color: blue;  /* ✅ 允许 */
    border-color: red;       /* ✅ 允许 */
    outline-color: green;    /* ✅ 允许 */
    /* 不允许修改其他属性，如 width、height 等 */
}
```

**注意：** `:visited` 出于隐私考虑，能修改的属性受限

### 2. 状态伪类

#### :disabled 和 :enabled

```css
/* 被禁用的表单元素 */
input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: #f5f5f5;
}

/* 被启用的表单元素 */
input:enabled {
    cursor: text;
}

button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}
```

**实战场景：** 表单提交

```html
<style>
    .submit-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .submit-btn:enabled:hover {
        background-color: #0056b3;
    }
</style>

<button class="submit-btn" id="submitBtn">提交</button>

<script>
    const submitBtn = document.getElementById('submitBtn');
    
    // 表单验证前禁用
    submitBtn.disabled = true;
    
    // 表单验证通过后启用
    if (validateForm()) {
        submitBtn.disabled = false;
    }
</script>
```

#### :checked（选中状态）

```css
/* 单选框或复选框被选中 */
input[type="checkbox"]:checked {
    accent-color: #1890ff;
}

input[type="radio"]:checked {
    accent-color: #1890ff;
}

/* 下拉菜单选中项 */
option:checked {
    background-color: #1890ff;
    color: white;
}
```

**实战场景：** 自定义复选框

```html
<style>
    /* 隐藏原生复选框 */
    input[type="checkbox"] {
        display: none;
    }

    /* 自定义样式 */
    .checkbox-label {
        display: inline-flex;
        align-items: center;
        cursor: pointer;
        user-select: none;
    }

    .checkbox-box {
        width: 20px;
        height: 20px;
        border: 2px solid #ddd;
        border-radius: 4px;
        margin-right: 8px;
        transition: all 0.3s ease;
    }

    /* 复选框被选中时 */
    input[type="checkbox"]:checked + .checkbox-box {
        background-color: #1890ff;
        border-color: #1890ff;
    }

    input[type="checkbox"]:checked + .checkbox-box::after {
        content: '✓';
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
    }
</style>

<label class="checkbox-label">
    <input type="checkbox">
    <span class="checkbox-box"></span>
    <span>同意条款</span>
</label>
```

### 3. 结构伪类

#### :first-child 和 :last-child

```css
/* 第一个子元素 */
li:first-child {
    font-weight: bold;
    margin-top: 0;
}

/* 最后一个子元素 */
li:last-child {
    margin-bottom: 0;
    border-bottom: none;
}

/* 唯一的子元素 */
div:only-child {
    padding: 20px;
}
```

**实战场景：** 列表样式

```html
<style>
    ul {
        list-style: none;
        padding: 0;
    }

    li {
        padding: 10px;
        border-bottom: 1px solid #ddd;
    }

    li:first-child {
        border-top: 1px solid #ddd;
    }

    li:last-child {
        border-bottom: none;
    }
</style>

<ul>
    <li>项目 1</li>
    <li>项目 2</li>
    <li>项目 3</li>
</ul>
```

#### :nth-child(n) 和 :nth-of-type(n)

```css
/* 第 n 个子元素 */
li:nth-child(2) {
    /* 第 2 个 li */
}

/* 2n：偶数项 */
tr:nth-child(2n) {
    background-color: #f5f5f5;
}

/* 2n+1 或 odd：奇数项 */
tr:nth-child(2n+1) {
    background-color: white;
}

/* 前 3 个 */
li:nth-child(-n+3) {
    color: red;
}

/* 第 5 个及之后 */
li:nth-child(n+5) {
    opacity: 0.5;
}
```

**nth-child vs nth-of-type：**

```html
<style>
    /* nth-child：在所有子元素中计数 */
    .container p:nth-child(2) {
        /* 容器的第 2 个子元素，如果是 p 则匹配 */
    }

    /* nth-of-type：只在同类型元素中计数 */
    .container p:nth-of-type(2) {
        /* 容器中的第 2 个 p 元素 */
    }
</style>

<div class="container">
    <h2>标题</h2>        <!-- 第 1 个子元素 -->
    <p>段落 1</p>        <!-- 第 2 个子元素 -->
    <p>段落 2</p>        <!-- 第 3 个子元素 -->
</div>

<!-- 
p:nth-child(2)      匹配"段落 1"（是第 2 个子元素，且是 p）
p:nth-of-type(2)    匹配"段落 2"（是第 2 个 p 元素）
-->
```

**实战场景：** 表格斑马纹

```html
<style>
    tbody tr:nth-child(odd) {
        background-color: white;
    }

    tbody tr:nth-child(even) {
        background-color: #f9f9f9;
    }

    tbody tr:hover {
        background-color: #e8f5e9;
    }
</style>

<table>
    <tbody>
        <tr><td>行 1</td></tr>
        <tr><td>行 2</td></tr>
        <tr><td>行 3</td></tr>
    </tbody>
</table>
```

#### :empty（无子元素）

```css
/* 没有任何子节点的元素 */
div:empty {
    display: none;
    /* 隐藏空的 div */
}

li:empty::before {
    content: '(空)';
    color: #999;
}
```

### 4. 逻辑伪类

#### :not()（否定伪类）

```css
/* 不是 disabled 的输入框 */
input:not(:disabled) {
    cursor: text;
}

/* 不是最后一个子元素 */
li:not(:last-child) {
    margin-bottom: 10px;
}

/* 不是 .active 类的链接 */
a:not(.active) {
    color: blue;
}

/* 复杂选择器（CSS Selectors Level 4） */
:not(.header, .footer, .sidebar) {
    flex: 1;
}
```

**实战场景：** 选择性应用样式

```html
<style>
    button:not(:disabled) {
        cursor: pointer;
    }

    button:not(:disabled):hover {
        background-color: #0056b3;
    }

    li:not(:last-child) {
        border-bottom: 1px solid #ddd;
    }
</style>
```

#### :is() 和 :where()

```css
/* :is() - 权重取参数中最高的 */
:is(h1, h2, h3, h4, h5, h6) {
    margin-bottom: 20px;
}
/* 权重为 (0,0,0,1)，因为 h1-h6 都是元素选择器 */

/* :where() - 权重始终为 0 */
:where(h1, h2, h3, h4, h5, h6) {
    margin-bottom: 20px;
}
/* 权重始终为 (0,0,0,0)，不会与其他样式冲突 */

/* 实际应用：简化复杂选择器 */
article h1,
article h2,
article h3,
article h4 {
    color: navy;
}

/* 简化为 */
article :is(h1, h2, h3, h4) {
    color: navy;
}
```

### 5. 其他常见伪类

```css
/* :root - 文档根元素 */
:root {
    --primary-color: #1890ff;
}

/* :link - 未访问的链接 */
a:link {
    color: blue;
}

/* :target - URL 指向的元素 */
:target {
    background-color: yellow;
}

/* :lang() - 指定语言的元素 */
:lang(zh-CN) {
    font-family: 'Microsoft YaHei', sans-serif;
}

/* :valid 和 :invalid - 表单验证 */
input:valid {
    border-color: green;
}

input:invalid {
    border-color: red;
}

/* :required 和 :optional - 表单字段 */
input:required {
    /* 必填字段 */
}

input:optional {
    /* 可选字段 */
}
```

## 伪元素详解

### 1. ::before 和 ::after

最常用的伪元素，在元素前后插入虚拟内容。

```css
/* 在元素前插入内容 */
.warning::before {
    content: '⚠ ';
    color: #ff6b6b;
    font-weight: bold;
}

/* 在元素后插入内容 */
.new::after {
    content: ' NEW';
    background-color: #ff6b6b;
    color: white;
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 12px;
    margin-left: 5px;
}
```

**content 属性值：**

```css
/* 文本内容 */
::before { content: 'Hello'; }

/* 空内容 */
::before { content: ''; }

/* 属性值 */
a::after { content: attr(href); }

/* 计数器 */
li::before { content: counter(list); }

/* 多个内容组合 */
.icon::before { content: '→ '; }
```

**实战场景 1：** 装饰元素

```html
<style>
    .section-title {
        position: relative;
        padding-left: 20px;
    }

    .section-title::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        width: 4px;
        height: 20px;
        background-color: #1890ff;
        border-radius: 2px;
    }
</style>

<h2 class="section-title">Section Title</h2>
```

**实战场景 2：** 提示标记

```html
<style>
    .required::after {
        content: '*';
        color: red;
        margin-left: 4px;
    }

    .deprecated::after {
        content: ' (已弃用)';
        color: #999;
        font-size: 12px;
    }
</style>

<label class="required">Email</label>
<span class="deprecated">Old API</span>
```

**实战场景 3：** 清除浮动

```html
<style>
    .clearfix::after {
        content: '';
        display: table;
        clear: both;
    }
</style>

<div class="clearfix">
    <div class="float-left">Left</div>
    <div class="float-right">Right</div>
</div>
```

**实战场景 4：** 伪元素图标

```html
<style>
    .btn-close {
        position: relative;
        width: 24px;
        height: 24px;
        cursor: pointer;
    }

    .btn-close::before,
    .btn-close::after {
        content: '';
        position: absolute;
        left: 50%;
        top: 50%;
        width: 2px;
        height: 16px;
        background-color: #666;
        transform: translate(-50%, -50%) rotate(45deg);
    }

    .btn-close::after {
        transform: translate(-50%, -50%) rotate(-45deg);
    }
</style>

<button class="btn-close"></button>
```

### 2. ::first-line（首行）

```css
/* 段落的第一行 */
p::first-line {
    font-weight: bold;
    color: navy;
    text-transform: uppercase;
}

/* 允许的属性（受限） */
p::first-line {
    background-color: yellow;
    color: red;
    font-family: Arial;
    font-size: 1.2em;
    font-style: italic;
    font-weight: bold;
    line-height: 1.5;
    letter-spacing: 2px;
    /* 不能设置 width、height、margin、padding 等 */
}
```

**限制：** 只允许修改文本和字体相关属性

### 3. ::first-letter（首字母）

```css
/* 段落的第一个字母 */
p::first-letter {
    font-size: 2em;
    font-weight: bold;
    color: #ff6b6b;
    margin-right: 5px;
}

/* 常见用法：首字母大写效果 */
.article p::first-letter {
    font-size: 1.5em;
    color: navy;
}
```

**实战场景：** 排版美化

```html
<style>
    .article p::first-letter {
        font-size: 1.8em;
        font-weight: bold;
        color: #1890ff;
        float: left;
        margin-right: 8px;
        line-height: 1;
    }
</style>

<article class="article">
    <p>Lorem ipsum dolor sit amet...</p>
</article>
```

### 4. ::selection（文本选中）

```css
/* 用户选中的文本 */
::selection {
    background-color: #1890ff;
    color: white;
}

/* 特定元素的选中状态 */
.article ::selection {
    background-color: #ffeb3b;
    color: black;
}

/* 仅 Firefox 支持 ::-moz-selection */
::-moz-selection {
    background-color: #1890ff;
    color: white;
}
```

**实战场景：** 品牌化选中效果

```html
<style>
    /* 整个网站的选中效果 */
    ::selection {
        background-color: #1890ff;
        color: white;
    }

    /* 阅读文章时的选中效果 */
    .article ::selection {
        background-color: rgba(24, 144, 255, 0.2);
        color: inherit;
    }
</style>
```

### 5. ::placeholder（占位符文本）

```css
/* 输入框占位符 */
input::placeholder {
    color: #999;
    opacity: 1;  /* 在 Firefox 中需要显式设置 */
}

textarea::placeholder {
    color: #bbb;
    font-size: 14px;
}

/* 获得焦点时隐藏占位符 */
input:focus::placeholder {
    color: transparent;
}
```

**兼容性处理：**

```css
/* Chrome、Safari、Edge */
input::placeholder {
    color: #999;
}

/* Firefox */
input::-moz-placeholder {
    color: #999;
}

/* IE */
input:-ms-input-placeholder {
    color: #999;
}
```

### 6. ::caret-color（光标颜色）

```css
/* 输入框光标颜色 */
input::caret-color {
    color: #1890ff;
}

textarea::caret-color {
    color: #1890ff;
    caret-shape: block;  /* block | underscore */
}
```

### 7. 其他伪元素

```css
/* ::marker - 列表项标记 */
li::marker {
    color: #1890ff;
    font-weight: bold;
}

/* ::scrollbar - 滚动条（Webkit） */
::-webkit-scrollbar {
    width: 10px;
}

::-webkit-scrollbar-track {
    background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
    background: #555;
}

/* ::backdrop - 全屏元素后的背景 */
video::backdrop {
    background-color: black;
}

/* ::before - 见上文 */
/* ::after - 见上文 */
```

## 伪类 vs 伪元素对比

### 对比表格

| 特性 | 伪类 | 伪元素 |
|------|-----|--------|
| **选择器语法** | 单冒号 `:` | 双冒号 `::` |
| **本质** | 选择处于状态的元素 | 创建虚拟元素 |
| **权重** | (0,0,1,0) | (0,0,0,1) |
| **DOM 中存在** | ✅ 是 | ❌ 否 |
| **可应用次数** | 多个 | 单个（少数除外） |
| **能创建内容** | ❌ | ✅ 是 |
| **CSS 2 兼容** | ✅ | ⚠️ 需用 `:` |

### 代码对比

```css
/* 伪类：描述元素状态 */
a:hover {
    color: red;
}
/* 链接存在，伪类只是改变其状态 */

/* 伪元素：创建新元素 */
a::before {
    content: '→ ';
}
/* DOM 中没有新元素，但渲染时会显示 */
```

## 常见误区

### 误区 1：用冒号表示伪元素

```css
/* ❌ 错误 - CSS 2 写法，在某些浏览器中可能不支持 */
p:before { content: 'Intro: '; }
p:after { content: '.'; }

/* ✅ 正确 - CSS 3 标准写法 */
p::before { content: 'Intro: '; }
p::after { content: '.'; }
```

**注意：** 单冒号在 CSS 2 中用于伪元素，CSS 3 改为双冒号以区分伪类

### 误区 2：伪元素改变 DOM 结构

```javascript
// ❌ 错误认知
// 伪元素创建的内容在 JavaScript 中无法直接访问
const element = document.querySelector('p::before');
// 返回 null，因为伪元素不在 DOM 中

// ✅ 正确做法
const para = document.querySelector('p');
const computedStyle = getComputedStyle(para, '::before');
console.log(computedStyle.content);
```

### 误区 3：伪元素能接收事件

```css
/* ❌ 错误 - 伪元素不能直接接收事件 */
::before { 
    content: '✓';
    cursor: pointer;
}

/* ✅ 正确 - 通过父元素接收事件 */
.btn {
    cursor: pointer;
}

.btn::before {
    content: '✓';
}
```

### 误区 4：混淆 :not() 和 ::not()

```css
/* ✅ :not() 是伪类，用单冒号 */
li:not(.active) { color: gray; }

/* ❌ ::not() 不存在 */
li::not(.active) { /* 无效 */ }
```

## 性能考虑

### 伪类性能

```javascript
// 伪类性能影响较小，直接作用于真实元素
// :hover、:active 等是高效的

// ❌ 避免：过深的伪类嵌套
div > article > section:nth-child(even) > p:first-of-type:not(.hidden) { }

// ✅ 推荐：简化选择器
.highlight { }
```

### 伪元素性能

```css
/* ✅ 高效：简单的伪元素 */
.icon::before {
    content: '→';
}

/* ❌ 避免：复杂的伪元素动画 */
.animated::before {
    content: '';
    animation: complex-animation 10s infinite;  /* 高成本 */
}

/* ✅ 推荐：用 transform 而不是 top/left */
.animated::before {
    animation: slide 0.3s ease-out forwards;
}

@keyframes slide {
    from { transform: translateX(-100%); }
    to { transform: translateX(0); }
}
```

## 浏览器兼容性

### 伪类兼容性

```css
/* 广泛支持 */
:hover, :active, :focus, :visited { }  /* IE 8+ */

/* CSS 3 新增，需要检查 */
:nth-child(), :not(), :checked { }     /* IE 9+ */
:is(), :where() { }                     /* 现代浏览器 */
:focus-within { }                       /* 现代浏览器 */
```

### 伪元素兼容性

```css
/* CSS 2 写法（向后兼容）*/
:before, :after { }      /* IE 8+ 支持单冒号 */

/* CSS 3 写法（推荐）*/
::before, ::after { }    /* 现代浏览器 */

/* 新增伪元素 */
::placeholder { }        /* 需要前缀支持 */
::marker { }            /* 现代浏览器 */
::selection { }         /* 大多数浏览器 */
```

## 实战综合示例

### 示例 1：自定义表单

```html
<style>
    /* 隐藏原生复选框 */
    input[type="checkbox"] {
        display: none;
    }

    /* 伪元素作为自定义复选框 */
    input[type="checkbox"] + .checkbox {
        display: inline-block;
        width: 18px;
        height: 18px;
        border: 2px solid #ddd;
        border-radius: 3px;
        vertical-align: middle;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    /* :checked 伪类改变样式 */
    input[type="checkbox"]:checked + .checkbox {
        background-color: #1890ff;
        border-color: #1890ff;
    }

    /* ::after 伪元素显示勾选 */
    input[type="checkbox"]:checked + .checkbox::after {
        content: '✓';
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        color: white;
        font-weight: bold;
    }

    /* :disabled 伪类禁用状态 */
    input[type="checkbox"]:disabled + .checkbox {
        opacity: 0.5;
        cursor: not-allowed;
    }
</style>

<label>
    <input type="checkbox">
    <span class="checkbox"></span>
    同意协议
</label>

<label>
    <input type="checkbox" disabled>
    <span class="checkbox"></span>
    已禁用
</label>
```

### 示例 2：高级菜单

```html
<style>
    .menu {
        list-style: none;
        padding: 0;
    }

    .menu-item {
        position: relative;
        padding: 10px 16px;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    /* :hover 伪类 */
    .menu-item:hover {
        background-color: #f5f5f5;
    }

    /* ::before 装饰 */
    .menu-item::before {
        content: '';
        position: absolute;
        left: 0;
        bottom: 0;
        width: 0;
        height: 3px;
        background-color: #1890ff;
        transition: width 0.3s ease;
    }

    .menu-item:hover::before {
        width: 100%;
    }

    /* :not() 伪类移除最后一个分隔线 */
    .menu-item:not(:last-child) {
        border-bottom: 1px solid #ddd;
    }

    /* :nth-child() 伪类实现彩虹效果 */
    .menu-item:nth-child(1)::before { background-color: #ff6b6b; }
    .menu-item:nth-child(2)::before { background-color: #ffa94d; }
    .menu-item:nth-child(3)::before { background-color: #74b9ff; }
    .menu-item:nth-child(4)::before { background-color: #55efc4; }
</style>

<ul class="menu">
    <li class="menu-item">Home</li>
    <li class="menu-item">About</li>
    <li class="menu-item">Services</li>
    <li class="menu-item">Contact</li>
</ul>
```

### 示例 3：美化代码块

```html
<style>
    pre {
        background: #282c34;
        color: #abb2bf;
        padding: 16px;
        border-radius: 4px;
        overflow: auto;
        position: relative;
    }

    /* ::before 显示语言标签 */
    pre[data-lang]::before {
        content: attr(data-lang);
        position: absolute;
        top: 8px;
        right: 8px;
        background-color: #61afef;
        color: white;
        padding: 4px 8px;
        border-radius: 3px;
        font-size: 12px;
        font-weight: bold;
    }

    pre code {
        display: block;
    }

    /* ::selection 高亮选中代码 */
    pre code ::selection {
        background-color: rgba(97, 175, 239, 0.5);
    }
</style>

<pre data-lang="javascript"><code>
const greeting = 'Hello World';
console.log(greeting);
</code></pre>
```

## 开发建议

### ✅ 推荐做法

1. **理解概念，正确使用**
   - 伪类描述状态 `:hover`、`:focus` 等
   - 伪元素创建虚拟元素 `::before`、`::after` 等

2. **使用 CSS 3 语法**
   - 伪元素用双冒号 `::` 而不是 `:` 
   - 更清晰，避免混淆

3. **优先使用伪类处理状态**
   - 比 JavaScript 事件处理更高效
   - 代码更简洁

4. **伪元素用于装饰**
   - 不改变 DOM 结构
   - 保持 HTML 清洁

5. **注意浏览器兼容性**
   ```css
   /* Fallback 处理 */
   input::placeholder {
       color: #999;
   }
   
   input::-moz-placeholder {
       color: #999;
   }
   ```

### ❌ 避免做法

1. **用伪元素替代语义化 HTML**
   ```css
   /* ❌ 错误 */
   .title::after { content: '标题'; }
   
   /* ✅ 正确 */
   <h1>标题</h1>
   ```

2. **过度复杂的伪元素**
   ```css
   /* ❌ 避免过度使用伪元素制作图标 */
   .icon::before { /* 复杂样式... */ }
   .icon::after { /* 更多复杂样式... */ }
   
   /* ✅ 使用图片或图标字体 */
   <i class="iconfont">←</i>
   ```

3. **伪元素处理重要内容**
   ```css
   /* ❌ 错误 - 伪元素内容无法选中复制 */
   .price::before { content: '￥'; }
   
   /* ✅ 正确 - 重要内容放在 HTML 中 */
   <span class="price">￥<span>99.99</span></span>
   ```

4. **混淆伪类和伪元素**
   ```css
   /* ❌ 错误 */
   a::hover { color: red; }    /* 伪元素不能用 ::hover */
   p::first-child { }          /* 不存在 */
   
   /* ✅ 正确 */
   a:hover { color: red; }
   p:first-child { }
   ```

## 面试常见问题

**Q: 伪类和伪元素有什么区别？**

A: 伪类用于选择处于特定状态的真实元素，用单冒号 `:` 表示，如 `:hover`、`:focus`；伪元素用于创建不存在于 DOM 中的虚拟元素，用双冒号 `::` 表示，如 `::before`、`::after`。伪类的权重是 (0,0,1,0)，伪元素的权重是 (0,0,0,1)。

**Q: 为什么伪元素用双冒号表示？**

A: CSS 3 规范用双冒号 `::` 来区分伪元素和伪类。单冒号是 CSS 2 的旧写法，现代浏览器都支持双冒号。使用双冒号更清晰，能一眼看出是伪元素而不是伪类。

**Q: `::before` 和 `::after` 中的 content 可以删除吗？**

A: 不能。如果删除 `content` 属性，伪元素就不会显示。`content` 是伪元素必须的属性。如果不想显示内容，可以设置 `content: ''`（空字符串）。

**Q: 伪元素能在 JavaScript 中被访问吗？**

A: 不能直接访问。伪元素不在 DOM 树中，但可以通过 `getComputedStyle(element, '::before')` 获取其计算样式。如果需要在 JavaScript 中操作，应该使用真实的 DOM 元素。

**Q: `:not()` 中能用伪元素吗？**

A: 不能。`:not()` 中只能使用简单选择器，不能包含伪元素。比如 `:not(::before)` 是无效的。

**Q: visibility:hidden 和 opacity:0 都能隐藏伪元素吗？**

A: 能。伪元素会继承父元素的这些属性。如果父元素设置 `visibility: hidden` 或 `opacity: 0`，伪元素也会被隐藏。

**Q: 一个元素能有多个伪元素吗？**

A: 通常一个元素最多只能有一个伪元素作为选择器，但 `::before` 和 `::after` 可以同时存在，因为它们位置不同（一个前，一个后）。

**Q: 伪类和伪元素能一起使用吗？**

A: 能。比如 `a:hover::before` 是有效的，表示链接在悬停状态下的伪元素。

## 总结

- **伪类** - 选择器，描述元素状态，用 `:` 表示，权重 (0,0,1,0)
- **伪元素** - 创建虚拟元素，用 `::` 表示，权重 (0,0,0,1)
- **常见伪类** - `:hover`、`:active`、`:focus`、`:nth-child()`、`:not()` 等
- **常见伪元素** - `::before`、`::after`、`::first-line`、`::selection` 等
- **区分方法** - 看是否创建新元素：创建 → 伪元素；改变状态 → 伪类
- **性能** - 伪类、伪元素都很高效，但要避免过度复杂的选择器
- **兼容性** - 用 `::` 双冒号是 CSS 3 标准，更好的浏览器支持

掌握伪类和伪元素，是高效编写 CSS 的必备技能。
