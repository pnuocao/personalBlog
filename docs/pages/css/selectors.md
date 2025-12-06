# CSS 选择器与优先级

## 前言

CSS 选择器是每个前端开发者必须掌握的基础知识。在实际项目中，我经常遇到样式冲突问题，根本原因往往是对选择器优先级理解不透彻。这道题也是面试高频考点，能够深入理解选择器优先级会直接提升代码质量。

## CSS 选择器分类

### 1. 基础选择器

#### 元素选择器
```css
/* 选择所有 p 元素 */
p { color: red; }

/* 选择所有元素 */
* { margin: 0; }
```

**权重：** `(0, 0, 0, 1)`

#### 类选择器
```css
/* 选择 class 为 container 的元素 */
.container { width: 1000px; }

/* 选择多个类 */
.btn.primary { background: blue; }
```

**权重：** `(0, 0, 1, 0)` 单个类

#### ID 选择器
```css
/* 选择 id 为 app 的元素 */
#app { font-size: 14px; }
```

**权重：** `(0, 1, 0, 0)`

#### 属性选择器
```css
/* 选择有 href 属性的元素 */
[href] { color: blue; }

/* 选择 type 属性值为 text 的元素 */
[type="text"] { border: 1px solid #ccc; }

/* 选择 class 属性包含 item 的元素 */
[class~="item"] { margin: 10px; }

/* 选择 href 属性以 https 开头的元素 */
[href^="https"] { color: green; }

/* 选择 href 属性以 .pdf 结尾的元素 */
[href$=".pdf"] { icon: '📄'; }

/* 选择 href 属性包含 example 的元素 */
[href*="example"] { color: purple; }
```

**权重：** `(0, 0, 1, 0)` 单个属性选择器

### 2. 伪类选择器

伪类表示元素的特殊状态。

```css
/* 链接未访问状态 */
a:link { color: blue; }

/* 链接已访问状态 */
a:visited { color: purple; }

/* 鼠标悬停状态 */
a:hover { color: red; }

/* 被激活状态 */
a:active { color: orange; }

/* 获得焦点状态 */
input:focus { border: 2px solid blue; }

/* 第一个子元素 */
li:first-child { font-weight: bold; }

/* 最后一个子元素 */
li:last-child { margin-bottom: 0; }

/* 第 n 个子元素（2n 为偶数，2n+1 为奇数） */
tr:nth-child(odd) { background: #f5f5f5; }
tr:nth-child(2n) { background: white; }

/* 唯一的子元素 */
div:only-child { padding: 20px; }

/* 没有子元素 */
li:empty { display: none; }

/* 匹配不符合选择器的元素 */
li:not(.disabled) { cursor: pointer; }

/* 元素被禁用 */
input:disabled { opacity: 0.5; }

/* 元素被启用 */
input:enabled { cursor: text; }

/* 单选框被选中 */
input[type="radio"]:checked { margin-right: 5px; }

/* 获得焦点或包含获得焦点的元素 */
div:focus-within { outline: 2px solid blue; }
```

**权重：** `(0, 0, 1, 0)` 单个伪类

### 3. 伪元素选择器

伪元素创建虚拟元素。

```css
/* 元素前插入内容 */
p::before { content: '✓ '; color: green; }

/* 元素后插入内容 */
p::after { content: ' 🔗'; }

/* 首行样式 */
p::first-line { font-weight: bold; }

/* 首字母样式 */
p::first-letter { font-size: 2em; color: red; }

/* 文本被选中时的样式 */
::selection { background: yellow; color: black; }

/* 滚动条样式 */
::-webkit-scrollbar { width: 10px; }
::-webkit-scrollbar-track { background: #f1f1f1; }
::-webkit-scrollbar-thumb { background: #888; }
```

**权重：** `(0, 0, 0, 1)` 单个伪元素

### 4. 组合选择器

#### 后代选择器（用空格分隔）
```css
/* 选择 div 内的所有 p 元素 */
div p { color: blue; }

/* 嵌套层数不限 */
article section p { margin: 0; }
```

#### 子元素选择器（用 > 分隔）
```css
/* 选择 div 的直接子元素 p，不包括孙元素 */
div > p { color: green; }
```

#### 相邻兄弟选择器（用 + 分隔）
```css
/* 选择紧邻在 h1 后的 p 元素，两者同级 */
h1 + p { margin-top: 0; }
```

#### 通用兄弟选择器（用 ~ 分隔）
```css
/* 选择在 h1 之后的所有 p 元素兄弟 */
h1 ~ p { color: gray; }
```

#### 分组选择器（用 , 分隔）
```css
/* 同时选择多个选择器 */
h1, h2, h3 { color: navy; }
.btn, .link { cursor: pointer; }
```

### 5. 高级选择器

#### :is() 伪类（CSS Selectors Level 4）
```css
/* 选择 article 或 section 内的 h1-h6 */
:is(article, section) h1,
:is(article, section) h2,
:is(article, section) h3 { color: blue; }

/* 等同于上面的简写 */
:is(article, section) :is(h1, h2, h3) { color: blue; }
```

权重取决于列表中权重最高的选择器。

#### :where() 伪类（CSS Selectors Level 4）
```css
/* 与 :is() 相同，但权重始终为 0 */
:where(article, section) h1 { color: blue; }
```

权重始终为 `(0, 0, 0, 0)`，即使内部选择器权重更高。

#### :has() 伪类（CSS Selectors Level 4）
```css
/* 选择包含 > img 的 div */
div:has(> img) { padding: 10px; }

/* 选择后面有 p 的 h1 */
h1:has(~ p) { margin-bottom: 20px; }
```

权重计算不包括 :has() 内部的选择器权重。

## CSS 优先级计算

### 优先级四位数表示法

优先级用 **(a, b, c, d)** 四位数表示：

| 位置 | 类型 | 权重值 | 举例 |
|-----|------|-------|------|
| a | !important | 1 | `color: red !important` |
| b | ID 选择器 | 1 | `#myid` |
| c | 类选择器、属性选择器、伪类 | 1 | `.class`, `[type="text"]`, `:hover` |
| d | 元素选择器、伪元素 | 1 | `p`, `div`, `::before` |

### 优先级计算规则

```javascript
// 优先级计算伪代码
function calculateSpecificity(selector) {
  let a = 0; // !important 的个数
  let b = 0; // ID 选择器的个数
  let c = 0; // 类、属性、伪类的个数
  let d = 0; // 元素、伪元素的个数
  
  // 计算各类型选择器个数
  // 比较时从左到右逐位比较
  // (1,0,0,0) > (0,1,0,0) > (0,0,1,0) > (0,0,0,1)
  
  return [a, b, c, d];
}
```

### 实战例子

#### 例1：基础选择器优先级对比

```css
/* (0, 0, 0, 1) - 元素选择器 */
p { color: red; }

/* (0, 0, 1, 0) - 类选择器，优先级更高 */
.text { color: blue; }

/* (0, 1, 0, 0) - ID 选择器，优先级最高 */
#content { color: green; }

/* (1, 0, 0, 0) - !important，优先级最最高 */
p { color: purple !important; }
```

**最终生效顺序（从低到高）：**
1. `p` → color: red（最低）
2. `.text` → color: blue（中）
3. `#content` → color: green（高）
4. `p { color: purple !important; }` → color: purple（最高）

#### 例2：复合选择器权重计算

```css
/* (0, 0, 2, 2) - 两个类 + 两个元素 */
div.container p.text { color: blue; }

/* (0, 1, 1, 1) - 一个 ID + 一个类 + 一个元素 */
#main .title p { color: green; }

/* (0, 0, 3, 0) - 三个类选择器 */
.wrapper .header .title { color: red; }
```

**权重对比：**
- (0, 1, 1, 1) > (0, 0, 3, 0) > (0, 0, 2, 2)
- 最终生效：color: green（#main .title p）

#### 例3：属性选择器与伪类

```css
/* (0, 0, 1, 1) - 一个属性选择器 + 一个元素 */
input[type="text"] { border: 1px solid gray; }

/* (0, 0, 2, 0) - 一个伪类 + 一个属性选择器 */
input[type="text"]:focus { border: 2px solid blue; }

/* (0, 0, 1, 1) - 一个伪类 + 一个元素 */
a:hover { color: red; }

/* (0, 0, 2, 1) - 两个伪类 + 一个元素 */
a:link:hover { text-decoration: underline; }
```

### 优先级规则总结

```
!important > 内联样式 > ID 选择器 > 类/属性/伪类 > 元素/伪元素 > 继承 > 浏览器默认样式
```

**详细排序（权重从高到低）：**

1. **!important** - (1, 0, 0, 0)
2. **内联样式** - style 属性 (1, 0, 0, 0)
3. **ID 选择器** - (0, 1, 0, 0)
4. **类选择器、属性选择器、伪类** - (0, 0, 1, 0)
5. **元素选择器、伪元素** - (0, 0, 0, 1)
6. **通用选择器** - (0, 0, 0, 0)
7. **继承的样式** - 优先级非常低
8. **浏览器默认样式** - 最低

## 特殊情况

### 通用选择器 (*)

```css
/* 权重为 (0, 0, 0, 0) - 不增加权重 */
* { margin: 0; padding: 0; }

/* 虽然使用了通用选择器，但权重仍为 (0, 0, 0, 1) */
*.text { color: blue; }
```

通用选择器不增加权重，但可以与其他选择器组合。

### 继承的样式

```html
<div style="color: red;">
    <p>这个 p 元素继承了红色，但优先级非常低</p>
</div>
```

```css
/* 即使只是元素选择器，也会覆盖继承的样式 */
p { color: blue; }
```

子元素的任何显式样式规则（即使是 `p { color: blue; }`）都会覆盖继承的样式。

### :not() 伪类的特殊性

```css
/* :not() 中的选择器不计入优先级 */
/* 权重只计算 :not() 本身的权重 */
p:not(.exception) { color: blue; } /* (0, 0, 1, 0) */

/* 即使 :not() 内是 ID 选择器，也只算伪类权重 */
p:not(#special) { color: blue; } /* (0, 0, 1, 0) */
```

:not() 内的选择器不参与权重计算，只计算伪类本身的权重。

### :is() 和 :where() 的权重差异

```css
/* :is() 取决于参数列表中最高权重的选择器 */
:is(h1, #title, .header) { color: blue; } /* 权重为 (0, 1, 0, 0)，因为有 ID */

/* :where() 权重始终为 0 */
:where(h1, #title, .header) { color: blue; } /* 权重为 (0, 0, 0, 0) */
```

这种差异在使用 :where() 写通用组件样式时很有用，因为它不会与其他样式冲突。

### 内联样式 vs !important

```html
<!-- 内联样式权重最高（除了 !important）-->
<p style="color: red;">Hello</p>
```

```css
/* 这个 !important 会覆盖内联样式 */
p {
    color: blue !important;
}
```

内联样式权重为 (1, 0, 0, 0)，仅次于 !important 规则。

## !important 的使用场景

虽然一般不推荐使用 !important，但在某些特定场景下是必要且合理的。理解这些场景是面试加分项。

### 场景1：覆盖第三方库的样式

当使用第三方 UI 库（如 Bootstrap、Ant Design）时，有时需要覆盖某些样式：

```css
/* UI库中的样式权重很高 */
/* .ant-btn { background: #1890ff !important; } */

/* 你的项目需要特殊样式 */
.my-theme .ant-btn {
    background: #ff4d4f !important; /* 必须用 !important 才能覆盖 */
}
```

**场景说明：** 第三方库已经在组件样式中使用了 !important，你只能用更强的 !important 来覆盖。

### 场景2：隐藏调试工具或不需要的元素

在生产环境中完全隐藏某个元素：

```css
/* 确保开发工具不会显示 */
.debug-panel {
    display: none !important;
    visibility: hidden !important;
}

/* 或者在响应式设计中强制隐藏 */
@media (max-width: 768px) {
    .sidebar {
        display: none !important; /* 确保不被其他样式意外显示 */
    }
}
```

**场景说明：** 需要绝对保证某些元素不显示，防止其他样式规则意外覆盖。

### 场景3：响应式设计中的关键样式

在响应式断点处强制应用重要样式：

```css
/* PC 端布局 */
.container {
    display: grid;
    grid-template-columns: 1fr 1fr;
}

/* 移动端必须单列布局 */
@media (max-width: 768px) {
    .container {
        grid-template-columns: 1fr !important; /* 防止被js动态修改覆盖 */
        gap: 10px !important;
    }
}
```

**场景说明：** JavaScript 可能会动态改变样式，!important 确保响应式断点的样式不被覆盖。

### 场景4：工具类样式（Utility-first CSS）

在 Tailwind CSS 等工具类框架中，经常使用 !important：

```css
/* Tailwind 中的实现方式 */
.m-0 {
    margin: 0 !important;
}

.p-4 {
    padding: 1rem !important;
}

.hidden {
    display: none !important;
}
```

**场景说明：** 工具类需要高优先级确保能够可靠地覆盖特定样式，这是设计模式的一部分。

### 场景5：与内联样式的对抗

当 HTML 中有内联样式，且你无法修改 HTML 时：

```html
<!-- 无法修改的第三方 HTML -->
<div style="color: red; font-size: 14px;">
    Third Party Content
</div>
```

```css
/* 必须用 !important 覆盖内联样式 */
div {
    color: blue !important;
    font-size: 16px !important;
}
```

**场景说明：** 内联样式权重为 (1, 0, 0, 0)，只能用 !important 才能覆盖。

### 场景6：渐进式增强和兼容性修复

修复特定浏览器的兼容性问题：

```css
/* 针对某些旧浏览器的兼容性修复 */
.flex-container {
    display: flex;
    
    /* IE 11 兼容性修复 */
    display: -ms-flexbox !important;
    -ms-flex-direction: row !important;
}

/* 高 DPI 屏幕上的清晰度修复 */
@media (-webkit-min-device-pixel-ratio: 2) {
    img {
        image-rendering: crisp-edges !important; /* 确保锐利显示 */
    }
}
```

**场景说明：** 某些兼容性修复需要绝对保证应用，防止被其他样式规则意外覆盖。

### 场景7：用户自定义主题系统

在动态主题切换系统中：

```css
/* 主题变量 */
:root {
    --primary-color: #1890ff;
}

/* 深色主题覆盖 */
.dark-theme {
    --primary-color: #177ddc !important; /* 确保所有使用此变量的组件都更新 */
}

/* 组件使用变量 */
.btn {
    background: var(--primary-color);
}
```

**场景说明：** 主题切换时需要确保变量被强制刷新，不被其他样式规则干扰。

## 使用 !important 的正确姿态

### 规则1：添加清晰注释

```css
/* ⚠️ 必须使用 !important，因为第三方库 antd 在样式中已使用 !important */
.custom-btn {
    background-color: #ff4d4f !important;
}

/* ⚠️ 强制隐藏：在响应式设计中确保不被 JavaScript 覆盖 */
@media (max-width: 768px) {
    .desktop-only {
        display: none !important;
    }
}
```

### 规则2：使用专门的 !important 类

```css
/* 集中管理所有需要 !important 的样式 */
.force-hide {
    display: none !important;
}

.force-show {
    display: block !important;
}

.force-primary-color {
    color: var(--primary-color) !important;
}
```

### 规则3：配合更高级的选择器

```css
/* 不好做法 */
.btn { color: red !important; }

/* 更好做法：配合更高权重的选择器 */
body.dark-theme .btn {
    color: #ddd !important; /* 只在特定上下文使用 */
}
```

### 规则4：文档化 !important 的用途

```css
/**
 * 全局 !important 样式集合
 * 
 * 这些样式使用 !important 的原因：
 * 1. 覆盖第三方库样式（antd, bootstrap）
 * 2. 响应式设计中强制应用关键样式
 * 3. 工具类（utility-first）框架的一部分
 * 
 * 新增 !important 样式前，请先考虑：
 * - 是否能用更高权重的选择器？
 * - 是否违反了代码的可维护性？
 */
```

## 同权重时的规则

当两个选择器权重完全相同时，**CSS 的层叠性**决定最终效果：

```css
/* 权重都是 (0, 0, 1, 0) */
.btn { background: blue; }
.btn { background: red; } /* 这个会生效，因为定义在后面 */
```

**在 HTML 中的顺序也会影响：**

```html
<head>
    <link rel="stylesheet" href="a.css"> <!-- .btn { background: blue; } -->
    <link rel="stylesheet" href="b.css"> <!-- .btn { background: red; } -->
</head>
<!-- b.css 后加载，所以 background: red 生效 -->
```

## 开发建议与最佳实践

### ✅ 推荐做法

1. **优先使用类选择器**
   - 权重适中，易于覆盖
   - 提高代码复用性和可维护性

```css
/* 推荐 */
.btn { padding: 10px 20px; }
.btn.primary { background: blue; }
.btn.danger { background: red; }
```

2. **限制 ID 选择器使用**
   - ID 权重过高，难以覆盖
   - 只在必要时使用（如 JavaScript 快速选择）

```css
/* 不推荐 */
#main-btn { padding: 10px 20px; }
#main-btn.primary { background: blue; }

/* 推荐 */
.btn { padding: 10px 20px; }
.btn.primary { background: blue; }
```

3. **谨慎使用 !important**
   - 通常不推荐，但有特定场景必须使用
   - 必须使用时要添加清晰注释说明原因

```css
/* 不推荐 - 没有必要的情况 */
.btn { background: blue !important; }

/* 推荐 - 用更高级的选择器 */
.btn { background: blue; }
.btn.primary { background: red; }
```

4. **保持选择器简洁**
   - 减少嵌套深度，提升性能
   - 便于维护和复用

```css
/* 不推荐 - 权重 (0, 0, 4, 3) */
article section .wrapper .container .title { }

/* 推荐 - 权重 (0, 0, 1, 0) */
.article-title { }
```

5. **合理使用后代选择器**
   - 避免过深的嵌套
   - 考虑使用 BEM 命名法

```css
/* 不推荐 */
.nav > ul > li > a { color: blue; }

/* 推荐 */
.nav__link { color: blue; }
```

### ❌ 避免做法

1. **滥用 ID 选择器**
   - 权重过高，样式难以重写
   - 违反 DRY 原则

2. **过度嵌套选择器**
   - 增加文件体积
   - 降低选择器性能（浏览器从右到左匹配）
   - 难以覆盖样式

3. **混乱使用 !important**
   - 一旦使用，后续就需要更多 !important 来覆盖
   - 形成 !important 螺旋式上升

4. **依赖继承解决样式问题**
   - 不够直观，难以维护
   - 容易被显式样式意外覆盖

## 性能考虑

CSS 选择器的性能也很重要，浏览器使用**从右到左**的匹配策略：

```css
/* 浏览器先找所有的 p，再检查是否在 div 内 */
div p { color: blue; }

/* 浏览器先找所有的 p.text，性能更好 */
p.text { color: blue; }

/* 避免这种低效的选择器 */
* > .container > .wrapper > p { } /* 效率最低 */
```

**优化建议：**

1. 避免通用选择器作为前缀
2. 减少选择器长度和复杂度
3. 避免后代选择器过长
4. 优先使用类选择器而不是元素选择器

## 面试常见问题

**Q: CSS 有哪些选择器？优先级如何计算？**

A: CSS 选择器分为基础选择器（元素、类、ID、属性）、伪类、伪元素、组合选择器。优先级用四位数 (a, b, c, d) 表示，其中 a 是 !important 个数，b 是 ID 个数，c 是类/属性/伪类个数，d 是元素/伪元素个数。从左到右逐位比较，左边更大则优先级更高。

**Q: !important 为什么不推荐使用？**

A: !important 优先级最高，会破坏优先级的自然流动。一旦使用，后续就需要更多 !important 来覆盖，形成"!important 螺旋"，导致样式混乱且难以维护。但在覆盖第三方库样式、响应式设计中的关键样式、工具类框架等特定场景下，!important 是必要的。重点是要清晰注释为什么使用。

**Q: 同权重的规则，哪个会生效？**

A: 当优先级相同时，CSS 的层叠性决定：定义在后面的规则会覆盖前面的规则。这适用于同一文件内和不同文件引入的顺序。

**Q: 为什么不推荐使用 ID 选择器？**

A: ID 选择器权重过高 (0, 1, 0, 0)，很难用其他选择器覆盖。这违反了"权重应该可控"的原则。通常只在 JavaScript 快速元素选择时使用，样式应该优先使用类选择器。

**Q: :not() 伪类如何计算权重？**

A: :not() 内的选择器不参与权重计算，只计算伪类本身的权重 (0, 0, 1, 0)。例如 `p:not(#special)` 的权重是 (0, 0, 1, 0) 而不是 (0, 1, 1, 0)。

**Q: :is() 和 :where() 有什么区别？**

A: 两者功能相同，区别在于权重。:is() 的权重取决于参数列表中最高权重的选择器，而 :where() 的权重始终为 0。:where() 常用于编写可复用的通用样式，避免权重冲突。

**Q: 什么情况下必须使用 !important？**

A: 虽然一般不推荐，但以下场景是必要的：1) 覆盖第三方库已使用 !important 的样式；2) 响应式设计中强制应用关键样式，防止 JS 覆盖；3) 工具类框架（Tailwind）中用于确保工具类的可靠性；4) 覆盖无法修改的内联样式；5) 动态主题系统中强制刷新变量。使用时必须添加清晰注释说明原因。

## 总结

- **选择器分类**：基础、伪类、伪元素、组合、高级选择器
- **优先级计算**：使用四位数 (a, b, c, d) 表示，从左到右比较
- **最佳实践**：优先使用类选择器，避免 ID 和 !important
- **特殊情况**：理解 :not()、:is()、:where() 等高级选择器的权重规则
- **性能优化**：浏览器从右到左匹配，简化选择器提升性能

掌握好选择器和优先级，是写出高质量、易维护 CSS 代码的基础。
