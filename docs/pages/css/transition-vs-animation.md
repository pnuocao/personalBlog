# transition 和 animation 的区别

## 概述

`transition` 和 `animation` 都是 CSS3 中用于创建动画效果的属性，但它们的设计目的和使用场景有明显区别。

| 特性 | transition | animation |
|------|------------|-----------|
| 触发方式 | 需要触发条件（如 :hover） | 可自动播放 |
| 关键帧 | 只有开始和结束两个状态 | 可定义多个关键帧 |
| 循环播放 | 不支持 | 支持 |
| 暂停控制 | 不支持 | 支持 |
| 复杂度 | 简单 | 复杂 |

---

## transition 过渡

### 基本语法

```css
transition: property duration timing-function delay;
```

### 特点

1. **需要触发条件**：必须由状态变化触发（如 `:hover`、`:focus`、类名切换）
2. **两个状态**：只能定义起始状态和结束状态
3. **一次性**：触发一次执行一次
4. **可逆**：状态恢复时自动反向过渡

### 示例

```css
.button {
  background: blue;
  transition: background 0.3s ease;
}

.button:hover {
  background: red;
}
```

---

## animation 动画

### 基本语法

```css
/* 定义关键帧 */
@keyframes animationName {
  0% { /* 起始状态 */ }
  50% { /* 中间状态 */ }
  100% { /* 结束状态 */ }
}

/* 应用动画 */
animation: name duration timing-function delay iteration-count direction fill-mode play-state;
```

### 属性详解

| 属性 | 说明 | 可选值 |
|------|------|--------|
| animation-name | 动画名称 | 自定义名称 |
| animation-duration | 持续时间 | 时间值，如 1s |
| animation-timing-function | 时间函数 | ease, linear, cubic-bezier 等 |
| animation-delay | 延迟时间 | 时间值 |
| animation-iteration-count | 播放次数 | 数字 或 infinite |
| animation-direction | 播放方向 | normal, reverse, alternate |
| animation-fill-mode | 填充模式 | none, forwards, backwards, both |
| animation-play-state | 播放状态 | running, paused |

### 特点

1. **自动播放**：页面加载后可自动开始
2. **多关键帧**：可以定义任意多个中间状态
3. **循环播放**：支持无限循环
4. **精细控制**：可暂停、反向、设置填充模式

### 示例

```css
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

.bouncing {
  animation: bounce 1s ease infinite;
}
```

---

## 核心区别详解

### 1. 触发方式

```css
/* transition：需要触发条件 */
.box {
  opacity: 1;
  transition: opacity 0.3s;
}
.box:hover {
  opacity: 0.5;
}

/* animation：可自动播放 */
.box {
  animation: fadeIn 1s ease forwards;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

### 2. 关键帧数量

```css
/* transition：只有两个状态 */
.box {
  transform: translateX(0);
  transition: transform 1s;
}
.box:hover {
  transform: translateX(100px);
}

/* animation：多个关键帧 */
@keyframes complexMove {
  0% { transform: translateX(0); }
  25% { transform: translateX(50px) translateY(-30px); }
  50% { transform: translateX(100px) translateY(0); }
  75% { transform: translateX(50px) translateY(30px); }
  100% { transform: translateX(0); }
}
```

### 3. 循环能力

```css
/* transition：不能循环 */

/* animation：可以无限循环 */
.loading {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

### 4. 暂停控制

```css
/* animation：可以暂停 */
.animated {
  animation: move 2s linear infinite;
}

.animated:hover {
  animation-play-state: paused;
}
```

### 5. 填充模式

```css
/* animation：可以保持最终状态 */
.fade-in {
  opacity: 0;
  animation: fadeIn 1s ease forwards; /* forwards 保持结束状态 */
}

@keyframes fadeIn {
  to { opacity: 1; }
}
```

---

## 使用场景对比

### 适合使用 transition 的场景

1. **简单的状态切换**

```css
.button {
  background: #007bff;
  transition: background 0.2s ease;
}
.button:hover {
  background: #0056b3;
}
```

2. **交互反馈**

```css
.card {
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: box-shadow 0.3s, transform 0.3s;
}
.card:hover {
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
  transform: translateY(-5px);
}
```

3. **菜单展开/收起**

```css
.menu {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}
.menu.open {
  max-height: 500px;
}
```

### 适合使用 animation 的场景

1. **加载动画**

```css
@keyframes spinner {
  to { transform: rotate(360deg); }
}
.loading {
  animation: spinner 1s linear infinite;
}
```

2. **入场动画**

```css
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.page-enter {
  animation: slideInUp 0.5s ease forwards;
}
```

3. **持续动画效果**

```css
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
.floating {
  animation: float 3s ease-in-out infinite;
}
```

4. **复杂的多阶段动画**

```css
@keyframes attention {
  0%, 100% { transform: scale(1); }
  10%, 30% { transform: scale(0.9) rotate(-3deg); }
  20%, 40% { transform: scale(1.1) rotate(3deg); }
  50% { transform: scale(1); }
}
.shake {
  animation: attention 1s ease;
}
```

---

## 性能对比

两者在性能上没有本质区别，关键在于动画的属性：

```css
/* 高性能：只使用 transform 和 opacity */
.good {
  transition: transform 0.3s, opacity 0.3s;
}

/* 低性能：触发重排的属性 */
.bad {
  transition: width 0.3s, height 0.3s, top 0.3s;
}
```

::: tip 性能建议
无论使用 `transition` 还是 `animation`，都应该优先使用 `transform` 和 `opacity` 属性，它们只触发合成层，性能最佳。
:::

---

## JavaScript 控制

### transition 事件

```javascript
element.addEventListener('transitionend', (e) => {
  console.log(`${e.propertyName} 过渡完成`);
});
```

### animation 事件

```javascript
element.addEventListener('animationstart', () => {
  console.log('动画开始');
});

element.addEventListener('animationend', () => {
  console.log('动画结束');
});

element.addEventListener('animationiteration', () => {
  console.log('动画循环一次');
});
```

---

## 如何选择

```
需要动画效果？
    │
    ├── 是否需要自动播放？
    │       │
    │       ├── 是 → animation
    │       │
    │       └── 否 → 是否需要多个关键帧？
    │               │
    │               ├── 是 → animation
    │               │
    │               └── 否 → 是否需要循环？
    │                       │
    │                       ├── 是 → animation
    │                       │
    │                       └── 否 → transition
```

## 总结

| 场景 | 推荐 |
|------|------|
| hover、focus 等交互效果 | transition |
| 简单的两状态切换 | transition |
| 页面加载动画 | animation |
| 持续循环动画 | animation |
| 复杂的多阶段动画 | animation |
| 需要暂停/控制的动画 | animation |

- **transition** 更简单，适合交互触发的简单过渡
- **animation** 更强大，适合复杂的、自动播放的动画
- 两者可以配合使用，各取所长
