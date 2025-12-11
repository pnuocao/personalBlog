# sticky 定位的原理和使用场景

## 前言

`position: sticky` 是一个相对较新的 CSS 定位方式，它结合了 `relative` 和 `fixed` 的特性。理解 `sticky` 的工作原理对于实现粘性头部、吸顶导航等常见交互至关重要。本文深入讲解 `sticky` 的原理、实现细节以及最佳实践。

## sticky 的核心概念

`sticky` 定位（粘性定位）使元素在**滚动到指定阈值**时会"粘"在该位置，直到滚出其所在容器为止。

### sticky 的工作原理

```
未滚动到阈值时：表现为 relative（占据文档流）
  ↓
滚动到阈值时：表现为 fixed（相对于容器顶部固定）
  ↓
滚出容器时：随容器一起滚出（继续占据文档流）
```

### sticky 必要条件

1. **必须指定至少一个阈值属性**：`top`、`right`、`bottom` 或 `left` 中的至少一个
   ```css
   /* ❌ 无效：没有指定阈值 */
   .sticky-box {
       position: sticky;
   }
   
   /* ✅ 有效：指定了 top */
   .sticky-box {
       position: sticky;
       top: 0;
   }
   ```

2. **元素必须有合适的容器**：粘性定位相对于其最近的**有滚动机制的祖先元素**
   ```css
   /* 场景 1：相对于视口 */
   .sticky {
       position: sticky;
       top: 0;
   }
   
   /* 场景 2：相对于 overflow 容器 */
   .scroll-container {
       overflow: auto;
       height: 500px;
   }
   
   .sticky {
       position: sticky;
       top: 0;  /* 相对于 .scroll-container */
   }
   ```

3. **防止隐藏**：`overflow: hidden` 会阻止 sticky 工作
   ```css
   /* ❌ sticky 失效 */
   .parent {
       overflow: hidden;
   }
   
   .sticky {
       position: sticky;
       top: 0;
   }
   
   /* ✅ 正确 */
   .parent {
       overflow: auto;  /* 或者不设置 overflow */
   }
   
   .sticky {
       position: sticky;
       top: 0;
   }
   ```

---

## sticky 的实现原理

### 1. 定位上下文（Containing Block）

Sticky 元素相对于的是其**最近的有滚动机制的祖先元素**或**视口**。

```html
<style>
    body {
        /* 视口本身就是一个滚动容器 */
    }
    
    .container {
        overflow: auto;  /* 创建新的滚动容器 */
        height: 400px;
    }
    
    .sticky-header {
        position: sticky;
        top: 0;  /* 相对于 .container 的顶部 */
    }
</style>

<div class="container">
    <div class="sticky-header">我会粘在容器顶部</div>
    <!-- 长内容 -->
</div>
```

### 2. 计算过程

当浏览器计算 sticky 元素的位置时：

```
1. 计算元素的初始位置（relative 模式）
2. 检查是否需要粘住（是否滚动到阈值）
   - 未到达阈值 → 按 relative 渲染
   - 已到达阈值 → 按 fixed 渲染
3. 检查是否超出容器范围
   - 在范围内 → 保持粘住状态
   - 超出范围 → 回到 relative 模式
```

**具体示例：**

```html
<style>
    .header {
        position: sticky;
        top: 60px;  /* 距容器顶部 60px 时粘住 */
        background: white;
    }
</style>

<!-- 
滚动时的变化：
1. scrollTop: 0-59px    → position: relative（正常排列）
2. scrollTop: 60px+     → position: fixed（距顶部 60px）
3. scrollTop 超过容器高度 → 随容器滚出
-->
```

### 3. 层叠上下文

Sticky 定位会创建新的层叠上下文：

```css
.sticky-header {
    position: sticky;
    top: 0;
    z-index: 10;  /* 在其他内容上方 */
}

.floating-box {
    position: fixed;
    z-index: 20;  /* 需要更高的 z-index 才能在 sticky 上方 */
}
```

---

## 实战场景

### 场景 1：表格头部粘性定位

```html
<style>
    .table-container {
        width: 100%;
        overflow-x: auto;
        max-height: 600px;
        overflow-y: auto;
    }
    
    table {
        width: 100%;
        border-collapse: collapse;
    }
    
    thead th {
        position: sticky;
        top: 0;
        background: #34495e;
        color: white;
        padding: 12px;
        text-align: left;
        z-index: 10;  /* 确保在 tbody 上方 */
    }
    
    tbody td {
        padding: 12px;
        border-bottom: 1px solid #ecf0f1;
    }
    
    tbody tr:hover {
        background: #f8f9fa;
    }
</style>

<div class="table-container">
    <table>
        <thead>
            <tr>
                <th>姓名</th>
                <th>职位</th>
                <th>部门</th>
                <th>工资</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>张三</td>
                <td>工程师</td>
                <td>技术部</td>
                <td>15k</td>
            </tr>
            <!-- 更多行... -->
        </tbody>
    </table>
</div>
```

### 场景 2：分类标题吸顶

```html
<style>
    .product-list {
        max-height: 800px;
        overflow-y: auto;
    }
    
    .category-title {
        position: sticky;
        top: 0;
        background: #2ecc71;
        color: white;
        padding: 15px;
        font-size: 18px;
        font-weight: bold;
        z-index: 10;
    }
    
    .product-item {
        padding: 12px;
        border-bottom: 1px solid #ecf0f1;
        display: flex;
        justify-content: space-between;
    }
</style>

<div class="product-list">
    <h3 class="category-title">手机</h3>
    <div class="product-item">
        <span>iPhone 15</span>
        <span>¥7999</span>
    </div>
    <div class="product-item">
        <span>iPhone 14</span>
        <span>¥6999</span>
    </div>
    
    <h3 class="category-title">平板</h3>
    <div class="product-item">
        <span>iPad Air</span>
        <span>¥5999</span>
    </div>
    <!-- 更多分类... -->
</div>
```

### 场景 3：导航栏吸顶

```html
<style>
    body {
        margin: 0;
        padding: 0;
    }
    
    .page-header {
        background: #1a1a1a;
        padding: 20px;
        color: white;
    }
    
    .navbar {
        position: sticky;
        top: 0;
        background: #2c3e50;
        padding: 15px;
        z-index: 100;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .navbar ul {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        gap: 20px;
    }
    
    .navbar a {
        color: white;
        text-decoration: none;
        transition: color 0.3s;
    }
    
    .navbar a:hover {
        color: #3498db;
    }
    
    .content {
        padding: 20px;
    }
    
    .section {
        margin-bottom: 100px;
    }
</style>

<div class="page-header">
    <h1>网站标题</h1>
</div>

<nav class="navbar">
    <ul>
        <li><a href="#home">首页</a></li>
        <li><a href="#about">关于</a></li>
        <li><a href="#services">服务</a></li>
        <li><a href="#contact">联系</a></li>
    </ul>
</nav>

<div class="content">
    <div class="section">
        <!-- 长内容 -->
    </div>
</div>
```

### 场景 4：多列 sticky（实现难点）

```html
<style>
    /* 横向 + 纵向都 sticky 的表格（需要特殊处理） */
    
    .table-wrapper {
        overflow-x: auto;
        overflow-y: auto;
        max-width: 100%;
        max-height: 600px;
    }
    
    table {
        border-collapse: collapse;
        width: 100%;
    }
    
    /* 第一列固定在左边 */
    th:first-child,
    td:first-child {
        position: sticky;
        left: 0;
        background: #f5f5f5;
        z-index: 5;
    }
    
    /* 表头固定在顶部 */
    th {
        position: sticky;
        top: 0;
        background: #34495e;
        color: white;
        z-index: 3;
    }
    
    /* 左上角的特殊处理 */
    th:first-child {
        z-index: 6;  /* 确保在所有元素上方 */
    }
    
    td, th {
        padding: 12px;
        text-align: left;
        border: 1px solid #ddd;
    }
</style>

<div class="table-wrapper">
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>名称</th>
                <th>类别</th>
                <th>价格</th>
                <th>库存</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>001</td>
                <td>产品 A</td>
                <td>类别 1</td>
                <td>¥99</td>
                <td>100</td>
            </tr>
            <!-- 更多行... -->
        </tbody>
    </table>
</div>
```

---

## 常见问题与解决方案

### 问题 1：sticky 不生效

```css
/* ❌ 常见原因 1：没有指定阈值 */
.sticky {
    position: sticky;
    /* 缺少 top/left/right/bottom */
}

/* ✅ 解决：添加阈值 */
.sticky {
    position: sticky;
    top: 0;
}

/* ❌ 常见原因 2：父容器有 overflow: hidden */
.parent {
    overflow: hidden;
}

/* ✅ 解决：改为 overflow: auto 或 visible */
.parent {
    overflow: auto;
}

/* ❌ 常见原因 3：z-index 不够高 */
.sticky {
    position: sticky;
    top: 0;
    z-index: 1;  /* 可能被其他元素覆盖 */
}

/* ✅ 解决：提高 z-index */
.sticky {
    position: sticky;
    top: 0;
    z-index: 10;
}
```

### 问题 2：sticky 元素与滚动容器的关系

```html
<style>
    /* 错误理解：sticky 相对于整个页面 */
    .sticky {
        position: sticky;
        top: 0;
    }
    
    /* 正确理解：sticky 相对于最近的滚动容器 */
    .scroll-container {
        overflow-y: auto;
        height: 400px;
    }
    
    .scroll-container .sticky {
        position: sticky;
        top: 0;  /* 相对于 .scroll-container 顶部 */
    }
</style>

<!-- 
实例 1：相对于视口
<body style="overflow-y: auto;">
    <div style="position: sticky; top: 0;">粘在视口顶部</div>
</body>

实例 2：相对于容器
<div style="overflow-y: auto; height: 500px;">
    <div style="position: sticky; top: 0;">粘在容器顶部</div>
</div>
-->
```

### 问题 3：多个 sticky 元素重叠

```html
<style>
    .sticky-section {
        position: sticky;
        top: 0;
        background: white;
    }
    
    /* 解决方案：使用不同的 z-index 或 top 值 */
    .sticky-section-1 {
        top: 0;
        z-index: 1;
    }
    
    .sticky-section-2 {
        top: 60px;  /* 在第一个下方 */
        z-index: 2;
    }
</style>

<div class="sticky-section sticky-section-1">第一个吸顶区域</div>
<!-- 内容 -->
<div class="sticky-section sticky-section-2">第二个吸顶区域</div>
```

---

## 浏览器兼容性

| 浏览器 | 支持版本 |
|--------|---------|
| Chrome | 56+ |
| Firefox | 59+ |
| Safari | 13+ |
| Edge | 15+ |
| IE | ❌ 不支持 |

**兼容性处理：**

```css
/* IE 降级方案 */
.sticky {
    position: -webkit-sticky;  /* Safari 前缀 */
    position: sticky;
    top: 0;
}

/* JavaScript 检测支持 */
function isStickySupportred() {
    const test = document.createElement('div');
    test.style.position = 'sticky';
    return test.style.position === 'sticky';
}

if (!isStickySupportred()) {
    // 使用 fixed 或其他降级方案
    document.querySelector('.sticky').style.position = 'fixed';
}
```

---

## 性能考虑

### 1. Sticky 元素的性能影响

```css
/* ✅ 性能优化 */
.sticky {
    position: sticky;
    top: 0;
    /* 避免频繁的 repaint */
    will-change: transform;  /* 提示浏览器优化 */
}

/* ❌ 性能问题 */
.sticky {
    position: sticky;
    top: 0;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);  /* 复杂阴影 */
    filter: drop-shadow(...);  /* 滤镜 */
}
```

### 2. 大量 sticky 元素

避免在同一个滚动容器中使用过多的 sticky 元素：

```html
<!-- ❌ 性能差：每个列表项都是 sticky -->
<div class="list">
    <div style="position: sticky; top: 0;">Item 1</div>
    <div style="position: sticky; top: 0;">Item 2</div>
    <div style="position: sticky; top: 0;">Item 3</div>
    <!-- 1000+ 项 -->
</div>

<!-- ✅ 性能好：只在关键位置使用 sticky -->
<div class="list">
    <h3 style="position: sticky; top: 0;">分类 1</h3>
    <div>Item 1</div>
    <div>Item 2</div>
    
    <h3 style="position: sticky; top: 0;">分类 2</h3>
    <div>Item 3</div>
</div>
```

---

## 总结与最佳实践

1. **确保指定阈值属性**：`sticky` 必须有 `top`、`left`、`right` 或 `bottom`
2. **理解定位上下文**：`sticky` 相对于最近的滚动容器或视口
3. **避免 `overflow: hidden`**：会导致 `sticky` 失效
4. **合理使用 `z-index`**：管理多个 sticky 元素的层级关系
5. **性能优化**：避免在 sticky 元素上使用复杂的 CSS 效果
6. **浏览器兼容性**：使用 `-webkit-` 前缀并提供降级方案
7. **用途明确**：主要用于表头、分类标题、导航栏等常用场景
