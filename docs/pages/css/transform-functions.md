# translate、scale、rotate、skew 的作用

## 概述

这四个是 CSS `transform` 属性中最常用的变换函数，它们分别用于：

| 函数 | 作用 | 说明 |
|------|------|------|
| translate | 平移 | 移动元素位置 |
| scale | 缩放 | 放大或缩小元素 |
| rotate | 旋转 | 围绕某点旋转元素 |
| skew | 倾斜 | 让元素产生倾斜变形 |

---

## translate 平移

### 语法

```css
/* 2D 平移 */
transform: translate(x, y);
transform: translateX(x);
transform: translateY(y);

/* 3D 平移 */
transform: translate3d(x, y, z);
transform: translateZ(z);
```

### 特点

- 不影响文档流，其他元素位置不变
- 可以使用百分比，相对于元素自身尺寸
- 支持负值，向相反方向移动

### 使用场景

#### 1. 居中定位

```css
/* 经典的绝对定位居中 */
.center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

#### 2. 悬浮上移效果

```css
.card {
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-10px);
}
```

#### 3. 滑动动画

```css
.slide-in {
  transform: translateX(-100%);
  transition: transform 0.5s ease;
}

.slide-in.active {
  transform: translateX(0);
}
```

::: tip 性能优势
使用 `translate` 移动元素比修改 `top`/`left` 性能更好，因为它不会触发重排（reflow）。
:::

---

## scale 缩放

### 语法

```css
/* 2D 缩放 */
transform: scale(x, y);    /* 同时设置 x 和 y */
transform: scale(n);       /* x 和 y 相同 */
transform: scaleX(x);
transform: scaleY(y);

/* 3D 缩放 */
transform: scale3d(x, y, z);
transform: scaleZ(z);
```

### 参数说明

- `1`：原始大小
- `> 1`：放大
- `< 1`：缩小
- 负值：翻转并缩放

### 使用场景

#### 1. 图片悬浮放大

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

#### 2. 按钮点击反馈

```css
.button {
  transition: transform 0.1s ease;
}

.button:active {
  transform: scale(0.95);
}
```

#### 3. 脉冲动画

```css
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.pulse {
  animation: pulse 2s infinite;
}
```

#### 4. 镜像翻转

```css
/* 水平翻转 */
.flip-x {
  transform: scaleX(-1);
}

/* 垂直翻转 */
.flip-y {
  transform: scaleY(-1);
}
```

---

## rotate 旋转

### 语法

```css
/* 2D 旋转（绕 Z 轴） */
transform: rotate(angle);

/* 3D 旋转 */
transform: rotateX(angle);  /* 绕 X 轴 */
transform: rotateY(angle);  /* 绕 Y 轴 */
transform: rotateZ(angle);  /* 绕 Z 轴，等同于 rotate() */
transform: rotate3d(x, y, z, angle);
```

### 角度单位

- `deg`：度数，如 `90deg`
- `rad`：弧度，如 `1.57rad`（约90度）
- `turn`：圈数，如 `0.25turn`（90度）

### 使用场景

#### 1. 加载动画

```css
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.loading {
  animation: spin 1s linear infinite;
}
```

#### 2. 箭头展开指示

```css
.arrow {
  transition: transform 0.3s ease;
}

.expanded .arrow {
  transform: rotate(180deg);
}
```

#### 3. 卡片翻转

```css
.card-container {
  perspective: 1000px;
}

.card {
  transform-style: preserve-3d;
  transition: transform 0.6s;
}

.card:hover {
  transform: rotateY(180deg);
}
```

#### 4. 倾斜装饰

```css
.decoration {
  transform: rotate(-3deg);
}
```

---

## skew 倾斜

### 语法

```css
transform: skew(x-angle, y-angle);
transform: skewX(angle);
transform: skewY(angle);
```

### 参数说明

- `skewX`：沿 X 轴倾斜，正值向左倾斜
- `skewY`：沿 Y 轴倾斜，正值向下倾斜

### 使用场景

#### 1. 平行四边形按钮

```css
.parallelogram {
  transform: skewX(-15deg);
}

/* 内容反向倾斜保持正常 */
.parallelogram span {
  display: inline-block;
  transform: skewX(15deg);
}
```

#### 2. 斜切背景

```css
.slanted-bg {
  position: relative;
}

.slanted-bg::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #667eea, #764ba2);
  transform: skewY(-3deg);
  z-index: -1;
}
```

#### 3. 创意文字效果

```css
.italic-effect {
  display: inline-block;
  transform: skewX(-10deg);
}
```

---

## 组合使用

### 多变换组合

```css
/* 变换函数从右向左执行 */
.combined {
  transform: translate(100px, 0) rotate(45deg) scale(1.5);
}
```

::: warning 执行顺序很重要
```css
/* 先旋转再平移 */
transform: translate(100px, 0) rotate(45deg);

/* 先平移再旋转 */
transform: rotate(45deg) translate(100px, 0);
```
这两个结果完全不同！
:::

### 复杂动画示例

```css
.fancy-hover {
  transition: transform 0.3s ease;
}

.fancy-hover:hover {
  transform: translateY(-5px) rotate(2deg) scale(1.02);
}
```

---

## 变换原点

使用 `transform-origin` 可以改变变换的基准点：

```css
/* 默认是中心点 */
transform-origin: center center;

/* 左上角 */
transform-origin: top left;

/* 具体坐标 */
transform-origin: 0 0;
transform-origin: 100px 50px;
transform-origin: 50% 100%;
```

### 示例：从角落旋转

```css
.rotate-from-corner {
  transform-origin: top left;
  transition: transform 0.3s ease;
}

.rotate-from-corner:hover {
  transform: rotate(15deg);
}
```

---

## 性能对比

| 变换 | 是否触发重排 | 是否触发重绘 | GPU 加速 |
|------|-------------|-------------|----------|
| translate | 否 | 否 | 是 |
| scale | 否 | 否 | 是 |
| rotate | 否 | 否 | 是 |
| skew | 否 | 否 | 是 |

::: tip 性能最佳实践
所有 `transform` 变换都不会触发重排和重绘，只触发合成（Composite），因此动画性能非常好。优先使用 `transform` 而不是修改 `width`、`height`、`top`、`left` 等属性。
:::

---

## 兼容性

| 函数 | Chrome | Firefox | Safari | Edge | IE |
|------|--------|---------|--------|------|-----|
| translate | 36+ | 16+ | 9+ | 12+ | 10+ |
| scale | 36+ | 16+ | 9+ | 12+ | 10+ |
| rotate | 36+ | 16+ | 9+ | 12+ | 10+ |
| skew | 36+ | 16+ | 9+ | 12+ | 10+ |
| 3D 变换 | 36+ | 16+ | 9+ | 12+ | 10+ |

## 总结

- **translate**：平移元素，常用于居中、悬浮效果
- **scale**：缩放元素，常用于放大镜、按钮反馈
- **rotate**：旋转元素，常用于加载动画、翻转效果
- **skew**：倾斜元素，常用于创意形状、斜切背景
- 四者都有优秀的性能表现，推荐用于动画效果
