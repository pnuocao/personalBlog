# 减少重排和重绘

## 核心概念

### 什么是重排（Reflow）和重绘（Repaint）？

浏览器渲染页面的完整流程：

```
┌─────────────────────────────────────────────────────┐
│ 1. 解析 HTML 构建 DOM 树                              │
│ 2. 解析 CSS 构建 CSSOM 树                             │
│ 3. 合并 DOM 和 CSSOM → 渲染树（Render Tree）          │
│ 4. 【重排】计算每个元素的几何属性（位置、大小等）      │
│ 5. 【重绘】绘制像素到屏幕                              │
│ 6. 合成（Composite）                                 │
└─────────────────────────────────────────────────────┘
```

**重排（Reflow）**
- 定义：重新计算元素的布局、大小、位置
- 触发条件：DOM 结构变化、尺寸变化、位置变化
- 性能代价：**最高**，会重新计算整个渲染树

**重绘（Repaint）**
- 定义：重新绘制元素的样式（颜色、背景等），但不改变布局
- 触发条件：颜色、背景、阴影等样式变化
- 性能代价：中等，比重排低

**关键关系**：
```
重排 > 重绘 > 合成
↑       ↑      ↑
代价最高  中等    代价最低
```

---

## 触发重排的操作

### 1. DOM 元素增删改

```javascript
// ❌ 触发重排
const div = document.createElement('div');
div.textContent = '新元素';
document.body.appendChild(div);  // 重排 1 次

// 删除元素
document.body.removeChild(div);  // 重排 1 次

// ✅ 优化：批量操作
const fragment = document.createDocumentFragment();
for (let i = 0; i < 100; i++) {
  const el = document.createElement('div');
  el.textContent = `Item ${i}`;
  fragment.appendChild(el);  // 不触发重排
}
document.body.appendChild(fragment);  // 只重排 1 次
```

---

### 2. 修改元素的几何属性

```javascript
// ❌ 连续修改触发多次重排
const box = document.getElementById('box');
box.style.width = '100px';    // 重排 1 次
box.style.height = '100px';   // 重排 1 次
box.style.padding = '10px';   // 重排 1 次
box.style.margin = '10px';    // 重排 1 次
// 总计：4 次重排 ❌

// ✅ 优化：批量修改
box.style.cssText = 'width: 100px; height: 100px; padding: 10px; margin: 10px;';
// 总计：1 次重排 ✅

// ✅ 或使用 class
box.classList.add('active');  // 1 次重排
```

**会触发重排的属性**：
```javascript
// 尺寸相关
offsetWidth, offsetHeight, offsetLeft, offsetTop
clientWidth, clientHeight, clientLeft, clientTop
scrollWidth, scrollHeight, scrollLeft, scrollTop

// 定位相关
getComputedStyle()

// 常见 CSS 属性
width, height, padding, margin, border
top, left, right, bottom
position, display, float
```

---

### 3. 查询布局信息

```javascript
// ❌ 频繁查询与修改交替
const box = document.getElementById('box');
box.style.width = '100px';
console.log(box.offsetWidth);    // 重排 1 次（查询强制重排）
box.style.height = '100px';
console.log(box.offsetHeight);   // 重排 1 次（查询强制重排）

// ✅ 优化：先查询后修改
const width = box.offsetWidth;   // 重排 1 次
const height = box.offsetHeight;
box.style.width = '100px';       // 重排可能被优化
box.style.height = '100px';      // 重排可能被优化
```

---

### 4. 修改 display 或 visibility

```javascript
// ❌ 频繁显隐
const el = document.getElementById('element');
el.style.display = 'none';    // 重排
el.style.display = 'block';   // 重排
el.style.display = 'none';    // 重排

// ✅ 优化：使用 visibility 或 opacity
el.style.visibility = 'hidden';   // 重绘（不重排）
el.style.visibility = 'visible';  // 重绘（不重排）

// ✅ 或使用 opacity
el.style.opacity = '0';  // 重绘（不重排）
el.style.opacity = '1';  // 重绘（不重排）
```

---

### 5. 改变 font-size 或 font-family

```javascript
// ❌ 触发重排（影响文字高度）
document.body.style.fontSize = '16px';  // 可能影响所有子元素

// ✅ 优化：精确指定
const text = document.getElementById('text');
text.style.fontSize = '16px';  // 只影响该元素
```

---

## 触发重绘的操作

```javascript
// ✅ 只触发重绘，不重排
const box = document.getElementById('box');
box.style.color = 'red';           // 重绘
box.style.backgroundColor = 'blue'; // 重绘
box.style.boxShadow = '0 0 10px'; // 重绘
box.style.outline = '2px solid';   // 重绘
```

**重绘涉及的属性**：
```
color, background-color, background-image
box-shadow, text-shadow, outline
border-radius, opacity
```

---

## 优化策略

### 策略 1：批量修改 DOM

```javascript
// ❌ 不好：每次都更新 DOM
function renderList(items) {
  const container = document.getElementById('list');
  container.innerHTML = '';  // 1 次重排
  
  items.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    container.appendChild(li);  // 每次 1 次重排，共 n 次
  });
}

// ✅ 好：使用 DocumentFragment
function renderList(items) {
  const container = document.getElementById('list');
  const fragment = document.createDocumentFragment();
  
  items.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    fragment.appendChild(li);  // 不触发重排
  });
  
  container.innerHTML = '';    // 1 次重排
  container.appendChild(fragment);  // 1 次重排
}

// ✅ 最好：直接使用 innerHTML（一次性解析）
function renderList(items) {
  const container = document.getElementById('list');
  container.innerHTML = items
    .map(item => `<li>${item}</li>`)
    .join('');  // 只重排 1 次
}
```

---

### 策略 2：离线修改 DOM

```javascript
// ❌ 在线修改（会影响渲染树）
const container = document.getElementById('container');
container.style.display = 'block';
// 进行 100 次修改
for (let i = 0; i < 100; i++) {
  const el = document.createElement('div');
  container.appendChild(el);  // 每次都在线
}

// ✅ 离线修改
const container = document.getElementById('container');
container.style.display = 'none';  // 1 次重排

for (let i = 0; i < 100; i++) {
  const el = document.createElement('div');
  container.appendChild(el);  // 离线修改，不触发重排
}

container.style.display = 'block';  // 1 次重排
// 总计：2 次重排
```

---

### 策略 3：缓存布局信息

```javascript
// ❌ 重复查询导致重排
function processElements(elements) {
  elements.forEach(el => {
    const width = el.offsetWidth;   // 每次都查询
    const height = el.offsetHeight;
    // 使用 width 和 height
  });
}

// ✅ 先查询再使用
function processElements(elements) {
  const infos = elements.map(el => ({
    width: el.offsetWidth,    // 一次性查询
    height: el.offsetHeight,
    el: el
  }));
  
  infos.forEach(info => {
    // 使用缓存的信息
    console.log(info.width, info.height);
  });
}
```

---

### 策略 4：使用 CSS 类进行样式批量修改

```css
/* 预定义 CSS 类 */
.active {
  width: 300px;
  height: 300px;
  background: blue;
  border-radius: 8px;
  padding: 20px;
}
```

```javascript
// ❌ 逐个修改属性
const box = document.getElementById('box');
box.style.width = '300px';
box.style.height = '300px';
box.style.background = 'blue';
box.style.borderRadius = '8px';
box.style.padding = '20px';
// 可能 5 次重排

// ✅ 通过 class 一次修改
const box = document.getElementById('box');
box.classList.add('active');  // 1 次重排
```

---

### 策略 5：避免频繁查询计算属性

```javascript
// ❌ 每次循环都查询
const boxes = document.querySelectorAll('.box');
boxes.forEach(box => {
  const style = getComputedStyle(box);  // 触发重排
  console.log(style.width);
});

// ✅ 一次性查询
const boxes = document.querySelectorAll('.box');
const styles = Array.from(boxes).map(box => getComputedStyle(box));
styles.forEach(style => {
  console.log(style.width);
});
```

---

### 策略 6：使用 CSS 动画而非 JavaScript 动画

```javascript
// ❌ JavaScript 动画（频繁重排）
let position = 0;
const animate = () => {
  position += 10;
  element.style.left = position + 'px';  // 每帧重排
  if (position < 500) {
    requestAnimationFrame(animate);
  }
};
animate();

// ✅ CSS 动画（使用 transform，不重排）
element.style.animation = 'slide 1s ease-out';
```

```css
/* CSS 动画 */
@keyframes slide {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(500px);
  }
}

.element {
  animation: slide 1s ease-out;
}
```

**为什么 transform 不触发重排？**
- `transform` 属于合成层（Composite Layer）
- 不影响文档流
- 由 GPU 加速处理

---

### 策略 7：使用 will-change 提示浏览器

```css
/* 告诉浏览器该元素会频繁变化 */
.animated-box {
  will-change: transform, opacity;
}

.animated-box:hover {
  transform: scale(1.2);  /* 由 GPU 加速 */
  opacity: 0.8;
}
```

**注意**：
- ✅ 用于动画、频繁变化的元素
- ❌ 不要过度使用，会占用内存

---

### 策略 8：使用 requestAnimationFrame

```javascript
// ❌ 直接修改（可能导致强制同步重排）
boxes.forEach(box => {
  box.style.width = getNewWidth();
  console.log(box.offsetWidth);  // 强制重排
});

// ✅ 使用 requestAnimationFrame
requestAnimationFrame(() => {
  boxes.forEach(box => {
    box.style.width = getNewWidth();
  });
  
  requestAnimationFrame(() => {
    boxes.forEach(box => {
      console.log(box.offsetWidth);  // 分离查询
    });
  });
});
```

---

## 性能对比与实际测量

### 测量重排重绘的影响

```javascript
// 测试工具函数
function measurePerformance(fn, label) {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`${label}: ${(end - start).toFixed(2)}ms`);
}

// 测试 1：逐个修改 vs 批量修改
function test1() {
  // ❌ 逐个修改
  measurePerformance(() => {
    for (let i = 0; i < 1000; i++) {
      const box = document.createElement('div');
      box.style.width = '100px';
      box.style.height = '100px';
      box.style.background = 'red';
      document.body.appendChild(box);  // 1000 次重排
    }
  }, '逐个修改');
  
  // ✅ 批量修改
  measurePerformance(() => {
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < 1000; i++) {
      const box = document.createElement('div');
      box.style.cssText = 'width: 100px; height: 100px; background: red;';
      fragment.appendChild(box);
    }
    document.body.appendChild(fragment);  // 1 次重排
  }, '批量修改');
}

// 结果参考：
// 逐个修改: 250-500ms
// 批量修改: 50-100ms
// 性能提升：5-10 倍
```

---

## 浏览器优化机制

### 1. 浏览器的重排队列（Reflow Queue）

```javascript
// 浏览器会把多个重排操作放在队列中，定时执行
box1.style.width = '100px';   // 放入队列
box2.style.height = '100px';  // 放入队列
box3.style.margin = '10px';   // 放入队列
// 浏览器会在某个时间点统一执行这 3 个重排

// ❌ 但查询会强制刷新队列
box1.style.width = '100px';
console.log(box1.offsetWidth);  // 强制执行重排，然后查询
box2.style.height = '100px';
console.log(box2.offsetHeight);  // 又强制执行重排
```

---

### 2. requestAnimationFrame 与浏览器刷新率

```javascript
// requestAnimationFrame 与浏览器刷新率同步（60fps = 16.67ms）
function animateFrame() {
  box.style.left = Math.random() * 100 + 'px';
  
  requestAnimationFrame(animateFrame);
}
animateFrame();

// 相比 setInterval(fn, 16) 的优势：
// ✅ 同步浏览器刷新率（避免帧丢失）
// ✅ 页面不可见时自动停止（节省性能）
// ✅ 浏览器优化（合理安排重排）
```

---

## 实战案例

### 案例 1：高效渲染大列表

```javascript
// ❌ 不好：直接渲染 10000 条
function renderList(items) {
  const html = items.map(item => `<li>${item}</li>`).join('');
  document.getElementById('list').innerHTML = html;
  // 一次性重排，但 DOM 操作量大，容易卡顿
}

// ✅ 虚拟列表：只渲染可见区域
class VirtualList {
  constructor(container, items, itemHeight = 50) {
    this.container = container;
    this.items = items;
    this.itemHeight = itemHeight;
    this.visibleCount = Math.ceil(container.clientHeight / itemHeight);
    this.startIndex = 0;
    
    this.container.addEventListener('scroll', () => this.handleScroll());
    this.render();
  }
  
  handleScroll() {
    const scrollTop = this.container.scrollTop;
    this.startIndex = Math.floor(scrollTop / this.itemHeight);
    this.render();
  }
  
  render() {
    const visibleItems = this.items.slice(
      this.startIndex,
      this.startIndex + this.visibleCount + 1
    );
    
    const html = visibleItems
      .map((item, index) => `
        <div style="height: ${this.itemHeight}px; 
                    transform: translateY(${(this.startIndex + index) * this.itemHeight}px)">
          ${item}
        </div>
      `)
      .join('');
    
    this.container.innerHTML = html;  // 只重排可见区域
  }
}
```

---

### 案例 2：防止重排的动画

```javascript
// ❌ 使用 left 导致重排
function animateLeft() {
  let pos = 0;
  const animate = () => {
    box.style.left = (pos++) + 'px';  // 每帧重排
    if (pos < 500) requestAnimationFrame(animate);
  };
  animate();
}

// ✅ 使用 transform 不重排
function animateTransform() {
  let pos = 0;
  const animate = () => {
    box.style.transform = `translateX(${pos++}px)`;  // 只合成，不重排
    if (pos < 500) requestAnimationFrame(animate);
  };
  animate();
}

// 性能对比：
// 使用 left：帧率可能降到 30-40fps
// 使用 transform：保持 60fps
```

---

### 案例 3：批量更新 DOM

```javascript
// 场景：需要更新多个元素的样式
function batchUpdateStyles(elements, styles) {
  // ❌ 直接遍历更新
  // elements.forEach(el => {
  //   el.style.width = styles.width;
  //   el.style.height = styles.height;
  //   el.style.background = styles.background;
  // });
  
  // ✅ 使用 CSS 类
  const className = `style-${Date.now()}`;
  const cssText = Object.entries(styles)
    .map(([key, value]) => `${key}: ${value};`)
    .join('');
  
  const style = document.createElement('style');
  style.textContent = `.${className} { ${cssText} }`;
  document.head.appendChild(style);
  
  elements.forEach(el => el.classList.add(className));  // 只 1 次重排
}
```

---

## 开发工具与调试

### Chrome DevTools 性能分析

```javascript
// 1. 打开 Chrome DevTools
// 2. 进入 Performance 标签
// 3. 点击录制，执行代码
// 4. 停止录制，查看火焰图

// 注意指标：
// - Recalculate Style（样式重算）
// - Layout（重排）
// - Paint（重绘）
// - Composite（合成）
```

**查看重排重绘的步骤**：
1. 打开 DevTools → Performance
2. 点击 Record
3. 执行操作
4. 点击 Stop
5. 查看时间线，找 Layout 和 Paint 任务

---

## 常见误区

### 误区 1：opacity 不会重排

```javascript
// ✅ 正确：opacity 只重绘
box.style.opacity = '0.5';  // 重绘，不重排

// ❌ 误区：visibility 也只重绘吗？
box.style.visibility = 'hidden';  // 只重绘，不重排（保留空间）
box.style.display = 'none';       // 重排（不保留空间）
```

---

### 误区 2：transform 永远不会重排

```javascript
// ✅ 正确：transform 本身不重排
box.style.transform = 'rotate(45deg)';  // 不重排

// ❌ 但改变 transform-origin 可能会重排
box.style.transformOrigin = '50% 50%';  // 可能重排
```

---

### 误区 3：删除 DOM 就能减少重排

```javascript
// ❌ 错误理解
const el = document.getElementById('element');
el.style.display = 'none';  // 仍然在 DOM 中占空间
// 改变显示状态仍会重排

// ✅ 真正删除
document.body.removeChild(el);  // 从 DOM 中移除
```

---

## 总结检查清单

| 优化方向 | 做法 | 性能提升 |
|---------|------|--------|
| **批量修改 DOM** | 使用 DocumentFragment | 5-10x |
| **离线修改** | display: none → 修改 → display: block | 3-5x |
| **使用 CSS 类** | 一次 addClass 而非多次 style | 2-3x |
| **缓存布局信息** | 查询后缓存，避免重复查询 | 2x |
| **使用 transform** | 替代 left/top 动画 | 2-3x |
| **虚拟列表** | 只渲染可见元素 | 10-50x |
| **will-change** | 提示浏览器进行优化 | 1-2x |
| **requestAnimationFrame** | 同步浏览器刷新率 | 帧率稳定 |

---

## 面试必背要点

1. **重排 vs 重绘**：重排包含重绘，代价更大
2. **触发重排的操作**：DOM 修改、几何属性改变、查询布局信息
3. **三个优化核心**：
   - 减少 DOM 操作
   - 批量修改样式
   - 用 transform 替代位置属性
4. **测量工具**：Chrome DevTools Performance 标签
5. **最强组合**：DocumentFragment + CSS 类 + transform + requestAnimationFrame

---

## 手写优化函数参考

```javascript
// 安全的批量修改 DOM
function batchUpdateDOM(operations) {
  const container = document.getElementById('container');
  
  // 1. 离线操作
  container.style.display = 'none';
  
  // 2. 执行所有操作
  operations.forEach(op => op());
  
  // 3. 恢复显示
  container.style.display = 'block';
}

// 使用示例
batchUpdateDOM([
  () => element1.textContent = 'Updated',
  () => element2.style.background = 'red',
  () => element3.classList.add('active')
]);

// 防止强制同步重排的包装器
function preventForcedReflow(readFn, writeFn) {
  // 先读
  const value = readFn();
  // 再写
  requestAnimationFrame(() => writeFn(value));
}

// 使用示例
preventForcedReflow(
  () => element.offsetWidth,      // 读操作
  (width) => console.log(width)   // 写操作延迟
);
```

**性能数据参考**（基于现代浏览器，100 个元素）：
- 直接修改：150-250ms
- 使用优化：20-40ms
- 性能提升：**5-10 倍**
