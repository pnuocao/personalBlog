# Flex 布局

## 前言

Flexbox（弹性盒子布局）是现代 CSS 最强大的布局方案，它彻底改变了我们对页面布局的思考方式。在实际工作中，从导航栏、卡片布局到复杂的后台系统，Flex 几乎无处不在。掌握 Flex 的原理和常用属性，是成为专业前端开发者的必备技能。这道题考察的是对现代布局方式的理解深度，以及是否能够灵活应对各种布局需求。

## Flex 布局的定义

**Flexbox** 是一个一维布局模型，用于在容器中分配空间和对齐元素。它提供了一种更高效、更灵活的方式来排列、分配和对齐容器内的项目，即使它们的大小不固定。

### 核心概念

Flex 布局由两个关键角色组成：

1. **Flex 容器（Flex Container）** - 设置 `display: flex` 的元素
2. **Flex 项目（Flex Item）** - 容器直接子元素

```
┌─────── Flex 容器 ──────────────────────┐
│                                        │
│  ┌────────┐  ┌────────┐  ┌────────┐  │
│  │ Item 1 │  │ Item 2 │  │ Item 3 │  │
│  └────────┘  └────────┘  └────────┘  │
│                                        │
└────────────────────────────────────────┘
```

---

## Flex 容器属性

### 1. display: flex

启用 Flex 布局的基础属性：

```css
.container {
  display: flex;
  /* 或 display: inline-flex 用于行内级元素 */
}
```

**区别**：
- `flex` - 容器是块级元素（占满一行）
- `inline-flex` - 容器是行内级元素（不占满一行）

---

### 2. flex-direction（主轴方向）

定义 Flex 项目的排列方向：

```css
.container {
  flex-direction: row | row-reverse | column | column-reverse;
}
```

| 值 | 描述 | 示例 |
|------|------|------|
| `row` | 从左到右（默认） | → → → |
| `row-reverse` | 从右到左 | ← ← ← |
| `column` | 从上到下 | ↓ ↓ ↓ |
| `column-reverse` | 从下到上 | ↑ ↑ ↑ |

**实际应用**：
```css
/* 竖排列表 */
.vertical-list {
  display: flex;
  flex-direction: column;
}

/* 反向导航（特殊需求） */
.nav-reverse {
  display: flex;
  flex-direction: row-reverse;
}
```

---

### 3. flex-wrap（换行）

控制项目是否换行：

```css
.container {
  flex-wrap: nowrap | wrap | wrap-reverse;
}
```

| 值 | 描述 |
|------|------|
| `nowrap` | 不换行，压缩项目（默认） |
| `wrap` | 换行，首行在上 |
| `wrap-reverse` | 换行，首行在下 |

**关键差异**：
```css
/* 保证所有项目不被压缩 */
.card-grid {
  display: flex;
  flex-wrap: wrap;
}

/* 项目宽度会被压缩以适应一行 */
.navbar {
  display: flex;
  flex-wrap: nowrap;
}
```

---

### 4. justify-content（主轴对齐）

控制项目在**主轴**上的对齐方式：

```css
.container {
  justify-content: flex-start | flex-end | center | space-between | space-around | space-evenly;
}
```

| 值 | 描述 | 示意 |
|------|------|------|
| `flex-start` | 靠近起点（默认） | [●●●]_____ |
| `flex-end` | 靠近终点 | _____[●●●] |
| `center` | 居中 | __[●●●]___ |
| `space-between` | 两端对齐，项目间平均分布 | ●___●___● |
| `space-around` | 项目周围均匀分布 | _●__●__●_ |
| `space-evenly` | 项目之间间隔相等 | _●_●_●_ |

**实战场景**：
```css
/* 导航栏：两端对齐 */
.navbar {
  display: flex;
  justify-content: space-between;
}

/* 按钮组：居中 */
.button-group {
  display: flex;
  justify-content: center;
}

/* 栅格布局：均匀分布 */
.grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
}
```

---

### 5. align-items（交叉轴对齐）

控制项目在**交叉轴**上的对齐方式（主轴为行时，交叉轴为列）：

```css
.container {
  align-items: flex-start | flex-end | center | stretch | baseline;
}
```

| 值 | 描述 |
|------|------|
| `flex-start` | 靠近交叉轴起点 |
| `flex-end` | 靠近交叉轴终点 |
| `center` | 交叉轴居中 |
| `stretch` | 拉伸以填充容器（默认） |
| `baseline` | 按基线对齐 |

**常用示例**：
```css
/* 垂直居中（与 justify-content: center 组合实现完全居中） */
.center-box {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 300px;
  height: 300px;
}

/* 顶部对齐的列表 */
.list {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
```

---

### 6. align-content（多行对齐）

当有**多行**项目时，控制行与行之间的对齐方式：

```css
.container {
  align-content: flex-start | flex-end | center | space-between | space-around | stretch;
}
```

**注意**：仅在 `flex-wrap: wrap` 且有多行时有效。

```css
/* 多行项目在交叉轴上均匀分布 */
.multi-line-grid {
  display: flex;
  flex-wrap: wrap;
  align-content: space-around;
}
```

---

### 7. gap（项目间距）

设置项目之间的间距（所有行和列）：

```css
.container {
  gap: 10px;           /* 行列间距都是 10px */
  gap: 10px 20px;      /* 行间距 10px，列间距 20px */
  row-gap: 10px;       /* 仅行间距 */
  column-gap: 20px;    /* 仅列间距 */
}
```

**实战应用**：
```css
/* 卡片网格 */
.card-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

/* 导航项目 */
.navbar-items {
  display: flex;
  gap: 0 30px;  /* 只有列间距 */
}
```

---

## Flex 项目属性

### 1. flex-basis（基础尺寸）

定义项目在分配剩余空间之前的默认尺寸：

```css
.item {
  flex-basis: auto | <length>;
}
```

```css
/* 每个项目基础宽度为 200px */
.item {
  flex-basis: 200px;
}

/* auto 表示参考 width/height 属性 */
.item {
  flex-basis: auto;
  width: 200px;
}
```

---

### 2. flex-grow（增长因子）

定义项目如何分配容器中的**剩余空间**（默认值：0）：

```css
.item {
  flex-grow: <number>;
}
```

**原理**：
```
剩余空间 = 容器宽度 - 所有项目基础宽度之和
项目实际增长量 = 剩余空间 × (自身 flex-grow / 所有 flex-grow 之和)
```

**示例**：
```css
.container {
  display: flex;
  width: 1000px;
}

.item {
  flex-basis: 100px;
  flex-grow: 1;  /* 所有项目均分剩余空间 */
}

/* 结果：每项宽度 = 100 + (1000 - 300) / 3 = 333.33px */
```

---

### 3. flex-shrink（收缩因子）

定义项目如何**收缩**以适应容器（默认值：1）：

```css
.item {
  flex-shrink: <number>;
}
```

**原理**：
```
溢出空间 = 所有项目宽度之和 - 容器宽度
项目实际收缩量 = 溢出空间 × (自身 flex-shrink × flex-basis) / (所有项目的 flex-shrink × flex-basis 之和)
```

**示例**：
```css
.container {
  display: flex;
  width: 500px;
}

.item {
  flex-basis: 200px;
  flex-shrink: 1;  /* 均匀收缩 */
}

/* 溢出 100px，每项缩小 100 / 3 = 33.33px */
.item {
  width: 200 - 33.33 = 166.67px;
}

/* 阻止某项收缩 */
.important {
  flex-shrink: 0;
}
```

---

### 4. flex 简写

一个属性同时设置 `flex-grow`、`flex-shrink`、`flex-basis`：

```css
.item {
  flex: <flex-grow> <flex-shrink> <flex-basis>;
}
```

**常用值**：
```css
/* 等同于 flex: 1 1 0% - 均分容器 */
.item {
  flex: 1;
}

/* 等同于 flex: 0 0 auto - 不伸不缩 */
.item {
  flex: none;
}

/* 等同于 flex: 1 1 auto - 自适应伸缩 */
.item {
  flex: auto;
}

/* 等同于 flex: 0 1 auto - 只收缩不增长 */
.item {
  flex: initial;
}
```

---

### 5. align-self（单个项目对齐）

覆盖容器的 `align-items` 设置，对单个项目进行对齐：

```css
.item {
  align-self: auto | flex-start | flex-end | center | stretch | baseline;
}
```

**常用场景**：
```css
/* 某个特殊项目单独居中 */
.special-item {
  align-self: center;
}

/* 某项拉伸填充 */
.full-height {
  align-self: stretch;
}
```

---

### 6. order（排序）

改变项目的显示顺序（默认值：0）：

```css
.item {
  order: <integer>;
}
```

**示例**：
```css
.nav-item {
  order: 1;
}

.nav-logo {
  order: -1;  /* 显示在最前面 */
}

.nav-user {
  order: 2;  /* 显示在最后面 */
}
```

---

## 核心原理与坐标系统

### 主轴 vs 交叉轴

Flex 基于两条轴线运作：

**当 `flex-direction: row` 时**：
```
主轴 (main axis) → 水平方向
交叉轴 (cross axis) ↓ 竖直方向
```

**当 `flex-direction: column` 时**：
```
主轴 (main axis) ↓ 竖直方向
交叉轴 (cross axis) → 水平方向
```

### 空间分配原理

1. **第一步**：计算所有项目的 `flex-basis` 之和
2. **第二步**：如果有剩余空间，按 `flex-grow` 比例分配
3. **第三步**：如果空间不足，按 `flex-shrink` 比例收缩

---

## 实战应用示例

### 例1：完全居中

```css
.center-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 300px;
  height: 300px;
}
```

### 例2：两列布局（左侧固定，右侧自适应）

```css
.layout {
  display: flex;
}

.sidebar {
  width: 200px;
  flex-shrink: 0;  /* 防止收缩 */
}

.content {
  flex: 1;  /* 占据剩余空间 */
}
```

### 例3：响应式卡片网格

```css
.card-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.card {
  flex: 1 1 300px;  /* 基础宽度 300px，可增可缩 */
  min-width: 300px;
}

@media (max-width: 600px) {
  .card {
    flex-basis: 100%;
  }
}
```

### 例4：导航栏

```css
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.logo {
  flex-shrink: 0;
}

.nav-items {
  display: flex;
  gap: 30px;
  flex: 1;
  justify-content: center;
}

.user-menu {
  flex-shrink: 0;
}
```

---

## 常见问题与解决方案

### Q1：flex: 1 具体表示什么？

```css
flex: 1;
/* 等同于 */
flex: 1 1 0%;
/* 即：flex-grow: 1, flex-shrink: 1, flex-basis: 0% */
```

所有设置 `flex: 1` 的项目会**均分容器空间**。

### Q2：为什么文本溢出不换行？

Flex 项目的最小宽度默认是 `auto`，会根据内容计算。解决方案：

```css
.item {
  min-width: 0;  /* 允许内容被压缩 */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

### Q3：flex-basis vs width 的优先级？

在 Flex 容器中，**`flex-basis` 优先级更高**：

```css
.item {
  width: 200px;
  flex-basis: 300px;  /* 实际宽度基础为 300px */
}
```

### Q4：如何实现间隔均匀的列表？

使用 `gap` 属性是最简洁的方式：

```css
.list {
  display: flex;
  flex-direction: column;
  gap: 15px;  /* 每项间距 15px */
}
```

---

## 浏览器兼容性

| 浏览器 | 支持情况 |
|--------|--------|
| Chrome | 21+ ✅ |
| Firefox | 18+ ✅ |
| Safari | 6.1+ ✅ |
| IE | 11+ ✅（部分属性有 bug） |
| IE 10 | ⚠️ 旧版本语法 |
| IE 9 及以下 | ❌ 不支持 |

**最佳实践**：对于现代项目（目标 IE11+），可以放心使用 Flex。

---

## 性能考虑

1. **Flex 布局性能** - 现代浏览器对 Flex 优化很好，性能与 Grid 相当
2. **避免过度嵌套** - 尽量减少嵌套的 Flex 容器层级
3. **避免频繁修改 flex-basis** - 可能触发重排（reflow）

---

## 总结

**Flex 布局的核心优势**：
- ✅ 一维布局，学习曲线平缓
- ✅ 响应式布局天然支持
- ✅ 空间分配灵活直观
- ✅ 对齐方式丰富
- ✅ 兼容性好

**关键属性速记**：
- 容器：`flex-direction`、`justify-content`、`align-items`、`flex-wrap`
- 项目：`flex`（`flex-grow`、`flex-shrink`、`flex-basis`）、`align-self`

**面试建议**：
- 掌握 flex 简写及其展开形式
- 理解主轴和交叉轴的概念
- 能够手写常见的布局模式
- 了解 Flex 与 Grid 的应用场景区别
