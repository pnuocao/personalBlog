# 单行文本、多行文本溢出省略显示

## 问题定义

文本溢出省略是前端开发中常见的需求，当文本内容超出容器宽度或高度时，需要用省略号（...）来表示被截断的内容，提升用户体验。

## 单行文本溢出省略

### 实现方案

```css
.single-line-ellipsis {
  width: 200px; /* 必须设置宽度 */
  white-space: nowrap; /* 不换行 */
  overflow: hidden; /* 隐藏溢出内容 */
  text-overflow: ellipsis; /* 显示省略号 */
}
```

### 关键属性说明

- `white-space: nowrap`：强制文本在一行内显示，不换行
- `overflow: hidden`：隐藏超出容器的内容
- `text-overflow: ellipsis`：在截断处显示省略号
- 必须设置具体的宽度值

### 使用示例

```html
<div class="single-line-ellipsis">
  这是一段很长的文本内容，超出容器宽度时会显示省略号
</div>
```

## 多行文本溢出省略

### 方案一：-webkit-line-clamp（推荐）

```css
.multi-line-ellipsis {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3; /* 显示行数 */
  overflow: hidden;
  text-overflow: ellipsis;
}
```

### 方案二：定高 + overflow（兼容性更好）

```css
.multi-line-ellipsis-fallback {
  height: 4.5em; /* 行高 * 行数 */
  line-height: 1.5em;
  overflow: hidden;
  position: relative;
}

.multi-line-ellipsis-fallback::after {
  content: '...';
  position: absolute;
  bottom: 0;
  right: 0;
  background: white;
  padding-left: 20px;
}
```

### 方案三：JavaScript 实现

```javascript
function truncateText(element, maxLines) {
  const lineHeight = parseInt(window.getComputedStyle(element).lineHeight);
  const maxHeight = lineHeight * maxLines;
  
  if (element.scrollHeight > maxHeight) {
    let text = element.textContent;
    while (element.scrollHeight > maxHeight && text.length > 0) {
      text = text.slice(0, -1);
      element.textContent = text + '...';
    }
  }
}
```

## 兼容性考虑

### -webkit-line-clamp 兼容性

- **支持**：Chrome 6+、Safari 5+、Firefox 68+
- **不支持**：IE 全版本
- **移动端**：iOS Safari 5+、Android 2.1+

### 兼容性解决方案

```css
.multi-line-ellipsis {
  /* 现代浏览器 */
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}

/* IE 兼容 */
@media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
  .multi-line-ellipsis {
    display: block;
    height: 4.5em;
    overflow: hidden;
  }
}
```

## 性能优化

### 1. 避免频繁重排

```css
/* 使用 transform 代替改变 width */
.ellipsis-container {
  transform: translateZ(0); /* 开启硬件加速 */
}
```

### 2. 使用 CSS 变量

```css
:root {
  --max-lines: 3;
  --line-height: 1.5em;
}

.multi-line-ellipsis {
  -webkit-line-clamp: var(--max-lines);
  line-height: var(--line-height);
}
```

## 实际应用场景

### 1. 卡片式布局

```css
.card-title {
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-description {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
```

### 2. 表格单元格

```css
.table-cell {
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

### 3. 响应式文本截断

```css
.responsive-ellipsis {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (max-width: 768px) {
  .responsive-ellipsis {
    -webkit-line-clamp: 2;
  }
}

@media (min-width: 769px) {
  .responsive-ellipsis {
    -webkit-line-clamp: 3;
  }
}
```

## 注意事项

### 1. 容器宽度设置

- 单行省略必须设置具体宽度或 `max-width`
- 多行省略需要设置容器高度约束

### 2. 字体和行高影响

```css
/* 确保行高计算准确 */
.ellipsis-text {
  font-family: Arial, sans-serif;
  line-height: 1.4; /* 建议使用数值而非单位 */
}
```

### 3. 动态内容处理

```javascript
// 监听内容变化，重新计算省略
const observer = new MutationObserver(() => {
  updateTextEllipsis();
});

observer.observe(textElement, {
  childList: true,
  characterData: true,
  subtree: true
});
```

## 总结

文本溢出省略是提升用户体验的重要技术：

1. **单行省略**：使用 `white-space: nowrap` + `overflow: hidden` + `text-overflow: ellipsis`
2. **多行省略**：优先使用 `-webkit-line-clamp`，IE 需要降级方案
3. **兼容性**：现代浏览器支持良好，IE 需要特殊处理
4. **性能**：避免频繁的 DOM 操作和重排重绘
5. **响应式**：根据设备和容器大小调整截断行数

掌握这些技术能够有效处理各种文本显示需求，提升页面的视觉效果和用户体验。