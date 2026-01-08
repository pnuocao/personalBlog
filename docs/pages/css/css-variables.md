# CSS 变量（自定义属性）的使用

## 什么是 CSS 变量

CSS 变量（官方名称：CSS 自定义属性）允许你在 CSS 中定义可复用的值。它们以 `--` 开头，通过 `var()` 函数引用。

```css
:root {
  --primary-color: #007bff;
}

.button {
  background: var(--primary-color);
}
```

## 基本语法

### 定义变量

```css
/* 全局变量（推荐定义在 :root 上） */
:root {
  --color-primary: #007bff;
  --spacing-unit: 8px;
}

/* 局部变量 */
.component {
  --component-padding: 20px;
}
```

### 使用变量

```css
.element {
  color: var(--color-primary);
  padding: var(--spacing-unit);
}
```

### 默认值（回退值）

```css
.element {
  /* 如果 --color-primary 未定义，使用 blue */
  color: var(--color-primary, blue);
  
  /* 多级回退 */
  background: var(--bg-color, var(--color-secondary, #ccc));
}
```

## 变量的作用域

```css
:root {
  --color: red; /* 全局 */
}

.dark-theme {
  --color: white; /* 覆盖 */
}

.element {
  color: var(--color); /* 在 .dark-theme 内是 white */
}
```

## 经典使用场景

### 1. 主题切换

```css
:root {
  --bg-color: #ffffff;
  --text-color: #333333;
}

[data-theme="dark"] {
  --bg-color: #1a1a1a;
  --text-color: #ffffff;
}

body {
  background: var(--bg-color);
  color: var(--text-color);
}
```

```javascript
// 切换主题
document.documentElement.setAttribute('data-theme', 'dark');
```

### 2. 响应式设计

```css
:root {
  --spacing: 24px;
  --font-size-h1: 2.5rem;
}

@media (max-width: 768px) {
  :root {
    --spacing: 16px;
    --font-size-h1: 1.75rem;
  }
}
```

### 3. 组件化设计

```css
.button {
  --btn-bg: #007bff;
  --btn-color: #fff;
  
  background: var(--btn-bg);
  color: var(--btn-color);
}

.button--secondary {
  --btn-bg: #6c757d;
}
```

### 4. 间距系统

```css
:root {
  --space-unit: 8px;
  --space-sm: var(--space-unit);
  --space-md: calc(var(--space-unit) * 2);
  --space-lg: calc(var(--space-unit) * 3);
}
```

## JavaScript 操作

```javascript
// 获取变量值
const color = getComputedStyle(document.documentElement)
  .getPropertyValue('--primary-color');

// 设置变量值
document.documentElement.style.setProperty('--primary-color', '#ff0000');

// 移除变量
document.documentElement.style.removeProperty('--primary-color');
```

## 与 calc() 配合

```css
:root {
  --base-size: 16px;
  --scale: 1.25;
}

h1 { font-size: calc(var(--base-size) * var(--scale) * var(--scale)); }
h2 { font-size: calc(var(--base-size) * var(--scale)); }
```

## 与预处理器对比

| 特性 | CSS 变量 | Sass/Less 变量 |
|------|----------|----------------|
| 运行时修改 | 支持 | 不支持 |
| 作用域 | 支持级联 | 词法作用域 |
| JavaScript 访问 | 支持 | 不支持 |
| 浏览器支持 | 现代浏览器 | 编译后通用 |

## 兼容性

| 浏览器 | 支持版本 |
|--------|----------|
| Chrome | 49+ |
| Firefox | 31+ |
| Safari | 9.1+ |
| Edge | 15+ |
| IE | 不支持 |

## 总结

- CSS 变量以 `--` 开头，用 `var()` 引用
- 支持作用域和继承，可在运行时修改
- 非常适合主题切换、响应式设计、组件化开发
- 可与 JavaScript 交互，实现动态样式
