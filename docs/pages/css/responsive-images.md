# 如何实现响应式图片

## 什么是响应式图片

响应式图片是指根据用户设备特性加载最合适的图片版本，在保证视觉质量的同时优化加载性能。

## 1. Srcset 方案

### 基础语法

```html
<img 
  srcset="small.jpg 480w, medium.jpg 768w, large.jpg 1200w"
  sizes="(max-width: 480px) 100vw, (max-width: 768px) 75vw, 100vw"
  src="medium.jpg"
  alt="image">
```

### 工作原理

- `srcset`：提供多个图片和尺寸
- `sizes`：告诉浏览器在不同屏幕下图片的宽度
- 浏览器根据 DPR 和屏幕宽度选择合适的图片

### 完整示例

```html
<img
  srcset="
    image-400px.jpg 400w,
    image-800px.jpg 800w,
    image-1200px.jpg 1200w,
    image-1600px.jpg 1600w
  "
  sizes="
    (max-width: 500px) 100vw,
    (max-width: 1000px) 50vw,
    (max-width: 1500px) 75vw,
    100vw
  "
  src="image-800px.jpg"
  alt="responsive image">
```

## 2. Picture 标签方案

### 基础语法

```html
<picture>
  <source media="(max-width: 480px)" srcset="mobile.jpg">
  <source media="(max-width: 768px)" srcset="tablet.jpg">
  <source media="(min-width: 769px)" srcset="desktop.jpg">
  <img src="desktop.jpg" alt="fallback">
</picture>
```

### 优点

- 完全控制不同屏幕的图片
- 支持不同格式的图片
- 可以根据媒体查询条件选择

### 完整示例

```html
<picture>
  <!-- WebP 格式（现代浏览器） -->
  <source type="image/webp" 
    media="(max-width: 480px)" 
    srcset="mobile.webp">
  <source type="image/webp" 
    media="(max-width: 768px)" 
    srcset="tablet.webp">
  <source type="image/webp" 
    srcset="desktop.webp">
  
  <!-- 降级 JPEG -->
  <source media="(max-width: 480px)" srcset="mobile.jpg">
  <source media="(max-width: 768px)" srcset="tablet.jpg">
  
  <img src="desktop.jpg" alt="responsive image">
</picture>
```

## 3. 高清屏适配（DPR）

### 使用 srcset 的 x 描述符

```html
<img 
  srcset="
    icon-1x.png 1x,
    icon-2x.png 2x,
    icon-3x.png 3x
  "
  src="icon-1x.png"
  alt="icon">
```

### 工作原理

- `1x`：标准屏幕
- `2x`：高清屏（2 倍分辨率）
- `3x`：超清屏（3 倍分辨率）

## 4. CSS 背景图片方案

### 媒体查询方案

```css
.hero {
  background-image: url('hero-small.jpg');
  background-size: cover;
}

@media (min-width: 768px) {
  .hero {
    background-image: url('hero-medium.jpg');
  }
}

@media (min-width: 1024px) {
  .hero {
    background-image: url('hero-large.jpg');
  }
}

/* 高清屏 */
@media (-webkit-min-device-pixel-ratio: 2) {
  .hero {
    background-image: url('hero-large@2x.jpg');
  }
}
```

### 图片集合方案

```css
.hero {
  background-image: image-set(
    url('hero.jpg') 1x,
    url('hero@2x.jpg') 2x,
    url('hero@3x.jpg') 3x
  );
  background-size: cover;
}
```

## 5. 现代 CSS 方案

### 使用 clamp() 进行流式图片

```css
img {
  width: 100%;
  max-width: 1200px;
  height: auto;
}

@media (min-width: 1200px) {
  img {
    width: 1200px;
  }
}
```

## 6. 自适应图片大小

```html
<!-- 让浏览器自动选择最佳大小 -->
<img
  src="small.jpg"
  srcset="
    medium.jpg 1024w,
    large.jpg 1536w,
    xlarge.jpg 2048w
  "
  sizes="90vw"
  alt="responsive">
```

## 最佳实践

### ✅ 推荐做法

1. **使用 srcset 处理简单情况**
```html
<img srcset="..." sizes="..." src="..." alt="">
```

2. **使用 picture 处理复杂情况**
```html
<picture>
  <source media="..." srcset="">
  <img src="" alt="">
</picture>
```

3. **为所有图片提供 alt 属性**
```html
<img alt="描述图片内容">
```

4. **优化图片格式**
```html
<picture>
  <source type="image/webp" srcset="image.webp">
  <img src="image.jpg">
</picture>
```

### ❌ 避免做法

1. 不要在所有情况下都加载全尺寸图片
2. 不要忽略 sizes 属性
3. 不要使用过时的图片格式

## 浏览器兼容性

| 方案 | 兼容性 |
|-----|-------|
| srcset | IE 12+（Edge）|
| picture | IE 11+ |
| image-set | Chrome 21+, Safari 6+ |
| WebP | 现代浏览器 |

## 完整响应式图片模板

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    img {
      width: 100%;
      height: auto;
      display: block;
    }
  </style>
</head>
<body>
  <!-- 方案 1：简单情况用 srcset -->
  <img
    srcset="
      img-400.jpg 400w,
      img-800.jpg 800w,
      img-1200.jpg 1200w
    "
    sizes="
      (max-width: 480px) 100vw,
      (max-width: 1024px) 50vw,
      100vw
    "
    src="img-800.jpg"
    alt="example">
  
  <!-- 方案 2：复杂情况用 picture -->
  <picture>
    <source 
      media="(max-width: 480px)" 
      srcset="img-mobile-400.jpg">
    <source 
      media="(max-width: 768px)" 
      srcset="img-tablet-600.jpg">
    <img src="img-desktop-1200.jpg" alt="example">
  </picture>
</body>
</html>
```

## 性能优化建议

1. 压缩图片文件大小
2. 使用 WebP 格式
3. 使用 CDN 加速
4. 为背景图片提供渐进式 JPEG
5. 使用懒加载技术
