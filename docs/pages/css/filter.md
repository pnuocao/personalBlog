# CSS 滤镜（filter）的使用

## 什么是 CSS filter

`filter` 属性可以对元素应用图形效果，如模糊、颜色偏移、对比度调整等。它最初用于 SVG，后来被引入 CSS，可以应用于任何 HTML 元素。

## 基本语法

```css
filter: none | filter-function | filter-function ...;
```

## 滤镜函数

### 1. blur() - 模糊

```css
/* 高斯模糊 */
.blur {
  filter: blur(5px);
}
```

| 值 | 效果 |
|-----|------|
| 0 | 无模糊 |
| 1-3px | 轻微模糊 |
| 5-10px | 中度模糊 |
| 10px+ | 强模糊 |

### 2. brightness() - 亮度

```css
/* 调整亮度 */
.brightness {
  filter: brightness(1.5); /* 150% 亮度 */
}
```

| 值 | 效果 |
|-----|------|
| 0 | 全黑 |
| 0.5 | 50% 亮度 |
| 1 | 原始亮度 |
| 1.5 | 150% 亮度 |

### 3. contrast() - 对比度

```css
/* 调整对比度 */
.contrast {
  filter: contrast(2); /* 200% 对比度 */
}
```

### 4. grayscale() - 灰度

```css
/* 灰度效果 */
.grayscale {
  filter: grayscale(100%); /* 完全灰度 */
}

/* 部分灰度 */
.partial-gray {
  filter: grayscale(50%);
}
```

### 5. sepia() - 褐色（复古效果）

```css
/* 复古褐色效果 */
.sepia {
  filter: sepia(100%);
}
```

### 6. saturate() - 饱和度

```css
/* 调整饱和度 */
.saturate {
  filter: saturate(2); /* 200% 饱和度 */
}

/* 去饱和 */
.desaturate {
  filter: saturate(0.5);
}
```

### 7. hue-rotate() - 色相旋转

```css
/* 色相旋转 */
.hue-rotate {
  filter: hue-rotate(90deg);  /* 旋转 90 度 */
}

.hue-rotate-full {
  filter: hue-rotate(180deg); /* 旋转 180 度 */
}
```

### 8. invert() - 反色

```css
/* 颜色反转 */
.invert {
  filter: invert(100%);
}

/* 部分反转 */
.partial-invert {
  filter: invert(50%);
}
```

### 9. opacity() - 透明度

```css
/* 透明度 */
.opacity {
  filter: opacity(50%);
}
```

::: tip
`filter: opacity()` 与 `opacity` 属性效果相同，但 filter 版本可以与其他滤镜组合使用。
:::

### 10. drop-shadow() - 投影

```css
/* 投影效果 */
.drop-shadow {
  filter: drop-shadow(5px 5px 10px rgba(0, 0, 0, 0.5));
}
```

语法：`drop-shadow(offset-x offset-y blur-radius color)`

## 组合使用

```css
/* 多个滤镜组合 */
.combined {
  filter: contrast(1.2) brightness(1.1) saturate(1.3);
}

/* 复古照片效果 */
.vintage {
  filter: sepia(0.4) contrast(1.1) brightness(0.9) saturate(0.8);
}

/* 黑白高对比 */
.dramatic {
  filter: grayscale(100%) contrast(1.5);
}
```

## 经典使用场景

### 1. 图片悬浮效果

```css
.image {
  filter: grayscale(100%);
  transition: filter 0.3s ease;
}

.image:hover {
  filter: grayscale(0%);
}
```

### 2. 背景模糊（毛玻璃效果）

```css
.glass {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}

/* 兼容性降级 */
@supports not (backdrop-filter: blur(10px)) {
  .glass {
    background: rgba(255, 255, 255, 0.8);
  }
}
```

### 3. 禁用状态

```css
.disabled {
  filter: grayscale(100%) opacity(60%);
  pointer-events: none;
}
```

### 4. 暗色模式图片

```css
/* 暗色模式下降低图片亮度 */
@media (prefers-color-scheme: dark) {
  img {
    filter: brightness(0.8) contrast(1.1);
  }
}
```

### 5. 加载占位符

```css
.placeholder {
  filter: blur(20px);
  transition: filter 0.3s ease;
}

.placeholder.loaded {
  filter: blur(0);
}
```

### 6. 图片阴影（适合透明图片）

```css
/* drop-shadow 可以沿着图片轮廓产生阴影 */
.icon {
  filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3));
}
```

::: tip drop-shadow vs box-shadow
- `box-shadow`：沿着盒子边框产生阴影
- `drop-shadow`：沿着图片/元素的实际轮廓产生阴影

对于透明背景的 PNG 图片，`drop-shadow` 效果更好。
:::

### 7. 动态主题色

```css
/* 通过 hue-rotate 改变整体色调 */
.theme-blue {
  filter: hue-rotate(0deg);
}

.theme-green {
  filter: hue-rotate(120deg);
}

.theme-purple {
  filter: hue-rotate(270deg);
}
```

### 8. 图片滤镜预设

```css
/* Instagram 风格滤镜 */
.filter-1977 {
  filter: sepia(0.5) hue-rotate(-30deg) saturate(1.4);
}

.filter-aden {
  filter: sepia(0.2) brightness(1.15) saturate(1.4);
}

.filter-clarendon {
  filter: contrast(1.2) saturate(1.35);
}

.filter-gingham {
  filter: brightness(1.05) hue-rotate(-10deg);
}

.filter-lofi {
  filter: saturate(1.1) contrast(1.5);
}
```

## backdrop-filter

`backdrop-filter` 对元素背后的区域应用滤镜效果。

```css
/* 毛玻璃效果 */
.frosted-glass {
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px); /* Safari */
}

/* 导航栏毛玻璃 */
.navbar {
  position: fixed;
  top: 0;
  width: 100%;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px) saturate(180%);
}

/* 模态框背景 */
.modal-overlay {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
}
```

## 性能考虑

### 滤镜的性能影响

| 滤镜 | 性能影响 |
|------|----------|
| opacity | 低 |
| grayscale | 低 |
| sepia | 低 |
| brightness | 低 |
| contrast | 低 |
| saturate | 低 |
| hue-rotate | 中 |
| invert | 低 |
| blur | 高 |
| drop-shadow | 高 |

### 优化建议

```css
/* 开启 GPU 加速 */
.filtered {
  will-change: filter;
  transform: translateZ(0);
}

/* 避免在滚动时使用复杂滤镜 */
.scroll-container.scrolling .blur-element {
  filter: none;
}
```

::: warning 性能提示
`blur()` 和 `drop-shadow()` 是最消耗性能的滤镜，尤其是大模糊半径。在移动设备上要谨慎使用。
:::

## 动画效果

```css
/* 滤镜动画 */
.animated-filter {
  animation: filterAnimation 3s ease infinite;
}

@keyframes filterAnimation {
  0%, 100% {
    filter: hue-rotate(0deg);
  }
  50% {
    filter: hue-rotate(180deg);
  }
}

/* 模糊过渡 */
.blur-transition {
  filter: blur(0);
  transition: filter 0.3s ease;
}

.blur-transition:hover {
  filter: blur(5px);
}
```

## 兼容性

| 属性 | Chrome | Firefox | Safari | Edge | IE |
|------|--------|---------|--------|------|-----|
| filter | 53+ | 35+ | 9.1+ | 12+ | 不支持 |
| backdrop-filter | 76+ | 103+ | 9+ | 79+ | 不支持 |

::: tip
Safari 需要 `-webkit-backdrop-filter` 前缀。IE 完全不支持 CSS filter。
:::

## SVG 滤镜

对于更复杂的效果，可以使用 SVG 滤镜：

```html
<svg style="display: none;">
  <filter id="duotone">
    <feColorMatrix type="matrix" values="
      1 0 0 0 0
      0 0.5 0 0 0
      0 0 0.5 0 0
      0 0 0 1 0
    "/>
  </filter>
</svg>

<style>
  .duotone {
    filter: url(#duotone);
  }
</style>
```

## 总结

### 常用滤镜速查

| 效果 | 代码 |
|------|------|
| 模糊 | `filter: blur(5px)` |
| 变暗 | `filter: brightness(0.7)` |
| 变亮 | `filter: brightness(1.3)` |
| 灰度 | `filter: grayscale(100%)` |
| 复古 | `filter: sepia(100%)` |
| 反色 | `filter: invert(100%)` |
| 高饱和 | `filter: saturate(2)` |
| 色相旋转 | `filter: hue-rotate(90deg)` |
| 投影 | `filter: drop-shadow(2px 2px 4px #000)` |
| 毛玻璃 | `backdrop-filter: blur(10px)` |

### 最佳实践

1. 组合多个滤镜创建独特效果
2. 使用 `transition` 添加平滑过渡
3. 注意 `blur` 的性能影响
4. 对透明图片使用 `drop-shadow` 而非 `box-shadow`
5. 使用 `backdrop-filter` 创建毛玻璃效果
