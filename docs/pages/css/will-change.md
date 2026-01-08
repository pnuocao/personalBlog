# will-change 的作用

## 什么是 will-change

`will-change` 是 CSS 属性，用于告诉浏览器元素即将发生的变化，让浏览器提前做好优化准备。它是一种性能优化提示，可以帮助浏览器在变化发生前就分配资源。

## 基本语法

```css
will-change: auto;           /* 默认值，无特殊提示 */
will-change: scroll-position; /* 滚动位置将变化 */
will-change: contents;        /* 内容将变化 */
will-change: transform;       /* transform 将变化 */
will-change: opacity;         /* opacity 将变化 */
will-change: transform, opacity; /* 多个属性 */
```

## 工作原理

当你声明 `will-change` 时，浏览器会：

1. **创建新的合成层**：将元素提升到单独的 GPU 层
2. **预分配资源**：提前分配内存和 GPU 纹理
3. **优化渲染路径**：准备更高效的渲染策略

```css
.optimized {
  will-change: transform;
  /* 浏览器会提前为 transform 变化做准备 */
}
```

## 使用场景

### 1. 复杂动画

```css
.complex-animation {
  will-change: transform, opacity;
  animation: complexMove 2s ease infinite;
}

@keyframes complexMove {
  0% { transform: translateX(0) rotate(0); opacity: 1; }
  50% { transform: translateX(100px) rotate(180deg); opacity: 0.5; }
  100% { transform: translateX(0) rotate(360deg); opacity: 1; }
}
```

### 2. 交互前预优化

```css
/* 当用户可能触发动画时提前优化 */
.card-container:hover .card {
  will-change: transform;
}

.card:hover {
  transform: scale(1.05);
}
```

### 3. 滚动相关优化

```css
.scroll-container {
  will-change: scroll-position;
  overflow-y: auto;
}
```

### 4. 固定定位元素

```css
.fixed-header {
  position: fixed;
  will-change: transform;
}
```

## 正确的使用方式

### 方式一：通过父元素 hover 触发

```css
/* 推荐：在动画触发前添加 */
.parent:hover .child {
  will-change: transform;
}

.child {
  transition: transform 0.3s ease;
}

.parent:hover .child {
  transform: translateY(-10px);
}
```

### 方式二：通过 JavaScript 动态添加

```javascript
// 动画开始前添加
element.addEventListener('mouseenter', () => {
  element.style.willChange = 'transform, opacity';
});

// 动画结束后移除
element.addEventListener('transitionend', () => {
  element.style.willChange = 'auto';
});
```

### 方式三：对于持续动画

```css
/* 持续动画可以一直保持 will-change */
.loading-spinner {
  will-change: transform;
  animation: spin 1s linear infinite;
}
```

## 错误的使用方式

### 1. 不要给所有元素添加

```css
/* 错误：这会消耗大量内存 */
* {
  will-change: transform;
}
```

### 2. 不要在样式表中静态添加

```css
/* 不推荐：始终占用资源 */
.element {
  will-change: transform;
  transition: transform 0.3s;
}
```

### 3. 不要添加过多属性

```css
/* 不推荐：过多属性会增加开销 */
.element {
  will-change: transform, opacity, filter, background, color, border;
}
```

## 性能影响

### 正面影响

- 提前创建合成层，动画更流畅
- 避免动画开始时的卡顿
- GPU 预热，减少首帧延迟

### 负面影响

- 消耗更多内存
- 创建额外的合成层
- 可能导致层爆炸（layer explosion）

```css
/* 层爆炸示例 */
.list-item {
  will-change: transform; /* 每个列表项都创建合成层 */
}
/* 如果有 1000 个列表项，就会创建 1000 个合成层！ */
```

## 最佳实践

### 1. 按需使用

```javascript
class AnimationOptimizer {
  constructor(element) {
    this.element = element;
    this.bindEvents();
  }

  bindEvents() {
    // 交互开始前添加
    this.element.addEventListener('mouseenter', () => {
      this.enable();
    });

    // 动画结束后移除
    this.element.addEventListener('transitionend', () => {
      this.disable();
    });
  }

  enable() {
    this.element.style.willChange = 'transform, opacity';
  }

  disable() {
    this.element.style.willChange = 'auto';
  }
}
```

### 2. 使用 CSS 类切换

```css
.will-animate {
  will-change: transform, opacity;
}
```

```javascript
// 动画前
element.classList.add('will-animate');

// 动画后
element.addEventListener('animationend', () => {
  element.classList.remove('will-animate');
});
```

### 3. 限制使用范围

```css
/* 只对可见区域的元素使用 */
.visible .animated-element {
  will-change: transform;
}
```

### 4. 配合 Intersection Observer

```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.willChange = 'transform, opacity';
    } else {
      entry.target.style.willChange = 'auto';
    }
  });
});

document.querySelectorAll('.animated').forEach(el => {
  observer.observe(el);
});
```

## 与其他优化方式对比

| 方式 | 作用 | 副作用 |
|------|------|--------|
| `will-change: transform` | 提前优化，创建合成层 | 消耗内存 |
| `transform: translateZ(0)` | 强制创建合成层 | 消耗内存 |
| `backface-visibility: hidden` | 创建合成层 | 可能影响 3D 效果 |

```css
/* will-change 是更语义化的方式 */
.modern {
  will-change: transform;
}

/* 老式 hack */
.legacy {
  transform: translateZ(0);
  backface-visibility: hidden;
}
```

## 调试技巧

### Chrome DevTools

1. 打开 DevTools → More tools → Layers
2. 查看哪些元素被提升为合成层
3. 检查 "Compositing Reasons" 了解原因

### 性能面板

1. 打开 Performance 面板
2. 录制动画过程
3. 查看是否有长任务或掉帧

## 兼容性

| 浏览器 | 支持版本 |
|--------|----------|
| Chrome | 36+ |
| Firefox | 36+ |
| Safari | 9.1+ |
| Edge | 79+ |
| IE | 不支持 |

::: tip
对于不支持 `will-change` 的浏览器，可以使用 `transform: translateZ(0)` 作为降级方案。
:::

## 总结

### 何时使用

- 复杂动画开始前
- 用户即将触发的交互动画
- 持续运行的动画（如加载指示器）
- 滚动相关的动画

### 何时不用

- 静态元素
- 简单的过渡效果
- 大量元素（避免层爆炸）
- 不确定是否需要时

### 使用原则

1. **按需添加**：在动画开始前添加
2. **及时移除**：在动画结束后移除
3. **限制数量**：不要同时对大量元素使用
4. **测试验证**：使用 DevTools 验证效果

```css
/* 记住这个模式 */
.parent:hover .child {
  will-change: transform;
}

.child {
  transition: transform 0.3s;
}

.parent:hover .child {
  transform: translateY(-10px);
}
```
