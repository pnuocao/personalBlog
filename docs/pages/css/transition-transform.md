# CSS3 中的 transition 和 transform

## transition 过渡

### 什么是 transition

`transition` 是 CSS3 提供的一种在属性值变化时添加平滑过渡效果的方式。它可以让元素从一个状态平滑地过渡到另一个状态，而不是瞬间切换。

### 基本语法

```css
transition: property duration timing-function delay;
```

| 属性 | 说明 | 默认值 |
|------|------|--------|
| transition-property | 要过渡的属性名 | all |
| transition-duration | 过渡持续时间 | 0s |
| transition-timing-function | 过渡时间函数 | ease |
| transition-delay | 过渡延迟时间 | 0s |

### 基本示例

```css
/* 单一属性过渡 */
.box {
  background: blue;
  transition: background 0.3s ease;
}

.box:hover {
  background: red;
}

/* 多属性过渡 */
.box {
  transition: background 0.3s, transform 0.5s ease-out;
}

/* 所有属性过渡 */
.box {
  transition: all 0.3s ease;
}
```

### 时间函数（timing-function）

```css
/* 预设值 */
transition-timing-function: ease;        /* 默认，慢-快-慢 */
transition-timing-function: linear;      /* 匀速 */
transition-timing-function: ease-in;     /* 慢速开始 */
transition-timing-function: ease-out;    /* 慢速结束 */
transition-timing-function: ease-in-out; /* 慢速开始和结束 */

/* 贝塞尔曲线 */
transition-timing-function: cubic-bezier(0.68, -0.55, 0.265, 1.55);

/* 步进函数 */
transition-timing-function: steps(4, end);
```

### 可过渡的属性

并非所有 CSS 属性都支持过渡，常见可过渡属性：

- 尺寸：`width`、`height`、`padding`、`margin`
- 颜色：`color`、`background-color`、`border-color`
- 位置：`top`、`left`、`right`、`bottom`
- 变换：`transform`、`opacity`
- 其他：`box-shadow`、`text-shadow`、`border-radius`

::: warning 注意
`display`、`visibility`（部分）、`font-family` 等属性不支持过渡。
:::

---

## transform 变换

### 什么是 transform

`transform` 允许你对元素进行旋转、缩放、倾斜或平移，而不影响文档流中的其他元素。

### 基本语法

```css
transform: none | transform-functions;
```

### 2D 变换函数

```css
/* 平移 */
transform: translate(x, y);
transform: translateX(x);
transform: translateY(y);

/* 缩放 */
transform: scale(x, y);
transform: scaleX(x);
transform: scaleY(y);

/* 旋转 */
transform: rotate(angle);

/* 倾斜 */
transform: skew(x-angle, y-angle);
transform: skewX(angle);
transform: skewY(angle);

/* 矩阵变换 */
transform: matrix(a, b, c, d, tx, ty);
```

### 3D 变换函数

```css
/* 3D 平移 */
transform: translate3d(x, y, z);
transform: translateZ(z);

/* 3D 缩放 */
transform: scale3d(x, y, z);
transform: scaleZ(z);

/* 3D 旋转 */
transform: rotate3d(x, y, z, angle);
transform: rotateX(angle);
transform: rotateY(angle);
transform: rotateZ(angle);

/* 透视 */
transform: perspective(n);
```

### 变换原点

```css
/* 默认是元素中心 */
transform-origin: center center;

/* 关键字 */
transform-origin: top left;
transform-origin: bottom right;

/* 具体值 */
transform-origin: 50% 50%;
transform-origin: 0 0;
transform-origin: 100px 50px;
```

### 组合变换

```css
/* 多个变换函数组合，从右向左执行 */
.box {
  transform: translate(100px, 0) rotate(45deg) scale(1.5);
}
```

::: tip 执行顺序
变换函数从右向左执行，顺序不同结果也不同：
- `translate(100px, 0) rotate(45deg)` 先旋转再平移
- `rotate(45deg) translate(100px, 0)` 先平移再旋转
:::

---

## transition 与 transform 配合使用

### 基础动画效果

```css
.card {
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-10px);
}
```

### 按钮悬浮效果

```css
.button {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.button:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
```

### 卡片翻转效果

```css
.card-container {
  perspective: 1000px;
}

.card {
  position: relative;
  width: 200px;
  height: 300px;
  transform-style: preserve-3d;
  transition: transform 0.6s;
}

.card:hover {
  transform: rotateY(180deg);
}

.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
}

.card-back {
  transform: rotateY(180deg);
}
```

### 图片缩放效果

```css
.image-container {
  overflow: hidden;
}

.image-container img {
  transition: transform 0.5s ease;
}

.image-container:hover img {
  transform: scale(1.1);
}
```

---

## 性能优化

### 使用 transform 和 opacity

```css
/* 推荐：只触发合成层，性能最佳 */
.optimized {
  transition: transform 0.3s, opacity 0.3s;
}

.optimized:hover {
  transform: translateX(100px);
  opacity: 0.8;
}

/* 不推荐：触发重排 */
.not-optimized {
  transition: left 0.3s, width 0.3s;
}

.not-optimized:hover {
  left: 100px;
  width: 200px;
}
```

### 开启硬件加速

```css
.hardware-accelerated {
  transform: translateZ(0);
  /* 或 */
  will-change: transform;
}
```

::: warning 注意
不要滥用硬件加速，过多的合成层会消耗内存。
:::

---

## 兼容性

| 属性 | Chrome | Firefox | Safari | Edge | IE |
|------|--------|---------|--------|------|-----|
| transition | 26+ | 16+ | 9+ | 12+ | 10+ |
| transform (2D) | 36+ | 16+ | 9+ | 12+ | 10+ |
| transform (3D) | 36+ | 16+ | 9+ | 12+ | 10+ |

::: tip
现代浏览器已全面支持，无需添加浏览器前缀。IE9 支持 2D transform 但需要 `-ms-` 前缀。
:::

---

## 常见问题

### 1. transition 不生效

```css
/* 问题：display 不支持过渡 */
.hidden {
  display: none;
}

/* 解决方案：使用 opacity 和 visibility */
.hidden {
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s, visibility 0.3s;
}

.visible {
  opacity: 1;
  visibility: visible;
}
```

### 2. transform 影响 fixed 定位

```css
/* 父元素有 transform 时，子元素的 fixed 定位会失效 */
.parent {
  transform: translateX(0); /* 这会影响子元素的 fixed */
}

.child {
  position: fixed; /* 变成相对于 parent 定位 */
}
```

### 3. 过渡闪烁问题

```css
/* 添加 backface-visibility 解决 */
.no-flicker {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}
```

## 总结

- `transition` 用于定义属性变化时的过渡效果，让状态切换更平滑
- `transform` 用于对元素进行几何变换，不影响文档流
- 两者配合使用可以创建丰富的交互动画
- 优先使用 `transform` 和 `opacity` 进行动画，性能更好
