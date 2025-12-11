# CSS模块化方案

## 概念定义

CSS模块化是指通过技术手段将CSS代码分解为多个独立的模块，每个模块有独立的作用域，避免样式冲突和污染全局命名空间，提高代码的可维护性、可复用性和可扩展性。

---

## CSS模块化的核心问题

### 全局污染问题
```css
/* file1.css */
.button {
  color: red;
}

/* file2.css */
.button {
  color: blue;  /* 会覆盖上面的样式 */
}
```

### 样式冲突问题
```css
/* 不同组件都定义了 .container，容易产生冲突 */
.container { }
.title { }
.text { }
```

### 维护困难
- 不知道某个样式被哪些地方使用
- 删除样式时容易破坏其他页面
- 样式之间的依赖关系不清晰

---

## 主流模块化方案

### 1. **CSS Modules（推荐）**

#### 原理
CSS Modules 通过编译工具将类名编译为唯一的本地作用域名称，实现样式隔离。

#### 实现方式

**基础使用：**
```scss
// Button.module.scss
.button {
  padding: 10px 20px;
  background: #333;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: #555;
  }
}

.primary {
  background: #0066cc;
}

.secondary {
  background: #999;
}
```

**React 中的使用：**
```jsx
import styles from './Button.module.scss';

export const Button = ({ variant = 'primary', children }) => {
  return (
    <button className={`${styles.button} ${styles[variant]}`}>
      {children}
    </button>
  );
};
```

**编译后的结果：**
```javascript
// 类名被转换为唯一的哈希值
{
  button: "Button_button__2x3kL",
  primary: "Button_primary__3mK9x",
  secondary: "Button_secondary__7jH2m"
}
```

#### 高级用法

**全局样式引入：**
```scss
// Button.module.scss
:global {
  .animation {
    animation: fadeIn 0.3s;
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

**样式组合：**
```scss
// Button.module.scss
.base {
  padding: 10px 20px;
  border-radius: 4px;
}

.primary {
  composes: base;
  background: #333;
  color: white;
}

.secondary {
  composes: base;
  background: #999;
  color: white;
}
```

**跨文件组合：**
```scss
// common.module.scss
.flexCenter {
  display: flex;
  justify-content: center;
  align-items: center;
}

// Button.module.scss
.button {
  composes: flexCenter from './common.module.scss';
  padding: 10px 20px;
}
```

#### 优点
- ✅ 作用域隔离完全，无污染
- ✅ 不需要命名规范约束
- ✅ 类名冲突问题彻底解决
- ✅ 编译输出优化，自动删除未使用样式
- ✅ 与 JS 高度集成，易于动态样式

#### 缺点
- ❌ 需要编译工具支持
- ❌ 动态样式使用较复杂
- ❌ 全局样式处理不够优雅
- ❌ 学习成本相对较高

---

### 2. **BEM（Block Element Modifier）**

#### 原理
通过严格的命名规范来避免样式冲突，无需编译工具。

#### 命名规则

**基本格式：**
```
.Block__Element--Modifier
```

**解释：**
- **Block：** 独立的组件或块
- **Element：** Block 的子元素
- **Modifier：** 状态或变体

#### 实现方式

```scss
// ✅ Button 组件
.button {
  display: inline-block;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}

// Element：按钮内的图标
.button__icon {
  margin-right: 8px;
  vertical-align: middle;
}

// Element：按钮内的文字
.button__text {
  font-weight: 500;
}

// Modifier：主要按钮
.button--primary {
  background: #0066cc;
  color: white;

  &:hover {
    background: #0052a3;
  }
}

// Modifier：次要按钮
.button--secondary {
  background: #f0f0f0;
  color: #333;
  border: 1px solid #ddd;

  &:hover {
    background: #e6e6e6;
  }
}

// Modifier：禁用状态
.button--disabled {
  opacity: 0.6;
  cursor: not-allowed;

  &:hover {
    background: unchanged;
  }
}

// Modifier：大尺寸
.button--large {
  padding: 12px 24px;
  font-size: 16px;
}

// Modifier：小尺寸
.button--small {
  padding: 6px 12px;
  font-size: 12px;
}
```

**HTML 使用：**
```html
<!-- 基础按钮 -->
<button class="button button--primary">
  <span class="button__text">Click me</span>
</button>

<!-- 含图标的按钮 -->
<button class="button button--primary button--large">
  <span class="button__icon">🔍</span>
  <span class="button__text">Search</span>
</button>

<!-- 禁用状态 -->
<button class="button button--primary button--disabled" disabled>
  Disabled
</button>
```

#### 卡片组件示例

```scss
// Card 组件
.card {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
}

// Card 的标题元素
.card__header {
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.card__title {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
}

// Card 的内容
.card__body {
  padding: 20px;
}

.card__content {
  font-size: 14px;
  line-height: 1.6;
  color: #666;
}

// Card 的底部
.card__footer {
  padding: 20px;
  background: #f9f9f9;
  border-top: 1px solid #eee;
  text-align: right;
}

// Card 修饰符：高亮卡片
.card--highlight {
  border: 2px solid #0066cc;
  box-shadow: 0 2px 8px rgba(0, 102, 204, 0.1);
}

.card--highlight .card__header {
  background: #f0f7ff;
}

// 悬停效果修饰符
.card--hover:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
  transition: all 0.3s;
}

// 大小修饰符
.card--large {
  margin: 20px;
}

.card--large .card__header {
  padding: 30px;
}

.card--large .card__body {
  padding: 30px;
}
```

#### 优点
- ✅ 无需编译工具，纯 CSS
- ✅ 通俗易懂，约定大于配置
- ✅ 易于团队协作
- ✅ 兼容性好，不依赖框架

#### 缺点
- ❌ 类名冗长
- ❌ 依赖团队遵守规范
- ❌ 难以自动化验证
- ❌ 大型项目容易变得混乱

---

### 3. **Tailwind CSS（现代方案）**

#### 原理
使用工具类构建样式，通过预定义的原子类组合实现设计。

#### 实现方式

```jsx
// React 组件
export const Button = ({ variant = 'primary' }) => {
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
  };

  return (
    <button className={`px-4 py-2 rounded transition-colors ${variantClasses[variant]}`}>
      Click me
    </button>
  );
};
```

**自定义组件样式：**
```jsx
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#0066cc',
      },
    },
  },
};

// 在 CSS 中定义
@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-primary text-white rounded hover:opacity-90 transition-opacity;
  }
}
```

#### 优点
- ✅ 样式零污染，工具类自动生成
- ✅ 构建时删除未使用样式
- ✅ 一致的设计系统
- ✅ 快速开发
- ✅ 现代化开发体验

#### 缺点
- ❌ HTML 中类名数量多
- ❌ 学习曲线较陡
- ❌ 定制化需要配置

---

### 4. **OOCSS（面向对象 CSS）**

#### 原理
将样式分为结构（structure）和皮肤（skin），提高样式复用率。

#### 实现方式

```scss
// 结构：按钮的基础结构
.button {
  display: inline-block;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

// 皮肤：按钮的外观
.button-primary {
  background: #0066cc;
  color: white;
}

.button-secondary {
  background: #999;
  color: white;
}

// HTML：类名组合
<button class="button button-primary">Primary</button>
<button class="button button-secondary">Secondary</button>
```

#### 优点
- ✅ 样式复用率高
- ✅ 代码量少
- ✅ 易于维护

#### 缺点
- ❌ 需要多个类名
- ❌ HTML 结构复杂

---

### 5. **SMACSS（可扩展模块化架构 CSS）**

#### 原理
将 CSS 分为五大类：Base、Layout、Module、State、Theme。

#### 文件结构

```
css/
├── base/           # 基础样式
│   ├── reset.css
│   └── typography.css
├── layout/         # 布局样式
│   ├── header.css
│   └── grid.css
├── module/         # 可复用组件
│   ├── button.css
│   └── card.css
├── state/          # 状态样式
│   └── active.css
└── theme/          # 主题变量
    └── color.css
```

**命名规范：**
```scss
// Base - 标签选择器
html, body { }
h1, h2 { }

// Layout - l- 前缀
.l-header { }
.l-sidebar { }
.l-footer { }

// Module - 无前缀
.button { }
.card { }

// State - is- 前缀
.is-active { }
.is-disabled { }
.is-hidden { }

// Theme - theme- 前缀
.theme-light { }
.theme-dark { }
```

#### 优点
- ✅ 架构清晰
- ✅ 易于扩展
- ✅ 团队协作更容易

#### 缺点
- ❌ 规则较多
- ❌ 学习成本高

---

## 方案对比表

| 方案 | 隔离性 | 学习成本 | 编译工具 | 类名长度 | 适用场景 |
|------|--------|----------|---------|---------|---------|
| **CSS Modules** | 最强 | 中 | 需要 | 短 | React/Vue 项目 |
| **BEM** | 中等 | 低 | 不需要 | 长 | 大型项目、团队合作 |
| **Tailwind** | 强 | 中 | 需要 | 较长 | 现代前端项目 |
| **OOCSS** | 弱 | 低 | 不需要 | 中 | 简单项目 |
| **SMACSS** | 中等 | 高 | 不需要 | 中 | 大型企业项目 |

---

## 不同技术栈的最佳实践

### React 项目

**推荐：CSS Modules + Sass**
```jsx
// Button.module.scss
.button {
  padding: 10px 20px;
  background: #333;
  color: white;
}

// Button.jsx
import styles from './Button.module.scss';

export const Button = () => {
  return <button className={styles.button}>Click</button>;
};
```

**次选：Tailwind CSS**
```jsx
export const Button = () => {
  return <button className="px-4 py-2 bg-gray-800 text-white rounded">
    Click
  </button>;
};
```

---

### Vue 项目

**推荐：Scoped CSS**
```vue
<template>
  <button class="button">Click</button>
</template>

<style scoped>
.button {
  padding: 10px 20px;
  background: #333;
  color: white;
}
</style>
```

**次选：CSS Modules**
```vue
<template>
  <button :class="$style.button">Click</button>
</template>

<style module>
.button {
  padding: 10px 20px;
  background: #333;
  color: white;
}
</style>
```

---

### 原生 HTML/JS

**推荐：BEM**
```scss
.button {
  padding: 10px 20px;
}

.button--primary {
  background: #333;
  color: white;
}
```

**次选：SMACSS 或 OOCSS**

---

## 开发建议

### 1. **混合使用多种方案**
```scss
// 基础架构使用 SMACSS
// 组件编写使用 BEM
// 全局工具类使用 OOCSS
```

### 2. **避免过度设计**
```scss
// ❌ 为每个元素都创建类
.card__header__title__text--primary--active { }

// ✅ 保持简洁
.card__title--active { }
```

### 3. **考虑项目规模**
- 小型项目：BEM 或原生 CSS
- 中型项目：CSS Modules + BEM
- 大型项目：CSS Modules + Sass + 统一规范

### 4. **团队协作**
- 建立编码规范文档
- 在项目初期就确定模块化方案
- 定期进行代码审查

---

## 性能考虑

### CSS 文件大小
- **CSS Modules：** 编译时删除未使用样式，最优
- **Tailwind：** 生产环境通过 PurgeCSS 删除未使用类，体积小
- **BEM：** 依赖开发者规范，体积可能较大
- **OOCSS：** 复用率高，体积相对小

### 加载性能
```scss
// ✅ 推荐：分离关键 CSS
// critical.css - 首屏必需
// non-critical.css - 异步加载
```

### 运行时性能
所有方案的运行时性能相同，取决于最终输出的 CSS 质量。

---

## 现代项目推荐（2024+）

### 最佳实践组合：
1. **Tailwind CSS** + **CSS Modules**（混合使用）
2. **Vue 3** - 使用 `<style scoped>`
3. **React** - CSS Modules 或 Tailwind
4. **UX 设计系统** - Tailwind 配置集中管理

### 示例配置：

```jsx
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#0066cc',
      },
    },
  },
  plugins: [],
};

// CSS Modules 用于复杂组件逻辑
// Tailwind 用于简单样式组合
```

---

## 总结

- **CSS Modules：** 类型安全，最佳隔离
- **BEM：** 简单易用，无工具依赖
- **Tailwind：** 现代流行，开发快速
- **OOCSS/SMACSS：** 架构清晰，适合大团队

**选择建议：根据项目规模和团队技能选择合适的方案，不必拘泥于单一方案。**
