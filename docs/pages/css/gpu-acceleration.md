# 如何实现 GPU 加速？

## 什么是 GPU 加速

GPU 加速（也称为硬件加速）是指将某些计算密集型的渲染任务从 CPU 转移到 GPU 上执行。GPU 专门为图形处理设计，在处理大量并行计算时比 CPU 更高效。

在 CSS 动画中，启用 GPU 加速可以显著提升动画的流畅度，减少卡顿和掉帧现象。

## 浏览器渲染流程

理解 GPU 加速，需要先了解浏览器的渲染流程：

```
JavaScript → Style → Layout → Paint → Composite
   (JS)     (样式)   (布局)   (绘制)   (合成)
```

1. **Layout（布局/重排）**：计算元素的几何信息（位置、大小）
2. **Paint（绘制/重绘）**：填充像素，绘制文字、颜色、图像等
3. **Composite（合成）**：将多个图层合并显示

::: tip 关键点
GPU 加速的本质是让动画只触发 **Composite（合成）** 阶段，跳过 Layout 和 Paint，从而获得最佳性能。
:::

## 触发 GPU 加速的方法

### 1. 使用 transform

```css
/* 推荐：使用 transform 进行位移 */
.gpu-accelerated {
  transform: translateX(100px);
}

/* 不推荐：使用 left 进行位移 */
.not-accelerated {
  position: relative;
  left: 100px;
}
```

### 2. 使用 opacity

```css
/* 推荐：使用 opacity */
.fade {
  opacity: 0.5;
}

/* 不推荐：使用 visibility 或 rgba 背景 */
.not-optimal {
  visibility: hidden;
  background: rgba(0, 0, 0, 0.5);
}
```

### 3. 使用 will-change

```css
.will-change {
  will-change: transform, opacity;
}
```

### 4. 使用 3D 变换（强制创建合成层）

```css
/* 经典的 hack 方式 */
.force-gpu {
  transform: translateZ(0);
  /* 或 */
  transform: translate3d(0, 0, 0);
}
```

### 5. 使用 filter

```css
.filtered {
  filter: blur(5px);
  /* filter 属性也会触发 GPU 加速 */
}
```

## 只触发 Composite 的属性

以下属性变化只会触发合成，不会触发布局和绘制：

| 属性 | 说明 |
|------|------|
| transform | 所有变换函数 |
| opacity | 透明度 |
| filter | 滤镜效果 |

## 实际应用示例

### 1. 高性能动画

```css
/* 高性能：只使用 transform 和 opacity */
.card {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.card:hover {
  transform: translateY(-10px) scale(1.02);
  opacity: 0.9;
}
```

### 2. 滚动视差效果

```css
.parallax-layer {
  will-change: transform;
  transform: translateZ(0);
}
```

### 3. 固定定位元素

```css
/* 固定定位元素建议开启 GPU 加速 */
.fixed-header {
  position: fixed;
  top: 0;
  transform: translateZ(0);
}
```

### 4. 大量动画元素

```css
/* 列表项动画 */
.list-item {
  will-change: transform, opacity;
  transform: translateZ(0);
}

.list-item.entering {
  animation: slideIn 0.3s ease forwards;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
```

## 验证 GPU 加速

### Chrome DevTools 检查

1. 打开 DevTools → 按 `Esc` → 选择 "Rendering"
2. 勾选 "Layer borders"
3. 开启 GPU 加速的元素会显示橙色边框

### 查看合成层

1. DevTools → More tools → Layers
2. 可以查看页面中所有的合成层

## 注意事项

### 1. 不要滥用

```css
/* 错误：给所有元素都加 GPU 加速 */
* {
  transform: translateZ(0);
}
```

::: warning 警告
过多的合成层会消耗大量内存，反而导致性能下降。只对需要动画的元素启用 GPU 加速。
:::

### 2. 合成层爆炸

当大量元素被提升为合成层时，会导致：
- 内存占用增加
- GPU 纹理上传开销
- 层管理开销增加

```css
/* 避免层爆炸 */
.container {
  /* 父元素开启 GPU 加速后，子元素可能也被提升 */
  transform: translateZ(0);
}

/* 使用 contain 限制影响范围 */
.isolated {
  contain: layout paint;
}
```

### 3. 正确使用 will-change

```css
/* 正确：在动画开始前添加，结束后移除 */
.element:hover {
  will-change: transform;
}

/* 或通过 JavaScript 控制 */
```

```javascript
// 动画开始前
element.style.willChange = 'transform';

// 动画结束后
element.addEventListener('transitionend', () => {
  element.style.willChange = 'auto';
});
```

### 4. 避免频繁创建/销毁合成层

```css
/* 不好：hover 时才创建合成层 */
.element:hover {
  transform: translateZ(0);
}

/* 更好：始终保持合成层 */
.element {
  transform: translateZ(0);
}
.element:hover {
  transform: translateZ(0) scale(1.1);
}
```

## 性能对比

| 操作 | 触发阶段 | 性能 |
|------|----------|------|
| 修改 width/height | Layout + Paint + Composite | 差 |
| 修改 color/background | Paint + Composite | 中 |
| 修改 transform/opacity | Composite | 好 |

### 具体示例

```css
/* 差：触发重排 */
.bad {
  transition: width 0.3s, height 0.3s, top 0.3s, left 0.3s;
}

/* 中：触发重绘 */
.medium {
  transition: background-color 0.3s, box-shadow 0.3s;
}

/* 好：只触发合成 */
.good {
  transition: transform 0.3s, opacity 0.3s;
}
```

## 移动端优化

移动设备 GPU 性能相对较弱，更需要注意：

```css
/* 移动端动画优化 */
.mobile-optimized {
  /* 开启硬件加速 */
  transform: translateZ(0);
  
  /* 避免模糊渲染 */
  backface-visibility: hidden;
  
  /* 提示浏览器优化 */
  will-change: transform;
}
```

## 总结

### 开启 GPU 加速的方法

1. 使用 `transform` 代替 `top`/`left`/`width`/`height`
2. 使用 `opacity` 代替 `visibility`
3. 使用 `will-change` 提示浏览器
4. 使用 `transform: translateZ(0)` 强制创建合成层

### 最佳实践

1. 只对需要动画的元素启用 GPU 加速
2. 避免创建过多合成层
3. 动画结束后移除 `will-change`
4. 使用 DevTools 验证和调试
5. 优先使用 `transform` 和 `opacity` 进行动画

### 记住这个公式

```
高性能动画 = transform + opacity + will-change（谨慎使用）
```
