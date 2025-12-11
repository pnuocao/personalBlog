# position 定位值详解

## 前言

`position` 属性是 CSS 中实现元素定位的核心属性，它决定了元素如何在文档流中定位。不同的 `position` 值会改变元素的定位方式和它相对于其他元素的层级关系。理解各个 `position` 值的定位原点和特性对于实现复杂布局至关重要。

## position 的核心概念

`position` 属性用于设置元素的定位方式，配合 `top`、`right`、`bottom`、`left` 等属性使用，决定元素在平面空间中的具体位置。

## position 的主要值

### 1. static（静态定位 - 默认值）

**定义：** 元素按照文档流的正常顺序进行排列，是 `position` 的默认值。

**特性：**
- 元素按照标准文档流排列
- `top`、`right`、`bottom`、`left`、`z-index` 属性全部无效
- 不脱离文档流
- 不创建新的层叠上下文

**定位原点：** N/A（不涉及定位）

**代码示例：**

```css
div {
    position: static;  /* 默认值，通常可以不写 */
    top: 10px;        /* 无效 */
    left: 10px;       /* 无效 */
}
```

**应用场景：**
- 取消之前设置的定位（覆盖继承或之前的样式）
- 动态改变元素的定位方式时使用

```html
<style>
    .dynamic {
        position: absolute;
    }
    
    .dynamic.reset {
        position: static;  /* 恢复文档流排列 */
    }
</style>

<div class="dynamic reset">我回到文档流了</div>
```

---

### 2. relative（相对定位）

**定义：** 元素相对于其在文档流中的**原始位置**进行定位。

**特性：**
- 元素仍然占据文档流中的空间
- 相对于自己原来的位置进行偏移
- `top`、`right`、`bottom`、`left` 属性有效
- 可以设置 `z-index`，但不会自动创建层叠上下文（需要 z-index 不为 auto）
- 其他元素不会填补该元素原来的空间

**定位原点：** 元素在文档流中的**原始位置**（左上角）

**代码示例：**

```css
.relative-box {
    position: relative;
    top: 20px;    /* 相对原始位置向下偏移 20px */
    left: 30px;   /* 相对原始位置向右偏移 30px */
    z-index: 1;
}
```

**实战场景：**

```html
<style>
    .container {
        width: 200px;
        background: #f0f0f0;
        padding: 10px;
    }
    
    .box {
        width: 100px;
        height: 100px;
        background: #3498db;
        margin: 10px 0;
    }
    
    .box-relative {
        position: relative;
        top: 10px;      /* 向下移动 10px */
        left: 20px;     /* 向右移动 20px */
        background: #e74c3c;
    }
</style>

<div class="container">
    <div class="box">原始位置</div>
    <div class="box box-relative">相对定位，仍占原来的空间</div>
    <div class="box">恢复正常排列</div>
</div>
```

**关键理解：**
- 相对定位元素**不脱离文档流**，其原始空间被保留
- 下一个元素不会因为上一个元素相对定位后移动而填补空间
- 常用于微调元素位置或为绝对定位元素创建定位上下文

---

### 3. absolute（绝对定位）

**定义：** 元素相对于**最近的非 static 定位的祖先元素**（或根元素 `<html>`）进行定位。

**特性：**
- 元素从文档流中完全移除，不占用任何空间
- 其他元素会填补该元素原来的空间
- `top`、`right`、`bottom`、`left` 属性相对于定位父元素的内容框进行计算
- `width`、`height` 默认为 `auto`（收缩到内容）
- 可以设置 `z-index` 来控制层级
- 自动创建新的层叠上下文

**定位原点：** 最近的**非 static 定位祖先元素的内容框左上角**（或 `<html>` 元素）

**代码示例：**

```css
/* 创建定位上下文 */
.parent {
    position: relative;  /* 或 absolute, fixed, sticky 等 */
}

/* 绝对定位元素 */
.child {
    position: absolute;
    top: 0;
    left: 0;  /* 相对于 .parent 的左上角 */
    width: 50px;
    height: 50px;
}
```

**实战场景：**

```html
<style>
    /* 场景 1: 下拉菜单 */
    .menu-container {
        position: relative;  /* 创建定位上下文 */
        display: inline-block;
    }
    
    .menu-trigger {
        padding: 10px;
        background: #3498db;
        color: white;
        cursor: pointer;
    }
    
    .dropdown-menu {
        position: absolute;
        top: 100%;        /* 相对于 .menu-container 的下方 */
        left: 0;
        width: 150px;
        background: white;
        border: 1px solid #ccc;
        list-style: none;
        padding: 0;
        margin: 5px 0 0 0;
        display: none;
    }
    
    .menu-container:hover .dropdown-menu {
        display: block;
    }
</style>

<div class="menu-container">
    <button class="menu-trigger">菜单</button>
    <ul class="dropdown-menu">
        <li><a href="#">选项 1</a></li>
        <li><a href="#">选项 2</a></li>
        <li><a href="#">选项 3</a></li>
    </ul>
</div>
```

**常见问题：**

```html
<style>
    .grandparent { }  /* static 定位 */
    
    .parent { }       /* static 定位 */
    
    .child {
        position: absolute;
        /* ❌ 错误理解：会相对于 .parent 定位
           ✅ 正确：会相对于 .grandparent 定位（因为它是最近的定位元素）
           ✓ 实际：会相对于 <html> 或 <body> 定位（因为都是 static）
        */
    }
</style>

<!-- 如果需要相对于 .parent 定位 -->
<style>
    .parent { position: relative; }  /* 创建定位上下文 */
    
    .child {
        position: absolute;  /* 现在相对于 .parent 了 */
    }
</style>
```

---

### 4. fixed（固定定位）

**定义：** 元素相对于**视口（viewport）**进行固定定位，不随滚动而移动。

**特性：**
- 元素从文档流中完全移除
- 相对于视口的四条边（top, right, bottom, left）进行定位
- 不随页面滚动而移动
- 常用于创建固定导航栏、返回顶部按钮、悬浮窗等
- 创建新的层叠上下文
- 在某些情况下（如父元素有 transform），会相对于该父元素定位

**定位原点：** **浏览器视口的左上角**

**代码示例：**

```css
.fixed-nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;  /* 宽度 = viewport 宽度 - left 值 */
    height: 60px;
    background: #333;
    z-index: 1000;  /* 确保在其他元素上方 */
}

body {
    padding-top: 60px;  /* 为固定导航留出空间 */
}
```

**实战场景：**

```html
<style>
    /* 固定导航栏 */
    .navbar {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 60px;
        background: #2c3e50;
        color: white;
        z-index: 1000;
        display: flex;
        align-items: center;
        padding: 0 20px;
    }
    
    body {
        padding-top: 60px;
        margin: 0;
    }
    
    /* 返回顶部按钮 */
    .back-to-top {
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: #3498db;
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        z-index: 999;
        display: none;
    }
    
    .back-to-top.show {
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>

<nav class="navbar">导航栏始终固定在顶部</nav>
<button class="back-to-top">↑</button>

<script>
    window.addEventListener('scroll', function() {
        const btn = document.querySelector('.back-to-top');
        if (window.scrollY > 300) {
            btn.classList.add('show');
        } else {
            btn.classList.remove('show');
        }
    });
    
    document.querySelector('.back-to-top').addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
</script>
```

**注意事项：**

```css
/* ⚠️ 坑点：transform 会改变定位参考点 */
.parent {
    transform: translateX(0);  /* 创建了新的定位上下文！ */
}

.parent .fixed {
    position: fixed;  /* 会相对于 .parent 定位，而不是视口 */
}
```

---

### 5. sticky（粘性定位）

**定义：** 元素在滚动到**指定阈值**时会"粘"在指定位置，是 `relative` 和 `fixed` 的混合体。

**特性：**
- 在滚动到指定位置前表现为 `relative` 定位
- 滚动到指定位置后表现为 `fixed` 定位
- 必须指定 `top`、`right`、`bottom`、`left` 中的至少一个值，否则表现为 `static`
- 元素仍然占据文档流
- 粘性定位是**相对于最近的祖先元素的滚动容器**
- 兼容性较好，现代浏览器都支持

**定位原点：** 相对于**其所在的滚动容器**（通常是视口或带 `overflow` 的父元素）

**代码示例：**

```css
.sticky-header {
    position: sticky;
    top: 0;  /* 距离容器顶部 0px 时粘住 */
    background: white;
    z-index: 10;  /* 确保在内容上方 */
}
```

**更多 sticky 定位细节详见：[sticky 定位的原理和使用场景](./position-sticky.md)**

---

## 定位值对比表

| 属性值 | 文档流 | 定位参考 | 常用场景 |
|--------|--------|---------|---------|
| **static** | ✅ 占据 | N/A | 默认值、取消定位 |
| **relative** | ✅ 占据 | 自己的原始位置 | 微调位置、创建定位上下文 |
| **absolute** | ❌ 脱离 | 最近非 static 祖先 | 浮层、下拉菜单、模态框 |
| **fixed** | ❌ 脱离 | 视口 | 固定导航、返回顶部 |
| **sticky** | ✅ 占据 | 滚动容器 | 表格头部、分类标题 |

---

## 总结与最佳实践

1. **使用 `relative` 创建定位上下文**：`relative` 定位虽然不移动元素，但能为绝对定位子元素创建参考点
   ```css
   .container {
       position: relative;  /* 为内部 absolute 元素创建上下文 */
   }
   
   .overlay {
       position: absolute;
       top: 0;
       left: 0;
   }
   ```

2. **明确定位参考点**：在使用 `absolute` 前，确保有合适的 `position` 不为 `static` 的父元素

3. **`fixed` 导航栏记得留出空间**：使用 `padding-top` 或 `margin-top` 在 body 上留出固定元素的高度

4. **避免深层定位**：尽量不要让定位元素嵌套太深，容易造成维护困难

5. **`sticky` 需要指定阈值**：`top`、`left` 等属性必须指定，否则 `sticky` 失效

6. **关注 `z-index`**：绝对定位和固定定位元素通常需要设置 `z-index` 来控制层级

7. **浏览器兼容性**：`sticky` 在 IE 上不支持，需要考虑降级方案
