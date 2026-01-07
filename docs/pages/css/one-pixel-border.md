# 1px边框问题及解决方案

## 问题背景

### 什么是 1px 问题

在高清屏幕（Retina 屏幕）上，CSS 中设置的 `border: 1px` 实际显示出来会变成 2px 的宽度。这是因为物理像素和逻辑像素的对应关系。

```
标准屏幕（1x）：1px CSS = 1px 物理像素
高清屏幕（2x）：1px CSS = 2px 物理像素
超清屏幕（3x）：1px CSS = 3px 物理像素

这导致边框在高清屏幕上显得太粗。
```

### 问题演示

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    .box {
      width: 100px;
      height: 100px;
      border: 1px solid #000;
      /* 在 iPhone 等高清屏上，这个边框会显示为 2px 宽 */
    }
  </style>
</head>
<body>
  <div class="box">看起来太粗了</div>
</body>
</html>
```

---

## 解决方案

### 1. Transform 缩放方案（推荐）

这是目前最兼容、最常用的方案。

#### 原理

通过 CSS 的 `transform: scale()` 将边框缩小，不会影响其他属性。

```css
.border-1px {
  border: 1px solid #d0d0d0;
  transform: scaleY(0.5);
  transform-origin: 0 0;
}
```

#### 完整实现

```css
/* 方案 1：使用伪元素 + transform */
.box {
  position: relative;
}

.box::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  border-bottom: 1px solid #d0d0d0;
  transform: scaleY(0.5);
  transform-origin: 0 0;
}
```

#### 处理四条边

```css
/* 四条边都是 1px */
.box {
  position: relative;
  margin: 20px;
}

.box::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 200%;
  height: 200%;
  border: 1px solid #d0d0d0;
  transform: scale(0.5);
  transform-origin: 0 0;
  box-sizing: border-box;
  pointer-events: none;
}
```

#### 使用 SCSS 简化

```scss
// 定义 mixin
@mixin border-1px($color) {
  position: relative;
  border: none;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    border: 1px solid $color;
    box-sizing: border-box;
    width: 200%;
    height: 200%;
    transform: scale(0.5);
    transform-origin: 0 0;
    pointer-events: none;
  }
}

// 使用
.box {
  @include border-1px(#d0d0d0);
}
```

---

### 2. Box-shadow 方案

使用投影模拟边框。

```css
.box {
  box-shadow: inset 0 -1px 0 0 #d0d0d0;
  /* 
  inset: 内投影
  0: x 轴位移
  -1px: y 轴位移（负数表示向上）
  0: 模糊半径
  0: 扩展半径
  #d0d0d0: 颜色
  */
}

/* 四条边 */
.box {
  box-shadow: 
    inset -1px 0 0 0 #d0d0d0, /* 右边 */
    inset 1px 0 0 0 #d0d0d0,  /* 左边 */
    inset 0 -1px 0 0 #d0d0d0, /* 下边 */
    inset 0 1px 0 0 #d0d0d0;   /* 上边 */
}
```

---

### 3. SVG 方案

使用 SVG 绘制精确的 1px 边框。

```css
.box {
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><rect width='100' height='100' fill='none' stroke='%23d0d0d0' stroke-width='1'/></svg>");
  background-position: 0 0;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
```

---

### 4. 媒体查询方案

根据设备像素比使用不同的边框宽度。

```css
.box {
  border: 1px solid #d0d0d0;
}

/* 高清屏（2x） */
@media (-webkit-min-device-pixel-ratio: 2) {
  .box {
    border: 0.5px solid #d0d0d0;
  }
}

/* 超清屏（3x） */
@media (-webkit-min-device-pixel-ratio: 3) {
  .box {
    border: 0.333333px solid #d0d0d0;
  }
}
```

**问题：** 某些 Android 设备不支持 0.5px。

---

### 5. Viewport + REM 方案

在 Viewport 中进行缩放处理。

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    .box {
      border: 1px solid #d0d0d0;
      /* 正常边框即可 */
    }
  </style>
  <script>
    if (window.devicePixelRatio && window.devicePixelRatio >= 2) {
      var viewport = document.querySelector("meta[name='viewport']");
      viewport.setAttribute(
        'content',
        'width=device-width, initial-scale=' + (1 / window.devicePixelRatio) + ', maximum-scale=' + (1 / window.devicePixelRatio) + ', minimum-scale=' + (1 / window.devicePixelRatio) + ', user-scalable=no'
      );
    }
  </script>
</head>
<body>
  <div class="box">1px 边框</div>
</body>
</html>
```

---

## 方案对比

| 方案 | 优点 | 缺点 | 兼容性 |
|-----|-----|-----|-------|
| **Transform 缩放** | 简洁、高效、可控 | 需要伪元素 | 优秀 |
| **Box-shadow** | 不占用伪元素 | 需要多个投影 | 优秀 |
| **SVG** | 矢量精确 | 代码复杂 | 优秀 |
| **媒体查询** | 直观易懂 | 不支持 0.5px | 一般 |
| **Viewport** | 全局解决 | 改变缩放比例 | 一般 |

---

## 实战应用示例

### 完整的 1px 边框库

```css
/* 定义 1px 边框的辅助类 */

/* 底部边框 */
.border-bottom-1px {
  position: relative;
  padding-bottom: 0;
}

.border-bottom-1px::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  border-bottom: 1px solid #e5e5e5;
  transform: scaleY(0.5);
  transform-origin: 0 0;
}

/* 顶部边框 */
.border-top-1px {
  position: relative;
}

.border-top-1px::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  border-top: 1px solid #e5e5e5;
  transform: scaleY(0.5);
  transform-origin: 0 0;
}

/* 上下边框 */
.border-y-1px {
  position: relative;
}

.border-y-1px::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  border-top: 1px solid #e5e5e5;
  transform: scaleY(0.5);
  transform-origin: 0 0;
}

.border-y-1px::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  border-bottom: 1px solid #e5e5e5;
  transform: scaleY(0.5);
  transform-origin: 0 0;
}

/* 四边边框 */
.border-1px {
  position: relative;
}

.border-1px::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 200%;
  height: 200%;
  border: 1px solid #e5e5e5;
  transform: scale(0.5);
  transform-origin: 0 0;
  box-sizing: border-box;
  pointer-events: none;
}
```

### HTML 使用

```html
<div class="border-bottom-1px">底部 1px 边框</div>
<div class="border-top-1px">顶部 1px 边框</div>
<div class="border-1px">四边 1px 边框</div>
```

---

## 特殊场景处理

### 列表项 1px 分割线

```html
<style>
  .list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .list-item {
    position: relative;
    padding: 10px;
  }
  
  .list-item:not(:last-child)::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    border-bottom: 1px solid #e5e5e5;
    transform: scaleY(0.5);
    transform-origin: 0 0;
  }
</style>

<ul class="list">
  <li class="list-item">项目 1</li>
  <li class="list-item">项目 2</li>
  <li class="list-item">项目 3</li>
</ul>
```

### 卡片四边框

```css
.card {
  position: relative;
  margin: 20px;
}

.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: calc(100% + 40px);
  height: calc(100% + 40px);
  margin: -20px 0 0 -20px;
  border: 1px solid #e5e5e5;
  transform: scale(0.5);
  transform-origin: 0 0;
  box-sizing: border-box;
  pointer-events: none;
}
```

---

## 最佳实践建议

### 推荐方案

**优先使用 Transform 缩放方案，原因是：**

1. ✅ 兼容性最好（iOS 5+，Android 2.3+）
2. ✅ 性能最优（使用硬件加速）
3. ✅ 代码最简洁
4. ✅ 不影响其他样式
5. ✅ 易于维护和扩展

### 实施建议

```scss
// 统一管理 1px 边框
// 在项目的 _variables.scss 中定义

$border-color: #e5e5e5;

@mixin border-1px($color: $border-color, $direction: 'bottom') {
  position: relative;
  
  @if $direction == 'bottom' {
    &::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      border-bottom: 1px solid $color;
      transform: scaleY(0.5);
      transform-origin: 0 0;
    }
  } @else if $direction == 'top' {
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      border-top: 1px solid $color;
      transform: scaleY(0.5);
      transform-origin: 0 0;
    }
  } @else if $direction == 'all' {
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 200%;
      height: 200%;
      border: 1px solid $color;
      transform: scale(0.5);
      transform-origin: 0 0;
      box-sizing: border-box;
      pointer-events: none;
    }
  }
}

// 使用
.list-item {
  @include border-1px(#e5e5e5, 'bottom');
}

.card {
  @include border-1px(#e5e5e5, 'all');
}
```

---

## 总结

| 场景 | 推荐方案 |
|-----|--------|
| **简单底边框** | Transform 缩放 + ::after |
| **复杂四边框** | Transform 缩放 + ::before |
| **列表分割线** | Transform 缩放 + ::after |
| **需要快速方案** | Box-shadow |
| **追求完美效果** | SVG |
| **全局兼容** | 媒体查询 + Transform 结合 |

**最终建议：** 使用 Transform 缩放方案，并创建可复用的 SCSS mixin，这是最平衡的解决方案。
