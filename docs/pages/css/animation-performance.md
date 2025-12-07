# CSS 动画性能优化

## 核心概念

### 什么是 CSS 动画性能问题？

CSS 动画在浏览器中的执行流程：

```
JavaScript 更新样式 → 样式计算 → 【重排】计算布局 → 【重绘】绘制像素 → 合成 → 屏幕显示
```

**性能问题根源**：
- 动画触发重排/重绘，导致帧率下降（FPS < 60）
- 主线程阻塞，JavaScript 执行卡顿
- GPU 无法参与，全由 CPU 处理，功耗高

**关键指标**：
- **帧率（FPS）**：应保持 60fps（每帧 16.67ms）
- **首帧时间**：动画首次渲染的时间
- **抖动（Jank）**：帧率不稳定导致的视觉卡顿
- **功耗**：动画消耗的 CPU/GPU 资源

---

## 性能层级对比

### 浏览器渲染管道

| 属性操作 | 影响范围 | 性能代价 | FPS 影响 |
|---------|--------|--------|---------|
| `left`、`top` | 触发重排+重绘 | **最高** | 可能掉到 24fps |
| `background-color` | 仅重绘 | **中高** | 可能掉到 30fps |
| `transform` | 仅合成 | **最低** | 保持 60fps |
| `opacity` | 仅合成 | **最低** | 保持 60fps |
| `filter` | 仅合成 | **最低** | 保持 60fps |

**关键发现**：
- `transform` 和 `opacity` 由 GPU 处理，**最高效**
- `left`/`top` 需要计算布局，**最低效**

---

## 经典优化手段

### 手段 1：使用 Transform 替代定位属性

❌ **不好的做法：触发重排**
```css
@keyframes slideX-bad {
  0% { left: 0; }
  100% { left: 200px; }
}

.box {
  position: relative;
  animation: slideX-bad 1s;
}
```

**性能：30fps - 60fps 不稳定**

✅ **优化方案：使用 Transform**
```css
@keyframes slideX-good {
  0% { transform: translateX(0); }
  100% { transform: translateX(200px); }
}

.box {
  animation: slideX-good 1s;
}
```

**性能：稳定 60fps**

**为什么 transform 更快？**
- `left` 改变触发重排 → 重新计算文档流 → 其他元素需要重排
- `transform` 创建新的 stacking context → 独立合成层 → 只需 GPU 合成

---

### 手段 2：启用硬件加速（GPU 加速）

**关键属性**：
```css
.box {
  /* 方式 1：强制创建合成层 */
  will-change: transform, opacity;
  
  /* 方式 2：显式启用 GPU 加速 */
  transform: translateZ(0);  /* 或 translate3d(0, 0, 0) */
  
  /* 方式 3：使用 backface-visibility */
  backface-visibility: hidden;
  perspective: 1000px;
}
```

**完整示例**：
```css
@keyframes rotate {
  0% { transform: rotateY(0deg); }
  100% { transform: rotateY(360deg); }
}

.card {
  width: 200px;
  height: 200px;
  will-change: transform;
  transform-style: preserve-3d;
  backface-visibility: hidden;
  animation: rotate 2s linear infinite;
}
```

**工作原理**：
- `will-change` 提前通知浏览器哪些属性将改变，预分配资源
- `transform: translateZ(0)` 触发 GPU 加速（创建新的 composite layer）
- `backface-visibility: hidden` 隐藏元素背面，减少渲染量

---

### 手段 3：优化动画频率和时长

❌ **高频率动画导致资源浪费**
```javascript
// 不好：过高的更新频率
setInterval(() => {
  element.style.left = getNewPosition() + 'px';
}, 10);  // 100fps，超过屏幕刷新率
```

✅ **与屏幕刷新率同步**
```javascript
// 好：使用 requestAnimationFrame
let animationId;

function animate() {
  element.style.transform = `translateX(${position}px)`;
  position += 2;
  
  if (position < 200) {
    animationId = requestAnimationFrame(animate);
  }
}

animate();
```

**性能优势**：
- `requestAnimationFrame` 与屏幕刷新率同步（16.67ms）
- 避免不必要的更新
- 浏览器会自动节流

---

### 手段 4：使用 `will-change` 属性

```css
.animated-element {
  /* 提前告诉浏览器会改变这些属性 */
  will-change: transform, opacity;
  
  animation: slideIn 0.5s ease-out;
}

@keyframes slideIn {
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}
```

**注意事项**：
```css
/* ✅ 正确用法 */
.button:hover {
  will-change: transform;
}

.button:hover .icon {
  animation: spin 1s;
}

/* ❌ 错误用法：过度使用 */
* {
  will-change: all;  /* 浪费资源 */
}

.box {
  will-change: transform;
  will-change: opacity;  /* 应该合并 */
}
```

---

### 手段 5：选择合适的动画时长和缓动函数

```javascript
// 性能对比测试
const animations = [
  {
    name: '过长动画',
    duration: 5000,  // ❌ 长动画持续消耗资源
    easing: 'ease-in-out',
  },
  {
    name: '过短动画',
    duration: 100,   // ❌ 太短可能丢帧
    easing: 'linear',
  },
  {
    name: '最优动画',
    duration: 300,   // ✅ 300-400ms 是黄金范围
    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  },
];
```

**缓动函数性能排序**：
1. `linear` - 最快（无计算）
2. `ease`, `ease-in-out` - 快（二次贝塞尔曲线）
3. `cubic-bezier()` - 中等（自定义曲线计算）
4. `steps()` - 最快（离散步数，无插值）

```css
/* 高性能缓动组合 */
@keyframes fade {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

.modal {
  /* 短时长 + 高性能缓动 */
  animation: fade 0.3s ease-out;
}
```

---

### 手段 6：避免动画导致的重排

❌ **导致连锁重排的错误写法**
```javascript
// 不好：每次改变导致重排
const boxes = document.querySelectorAll('.box');
boxes.forEach((box, index) => {
  box.style.left = index * 100 + 'px';  // 触发多次重排
});
```

✅ **批量处理，减少重排**
```javascript
// 好：使用 DocumentFragment 或 CSS
const fragment = document.createDocumentFragment();
const boxes = document.querySelectorAll('.box');

boxes.forEach((box) => {
  box.classList.add('animated');
});

// 一次性应用样式
document.body.appendChild(fragment);
```

**CSS 方案**：
```css
.box {
  position: absolute;
  transform: translateX(var(--x, 0));
  transition: transform 0.3s;
}

.box:nth-child(1) { --x: 0; }
.box:nth-child(2) { --x: 100px; }
.box:nth-child(3) { --x: 200px; }
```

---

## 完整实现示例

### 示例 1：高性能的卡片翻转动画

```html
<!DOCTYPE html>
<html>
<head>
<style>
  .card-container {
    perspective: 1000px;
    width: 200px;
    height: 300px;
  }

  .card {
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform 0.6s;
    transform-style: preserve-3d;
    will-change: transform;
  }

  .card.flipped {
    transform: rotateY(180deg);
  }

  .card-face {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    font-weight: bold;
  }

  .card-front {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }

  .card-back {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    color: white;
    transform: rotateY(180deg);
  }
</style>
</head>
<body>
  <div class="card-container">
    <div class="card">
      <div class="card-face card-front">Front</div>
      <div class="card-face card-back">Back</div>
    </div>
  </div>

  <script>
    const card = document.querySelector('.card');
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
    });
  </script>
</body>
</html>
```

**性能指标**：
- 帧率：稳定 60fps
- GPU 使用率：高（硬件加速）
- 主线程阻塞：最小

---

### 示例 2：高性能的无限滚动动画

```css
@keyframes scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
}

.marquee {
  overflow: hidden;
  background: #f5f5f5;
}

.marquee-content {
  display: flex;
  animation: scroll 20s linear infinite;
  will-change: transform;
  
  /* 防止位置改变导致重排 */
  position: relative;
}

.marquee-item {
  flex-shrink: 0;
  width: 200px;
  padding: 20px;
  white-space: nowrap;
}

/* 无缝滚动：复制内容 */
.marquee-item:last-child {
  margin-right: 0;
}
```

**JavaScript 补充**：
```javascript
// 监测性能
function measureAnimationPerformance() {
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'measure' && entry.name === 'animation') {
        console.log(`Animation frame time: ${entry.duration.toFixed(2)}ms`);
      }
    }
  });
  
  observer.observe({ entryTypes: ['measure'] });
  
  performance.mark('animation-start');
  // 动画代码
  performance.mark('animation-end');
  performance.measure('animation', 'animation-start', 'animation-end');
}
```

---

### 示例 3：性能监测工具

```javascript
// lib/animation-performance.ts
class AnimationPerformanceMonitor {
  constructor(element) {
    this.element = element;
    this.fps = 0;
    this.lastTime = performance.now();
    this.frameCount = 0;
  }

  /**
   * 使用 requestAnimationFrame 精确测量 FPS
   */
  measureFPS() {
    return new Promise((resolve) => {
      let frames = 0;
      const startTime = performance.now();
      
      const countFrame = () => {
        frames++;
        const elapsed = performance.now() - startTime;
        
        if (elapsed >= 1000) {
          const fps = Math.round(frames * 1000 / elapsed);
          resolve(fps);
        } else {
          requestAnimationFrame(countFrame);
        }
      };
      
      countFrame();
    });
  }

  /**
   * 检测是否发生重排/重绘
   */
  detectReflowRepaint() {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        // 检测长任务（可能导致帧率下降）
        if (entry.duration > 50) {
          console.warn(`Long task detected: ${entry.duration}ms`);
        }
      }
    });
    
    observer.observe({ entryTypes: ['longtask'] });
  }

  /**
   * 获取合成层信息
   */
  getCompositeInfo() {
    return {
      willChange: window.getComputedStyle(this.element).willChange,
      transform: window.getComputedStyle(this.element).transform,
      opacity: window.getComputedStyle(this.element).opacity,
    };
  }
}

// 使用示例
const monitor = new AnimationPerformanceMonitor(document.querySelector('.box'));
monitor.measureFPS().then(fps => {
  console.log(`Current FPS: ${fps}`);
  console.log(`Status: ${fps >= 55 ? '✅ Good' : '⚠️ Need optimization'}`);
});
```

---

## 最佳实践检查清单

### ✅ 应该做的事

1. **使用 transform 和 opacity**
   ```css
   /* ✅ 好 */
   .box { animation: slide 1s; }
   @keyframes slide { 
     from { transform: translateX(0); }
     to { transform: translateX(100px); }
   }
   ```

2. **启用硬件加速**
   ```css
   .animated {
     will-change: transform;
     transform: translateZ(0);
   }
   ```

3. **合理使用过渡/动画时长**
   ```css
   /* 300-400ms 是最佳范围 */
   .button { transition: all 0.3s ease-out; }
   ```

4. **监测动画性能**
   ```javascript
   // 使用 Chrome DevTools Performance 标签
   // 或使用 Web APIs 测量
   ```

### ❌ 避免的陷阱

1. **不要动画化定位属性**
   ```css
   /* ❌ 差 */
   @keyframes bad { from { left: 0; } to { left: 100px; } }
   ```

2. **过度使用 will-change**
   ```css
   /* ❌ 浪费资源 */
   * { will-change: all; }
   ```

3. **不要在动画中改变布局**
   ```javascript
   /* ❌ 导致重排 */
   element.style.width = '200px';  // 不要在动画中做这个
   ```

4. **避免频繁创建/销毁动画**
   ```javascript
   /* ❌ 每次都重新计算 */
   element.style.animation = 'slide 1s';
   element.style.animation = 'none';
   ```

---

## 性能对比数据

### 不同方案的 FPS 表现

| 方案 | 实现方式 | FPS | CPU % | GPU % | 功耗 |
|------|--------|-----|-------|-------|------|
| left/top 动画 | JavaScript 改变 | 24-35 | 85% | 15% | 🔴 高 |
| 无优化的 CSS | `animation: left` | 30-45 | 70% | 30% | 🟠 高 |
| transform + 优化 | `animation: transform` | 55-60 | 10% | 90% | 🟢 低 |
| transform + GPU 加速 | `will-change` + `transform` | 59-60 | 5% | 95% | 🟢 很低 |

### 浏览器兼容性

| 功能 | Chrome | Firefox | Safari | Edge | IE |
|------|--------|---------|--------|------|-----|
| CSS Animation | ✅ 26+ | ✅ 16+ | ✅ 9+ | ✅ 12+ | ✅ 10+ |
| Transform 3D | ✅ 12+ | ✅ 10+ | ✅ 9+ | ✅ 12+ | ✅ 10+ |
| will-change | ✅ 36+ | ✅ 36+ | ✅ 9.1+ | ✅ 15+ | ❌ No |
| backface-visibility | ✅ 12+ | ✅ 16+ | ✅ 9+ | ✅ 12+ | ✅ 10+ |

---

## 调试技巧

### 使用 Chrome DevTools 分析动画性能

1. **打开 Performance 标签**
   - 点击 Record
   - 触发动画
   - 查看 FPS 图表

2. **检查合成层**
   - More tools → Rendering
   - 启用 "Paint flashing"
   - 启用 "Layer borders"

3. **识别性能瓶颈**
   ```javascript
   // 标记性能测量点
   performance.mark('animation-start');
   // 动画代码
   performance.mark('animation-end');
   performance.measure('animation', 'animation-start', 'animation-end');
   console.table(performance.getEntriesByType('measure'));
   ```

---

## 总结

**CSS 动画性能优化三步法**：

1. **选择正确的属性** → 使用 `transform` 和 `opacity`
2. **启用硬件加速** → 添加 `will-change` 和 `transform: translateZ(0)`
3. **合理设置时长** → 300-400ms 范围内，使用高效缓动函数

**记住**：
- ✨ Transform 是最快的，优先使用
- 🎯 Transform 3D 触发硬件加速，不需要额外 GPU 调用
- 📊 60fps 是标准，测量和优化是必须的
- 🔍 使用 DevTools 实时监测性能
