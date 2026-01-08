# border-radius 的原理和使用

## 什么是 border-radius

`border-radius` 是 CSS3 引入的属性，用于设置元素的外边框圆角。它通过定义椭圆的水平和垂直半径来实现圆角效果。

## 基本语法

```css
/* 单值：四个角相同 */
border-radius: 10px;

/* 两值：左上右下 / 右上左下 */
border-radius: 10px 20px;

/* 三值：左上 / 右上左下 / 右下 */
border-radius: 10px 20px 30px;

/* 四值：左上 / 右上 / 右下 / 左下（顺时针） */
border-radius: 10px 20px 30px 40px;

/* 椭圆圆角：水平半径 / 垂直半径 */
border-radius: 10px / 20px;
```

## 原理解析

`border-radius` 的本质是用椭圆的四分之一弧线替代原来的直角。每个角可以设置两个值：

- **水平半径**：椭圆在水平方向的半径
- **垂直半径**：椭圆在垂直方向的半径

当水平半径等于垂直半径时，就是正圆弧；不相等时，就是椭圆弧。

```css
/* 正圆弧 */
border-radius: 20px;

/* 椭圆弧 */
border-radius: 20px / 10px;
```

## 单独设置每个角

```css
border-top-left-radius: 10px;
border-top-right-radius: 20px;
border-bottom-right-radius: 30px;
border-bottom-left-radius: 40px;

/* 椭圆角 */
border-top-left-radius: 10px 20px; /* 水平10px，垂直20px */
```

## 经典使用场景

### 1. 圆形头像

```css
.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
}
```

::: tip
使用 `50%` 而非固定像素值，可以让元素在任意尺寸下都保持圆形。
:::

### 2. 胶囊按钮

```css
.capsule-btn {
  padding: 10px 30px;
  border-radius: 9999px; /* 足够大的值确保两端是半圆 */
  background: #007bff;
  color: white;
}
```

### 3. 对话气泡

```css
.bubble {
  position: relative;
  padding: 15px 20px;
  background: #e0e0e0;
  border-radius: 20px;
  border-bottom-left-radius: 5px; /* 左下角小圆角模拟气泡尾巴 */
}
```

### 4. 卡片圆角

```css
.card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden; /* 确保内容不超出圆角 */
}
```

### 5. 不规则形状

```css
/* 树叶形状 */
.leaf {
  width: 100px;
  height: 100px;
  background: green;
  border-radius: 5px 50% 5px 50%;
}

/* 水滴形状 */
.drop {
  width: 100px;
  height: 100px;
  background: #3498db;
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
}
```

## 百分比值的计算

当使用百分比时：

- **水平半径**：相对于元素的 **宽度** 计算
- **垂直半径**：相对于元素的 **高度** 计算

```css
.box {
  width: 200px;
  height: 100px;
  border-radius: 50%;
  /* 等价于 border-radius: 100px / 50px; */
}
```

## 与其他属性的配合

### 配合 overflow

```css
.container {
  border-radius: 20px;
  overflow: hidden; /* 裁剪超出圆角的内容 */
}
```

### 配合 border

```css
.bordered {
  border: 3px solid #333;
  border-radius: 10px;
  /* 边框也会呈现圆角效果 */
}
```

### 配合 outline

::: warning 注意
`outline` 不会跟随 `border-radius` 产生圆角效果，这是浏览器的标准行为。如果需要圆角轮廓，可以使用 `box-shadow` 代替。
:::

```css
/* 使用 box-shadow 模拟圆角 outline */
.focus-ring:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.5);
}
```

## 性能考虑

1. **避免过度使用**：大量圆角元素可能影响渲染性能，尤其是在低端设备上
2. **配合 `overflow: hidden`**：当圆角容器内有大量内容时，`overflow: hidden` 会触发额外的裁剪计算
3. **动画性能**：`border-radius` 的动画会触发重绘，但不会触发重排

```css
/* 圆角动画 */
.hover-effect {
  border-radius: 10px;
  transition: border-radius 0.3s ease;
}

.hover-effect:hover {
  border-radius: 50%;
}
```

## 兼容性

| 浏览器 | 支持版本 |
|--------|----------|
| Chrome | 4+ |
| Firefox | 4+ |
| Safari | 5+ |
| Edge | 12+ |
| IE | 9+ |

::: tip
现代浏览器已全面支持 `border-radius`，无需添加浏览器前缀。IE8 及以下不支持此属性。
:::

## 常见问题

### 1. 圆角被子元素覆盖

```css
/* 问题：子元素超出圆角 */
.parent {
  border-radius: 20px;
}

/* 解决方案 */
.parent {
  border-radius: 20px;
  overflow: hidden;
}
```

### 2. 边框和背景的圆角不一致

```css
/* 边框的内圆角 = 外圆角 - 边框宽度 */
.box {
  border: 10px solid #333;
  border-radius: 20px;
  /* 外圆角20px，内圆角10px */
}
```

### 3. 表格单元格圆角

```css
table {
  border-collapse: separate; /* 必须使用 separate */
  border-spacing: 0;
  border-radius: 10px;
  overflow: hidden;
}
```

## 总结

`border-radius` 是一个功能强大且使用简单的 CSS3 属性，掌握它的原理和各种用法，可以轻松实现各种圆角效果。在实际开发中，合理使用圆角可以让界面更加美观和现代化。
