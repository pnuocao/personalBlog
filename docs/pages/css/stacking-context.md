# 层叠上下文详解

## 前言

层叠上下文（Stacking Context）是 CSS 中最容易被忽视但又非常重要的概念。许多开发者遇到过"明明设置了 `z-index: 9999` 却依然被其他元素覆盖"的情况，这通常是因为对层叠上下文的理解不足。本文深入讲解层叠上下文的产生条件、层叠顺序以及实战应用。

## 层叠上下文的核心概念

**层叠上下文**（Stacking Context）是 HTML 文档中的一个三维概念。在 CSS 2.1 规范中，每个盒子都有一个 z 轴位置，这决定了在重叠时的显示顺序。

### 关键理解

1. **层叠上下文是独立的**：每个层叠上下文都是独立的，父元素的 `z-index` 无法穿透到子元素所在的层叠上下文
2. **非叠加关系**：`z-index: 1000` 的子元素**不会**高于 `z-index: 1` 的兄弟元素的所有子元素
3. **树形结构**：层叠上下文形成一个树形结构，每个分支都是独立的层级系统

```
根元素（根层叠上下文）
├─ 元素 A（创建层叠上下文）
│  ├─ 子元素 A1（z-index: 9999 - 仍在 A 的上下文内）
│  └─ 子元素 A2
└─ 元素 B（创建层叠上下文）
   ├─ 子元素 B1（z-index: 1）
   └─ 子元素 B2

// 子元素 A1 即使 z-index: 9999 也无法覆盖子元素 B1（如果 A 的 z-index < B 的 z-index）
```

---

## 什么样的元素会产生层叠上下文？

### 1. 根元素（`<html>`）

根元素 `<html>` 自动创建最高级的层叠上下文（根层叠上下文）。

### 2. `position` 不是 `static` 且 `z-index` 不是 `auto`

```css
/* ✅ 创建层叠上下文 */
.positioned {
    position: relative;
    z-index: 1;  /* 不是 auto */
}

.absolute {
    position: absolute;
    z-index: 0;  /* 不是 auto（包括 0） */
}

/* ❌ 不创建层叠上下文 */
.no-context {
    position: relative;
    /* z-index: auto（默认值） */
}

.static {
    position: static;  /* z-index 对 static 无效 */
    z-index: 9999;  /* 被忽略 */
}
```

### 3. Flex 容器或 Grid 容器的子元素（`display: flex/grid` 且 `z-index` 不是 `auto`）

```css
/* 创建层叠上下文 */
.flex-container {
    display: flex;
}

.flex-item {
    z-index: 1;  /* ✅ 创建层叠上下文 */
}

.flex-item-2 {
    z-index: auto;  /* ❌ 不创建，表现为 0 */
}
```

### 4. `opacity` 小于 1

```css
/* ✅ 创建层叠上下文 */
.semi-transparent {
    opacity: 0.5;  /* 小于 1 */
}

/* ❌ 不创建 */
.opaque {
    opacity: 1;
}

.invisible {
    opacity: 0;  /* 虽然不可见，仍然创建上下文 */
}
```

**重要应用：** 这是为什么在某些情况下给父元素加 `opacity` 会影响子元素 `z-index` 的原因。

```html
<style>
    .parent {
        opacity: 0.9;  /* ⚠️ 创建新的层叠上下文 */
    }
    
    .parent .child {
        position: relative;
        z-index: 9999;  /* 无法高于其他层叠上下文 */
    }
</style>
```

### 5. `transform` 不是 `none`

```css
/* ✅ 创建层叠上下文 */
.transformed {
    transform: translate(10px, 10px);
}

.rotated {
    transform: rotate(45deg);
}

/* ❌ 不创建 */
.no-transform {
    transform: none;
}
```

**实战问题：** 这是为什么设置了 `transform` 的元素的 `fixed` 子元素不再相对于视口定位的原因。

```html
<style>
    .parent {
        transform: translateZ(0);  /* 创建层叠上下文和新的定位上下文 */
    }
    
    .parent .modal {
        position: fixed;  /* 相对于 .parent 而非视口 */
        top: 0;
        left: 0;
    }
</style>
```

### 6. `filter` 不是 `none`

```css
/* ✅ 创建层叠上下文 */
.filtered {
    filter: blur(5px);
}

.sepia {
    filter: sepia(0.5);
}

/* ❌ 不创建 */
.no-filter {
    filter: none;
}
```

### 7. `mix-blend-mode` 不是 `normal`

```css
/* ✅ 创建层叠上下文 */
.blended {
    mix-blend-mode: multiply;
}

/* ❌ 不创建 */
.normal-blend {
    mix-blend-mode: normal;
}
```

### 8. `will-change` 指定创建上下文的属性

```css
/* ✅ 创建层叠上下文 */
.optimize {
    will-change: transform;  /* 告诉浏览器会改变 transform */
}

.optimize-opacity {
    will-change: opacity;  /* 提前创建层叠上下文以优化性能 */
}

/* ❌ 不创建 */
.no-context {
    will-change: width;  /* width 不会创建上下文 */
}
```

### 9. `perspective` 不是 `none`

```css
/* ✅ 创建层叠上下文 */
.perspective {
    perspective: 1000px;
}

/* ❌ 不创建 */
.no-perspective {
    perspective: none;
}
```

### 10. `clip-path` 不是 `none`

```css
/* ✅ 创建层叠上下文 */
.clipped {
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 50%);
}

/* ❌ 不创建 */
.no-clip {
    clip-path: none;
}
```

### 完整的产生条件列表

| 条件 | 说明 |
|------|------|
| 根元素 `<html>` | 总是创建 |
| `position` ≠ `static` 且 `z-index` ≠ `auto` | 定位和层级非默认 |
| Flex/Grid 子元素且 `z-index` ≠ `auto` | 弹性/网格布局子项 |
| `opacity` < 1 | 半透明 |
| `transform` ≠ `none` | 变形变换 |
| `filter` ≠ `none` | 滤镜效果 |
| `mix-blend-mode` ≠ `normal` | 混合模式 |
| `will-change` 指定上述属性 | 性能优化提示 |
| `perspective` ≠ `none` | 3D 透视 |
| `clip-path` ≠ `none` | 裁剪路径 |
| `mask-image` / `mask-border` ≠ `none` | 遮罩 |
| `contain` 为特定值 | 容器查询 |

---

## 层叠顺序（Stacking Order）

同一个层叠上下文内，元素的层叠顺序（从下到上）为：

```
1. 背景和边框（Background and borders of the stacking context）
2. 负 z-index（Negative stack level）
3. 块级元素（Block-level elements in the normal flow）
4. 浮动元素（Floated elements）
5. 行内/行内块元素（Inline or inline-block elements）
6. z-index: 0（Positioned elements with z-index 0）
7. 正 z-index（Positive z-index）
```

### 可视化层叠顺序

```
从上到下：
┌─────────────────────────────────────┐
│  7. z-index: 100（位置元素）        │ ← 最顶层
│  7. z-index: 1（位置元素）          │
├─────────────────────────────────────┤
│  6. z-index: 0（位置元素）          │
├─────────────────────────────────────┤
│  5. inline-block（行内块）          │
│  4. float（浮动）                   │
│  3. block（块级）                   │
├─────────────────────────────────────┤
│  2. z-index: -1（负 z-index）      │
│  2. z-index: -100（负 z-index）    │
├─────────────────────────────────────┤
│  1. 背景和边框                      │ ← 最底层
└─────────────────────────────────────┘
```

### 实战示例

```html
<style>
    .context {
        position: relative;
        z-index: 1;  /* 创建新的层叠上下文 */
        width: 300px;
        height: 300px;
        background: #f5f5f5;
        border: 2px solid #333;
    }
    
    /* 层叠顺序演示 */
    .bg {
        position: absolute;
        width: 100px;
        height: 100px;
        top: 10px;
        left: 10px;
        background: #e74c3c;
        z-index: -1;  /* 最底层（负索引） */
    }
    
    .normal-block {
        width: 80px;
        height: 80px;
        background: #3498db;
        margin: 20px;
        /* z-index: auto，在正常文档流中 */
    }
    
    .float-box {
        width: 60px;
        height: 60px;
        background: #f39c12;
        float: left;
        margin: 10px;
        /* 浮动元素，比普通块级高 */
    }
    
    .inline-box {
        display: inline-block;
        width: 50px;
        height: 50px;
        background: #9b59b6;
        margin: 10px;
        /* 行内块，比浮动高 */
    }
    
    .z-index-zero {
        position: absolute;
        width: 40px;
        height: 40px;
        bottom: 10px;
        right: 10px;
        background: #1abc9c;
        z-index: 0;  /* 比行内块高 */
    }
    
    .z-index-positive {
        position: absolute;
        width: 30px;
        height: 30px;
        bottom: 20px;
        right: 20px;
        background: #2ecc71;
        z-index: 10;  /* 最顶层 */
    }
</style>

<div class="context">
    <div class="bg">负 z-index</div>
    <div class="normal-block">普通块级</div>
    <div class="float-box">浮动</div>
    <span class="inline-box">行内块</span>
    <div class="z-index-zero">z-index: 0</div>
    <div class="z-index-positive">z-index: 10</div>
</div>
```

---

## 常见问题与陷阱

### 问题 1：z-index 不生效

```html
<style>
    /* ❌ 问题：z-index 对 static 元素无效 */
    .no-effect {
        position: static;  /* 默认值 */
        z-index: 9999;
    }
    
    /* ✅ 解决：改为其他 position 值 */
    .fixed {
        position: relative;  /* 或 absolute、fixed 等 */
        z-index: 9999;
    }
</style>
```

### 问题 2：父元素的 z-index 无法覆盖子元素

```html
<style>
    /* 错误理解：认为父元素的 z-index 会作用于子元素 */
    
    .parent {
        position: relative;
        z-index: 100;  /* 这不会影响子元素的堆叠顺序 */
    }
    
    .parent .child {
        position: relative;
        z-index: 1;
    }
    
    .sibling {
        position: relative;
        z-index: 10;  /* 如果 sibling 是 parent 的兄弟元素 */
    }
    
    /* 
    实际结果：
    - parent 与 sibling 比较：parent 的 z-index (100) > sibling (10)，parent 更靠上
    - child 与 sibling 的内容比较：无法直接比较，因为它们在不同的层叠上下文
    - child 仍然在 parent 创建的层叠上下文内
    */
</style>

<!-- 示例 -->
<div class="parent">
    <div class="child">子元素</div>
</div>

<div class="sibling">兄弟元素</div>
```

### 问题 3：transform 导致的定位和层级问题

```html
<style>
    /* ❌ 坑点 */
    .modal-container {
        transform: translateZ(0);  /* 创建层叠上下文 */
    }
    
    .modal {
        position: fixed;  /* 不再相对于视口 */
        top: 0;
        left: 0;
        z-index: 9999;
    }
    
    /* ✅ 解决：避免在需要 fixed 定位的父元素上使用 transform */
    .modal-wrapper {
        /* 不使用 transform */
    }
    
    .modal {
        position: fixed;  /* 现在相对于视口 */
        top: 0;
        left: 0;
    }
</style>
```

### 问题 4：opacity 导致的意外层叠上下文

```html
<style>
    /* ❌ 问题：opacity 创建了新的层叠上下文 */
    .parent {
        opacity: 0.9;  /* 创建新的上下文！ */
    }
    
    .parent .child {
        position: relative;
        z-index: 9999;  /* 无法超出 parent 的层叠上下文 */
    }
    
    .outside {
        position: relative;
        z-index: 10;  /* 可能覆盖 child */
    }
    
    /* ✅ 解决 1：在兄弟元素上也设置 opacity */
    .sibling {
        opacity: 0.9;
    }
    
    /* ✅ 解决 2：不使用 opacity，用其他方式实现透明效果 */
    .parent {
        background: rgba(255,255,255,0.9);  /* 背景透明 */
        opacity: 1;  /* 不改变元素 opacity */
    }
</style>
```

### 问题 5：理解"同一层叠上下文"的概念

```html
<style>
    .context-a {
        position: relative;
        z-index: 1;  /* 创建新的层叠上下文 */
    }
    
    .context-a .child {
        position: relative;
        z-index: 9999;  /* 在 context-a 内最顶层 */
    }
    
    .context-b {
        position: relative;
        z-index: 2;  /* 创建新的层叠上下文 */
    }
    
    .context-b .child {
        position: relative;
        z-index: 1;  /* 在 context-b 内最顶层，但 z-index 远小于 context-a .child */
    }
    
    /* 
    层叠顺序：
    1. context-a .child（z-index: 9999 在 context-a 内）
       但整个 context-a 的 z-index 是 1
    
    2. context-b .child（z-index: 1 在 context-b 内）
       整个 context-b 的 z-index 是 2
    
    结果：context-b .child 会在最上方，因为 context-b (z-index: 2) > context-a (z-index: 1)
    
    ✅ 理解要点：比较的是上下文本身的 z-index，不是上下文内元素的 z-index
    */
</style>
```

---

## 实战应用

### 应用 1：模态框系统

```html
<style>
    /* 背景遮罩 */
    .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        z-index: 1000;  /* 高于常规内容 */
    }
    
    /* 模态框 */
    .modal {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        border-radius: 8px;
        z-index: 1001;  /* 高于背景遮罩 */
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    }
    
    /* 通知/提示信息 */
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: #2ecc71;
        z-index: 1002;  /* 最顶层 */
    }
</style>

<div class="modal-backdrop"></div>
<div class="modal">
    <h2>模态框</h2>
    <p>内容</p>
</div>
<div class="notification">通知消息</div>
```

### 应用 2：导航栏系统

```html
<style>
    /* 主导航栏 */
    .navbar {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: #2c3e50;
        z-index: 100;  /* 在内容上方 */
    }
    
    /* 下拉菜单 */
    .dropdown {
        position: absolute;
        top: 100%;
        left: 0;
        background: white;
        z-index: 101;  /* 高于导航栏本身 */
    }
    
    /* 搜索结果下拉 */
    .search-results {
        position: absolute;
        top: 100%;
        right: 0;
        background: white;
        z-index: 101;  /* 与菜单同级 */
        z-index: 102;  /* 如果需要在菜单上方 */
    }
</style>
```

### 应用 3：浮层管理器

```javascript
// 实战：管理多个浮层的 z-index
class LayerManager {
    constructor() {
        this.layers = new Map();
        this.baseZIndex = 1000;
        this.currentZIndex = this.baseZIndex;
    }
    
    // 创建新的浮层
    create(element, options = {}) {
        const zIndex = ++this.currentZIndex;
        element.style.zIndex = zIndex;
        element.style.position = element.style.position || 'fixed';
        
        this.layers.set(element, {
            zIndex,
            element,
            ...options
        });
        
        return zIndex;
    }
    
    // 置顶浮层
    toTop(element) {
        const zIndex = ++this.currentZIndex;
        element.style.zIndex = zIndex;
        
        if (this.layers.has(element)) {
            this.layers.get(element).zIndex = zIndex;
        }
        
        return zIndex;
    }
    
    // 关闭浮层
    close(element) {
        if (this.layers.has(element)) {
            this.layers.delete(element);
            element.remove();
        }
    }
    
    // 获取当前最高的 z-index
    getTopZIndex() {
        return this.currentZIndex;
    }
}

// 使用示例
const manager = new LayerManager();

const modal1 = document.createElement('div');
manager.create(modal1);  // z-index: 1001

const modal2 = document.createElement('div');
manager.create(modal2);  // z-index: 1002

// 点击 modal1 使其置顶
modal1.addEventListener('click', () => {
    manager.toTop(modal1);  // z-index: 1003
});
```

---

## 调试技巧

### 1. Chrome DevTools 中查看层叠上下文

```javascript
// 在控制台运行以高亮显示所有层叠上下文
document.querySelectorAll('*').forEach(el => {
    const styles = getComputedStyle(el);
    
    // 检查是否创建了层叠上下文
    const indicators = [
        styles.position !== 'static' && styles.zIndex !== 'auto',
        styles.opacity !== '1',
        styles.transform !== 'none',
        styles.filter !== 'none',
        styles.mixBlendMode !== 'normal',
    ];
    
    if (indicators.some(Boolean)) {
        el.style.outline = '2px solid red';
    }
});
```

### 2. 检查 z-index 冲突

```javascript
// 查找 z-index 的所有值
const zIndexes = [];
document.querySelectorAll('*').forEach(el => {
    const zIndex = getComputedStyle(el).zIndex;
    if (zIndex !== 'auto') {
        zIndexes.push({
            element: el,
            zIndex: parseInt(zIndex),
            stackingContext: getStackingContext(el)
        });
    }
});

// 按 z-index 排序
zIndexes.sort((a, b) => a.zIndex - b.zIndex);
console.table(zIndexes);
```

---

## 总结与最佳实践

1. **理解层叠上下文的独立性**：不同层叠上下文内的元素 `z-index` 无法直接比较
2. **避免创建不必要的层叠上下文**：特别是在需要深度定位的场景
3. **使用 z-index 分层策略**：
   - 基础层：0-99
   - 浮层：100-999
   - 模态框：1000-1999
   - 通知/提示：2000+

4. **关注产生上下文的属性**：`opacity`、`transform`、`filter` 等会意外创建上下文
5. **使用层管理器**：在复杂应用中使用专门的层管理系统
6. **避免过大的 z-index 值**：不需要使用 `z-index: 9999`，合理的分层即可
7. **充分利用 DevTools**：调试时在 DevTools 中查看元素的计算样式

