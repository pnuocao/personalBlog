# box-shadow 和 text-shadow 的使用

## box-shadow 盒阴影

### 基本语法

```css
box-shadow: offset-x offset-y blur-radius spread-radius color inset;
```

| 参数 | 说明 | 是否必需 |
|------|------|----------|
| offset-x | 水平偏移量，正值向右 | 是 |
| offset-y | 垂直偏移量，正值向下 | 是 |
| blur-radius | 模糊半径，值越大越模糊 | 否，默认0 |
| spread-radius | 扩展半径，正值扩大，负值缩小 | 否，默认0 |
| color | 阴影颜色 | 否，默认当前文字颜色 |
| inset | 内阴影关键字 | 否，默认外阴影 |

### 基本示例

```css
/* 简单阴影 */
.shadow-basic {
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3);
}

/* 带扩展的阴影 */
.shadow-spread {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

/* 内阴影 */
.shadow-inset {
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
}
```

### 多重阴影

`box-shadow` 支持多个阴影叠加，用逗号分隔，先声明的在上层：

```css
.multi-shadow {
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.12),
    0 1px 2px rgba(0, 0, 0, 0.24);
}

/* Material Design 风格阴影 */
.material-shadow {
  box-shadow:
    0 3px 6px rgba(0, 0, 0, 0.16),
    0 3px 6px rgba(0, 0, 0, 0.23);
}
```

### 经典使用场景

#### 1. 卡片悬浮效果

```css
.card {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.card:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}
```

#### 2. 按钮按下效果

```css
.button {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease;
}

.button:active {
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.3);
  transform: translateY(2px);
}
```

#### 3. 模拟边框

```css
/* 使用 box-shadow 模拟边框，不占用空间 */
.fake-border {
  box-shadow: 0 0 0 2px #007bff;
}

/* 多层边框 */
.multi-border {
  box-shadow:
    0 0 0 2px #fff,
    0 0 0 4px #007bff;
}
```

#### 4. 聚焦环

```css
.input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
}
```

#### 5. 发光效果

```css
.glow {
  box-shadow: 0 0 20px rgba(0, 123, 255, 0.8);
}

/* 霓虹灯效果 */
.neon {
  box-shadow:
    0 0 5px #fff,
    0 0 10px #fff,
    0 0 20px #0ff,
    0 0 40px #0ff;
}
```

#### 6. 单边阴影

```css
/* 只有底部阴影 */
.bottom-shadow {
  box-shadow: 0 4px 6px -4px rgba(0, 0, 0, 0.3);
}

/* 只有顶部阴影 */
.top-shadow {
  box-shadow: 0 -4px 6px -4px rgba(0, 0, 0, 0.3);
}
```

---

## text-shadow 文字阴影

### 基本语法

```css
text-shadow: offset-x offset-y blur-radius color;
```

::: tip
`text-shadow` 没有扩展半径和 `inset` 选项，比 `box-shadow` 更简单。
:::

### 基本示例

```css
/* 简单文字阴影 */
.text-basic {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

/* 无模糊的硬阴影 */
.text-hard {
  text-shadow: 2px 2px 0 #333;
}
```

### 经典使用场景

#### 1. 增强可读性

```css
/* 在复杂背景上增强文字可读性 */
.readable-text {
  color: white;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
}
```

#### 2. 立体文字

```css
.emboss {
  color: #ccc;
  text-shadow:
    -1px -1px 0 #fff,
    1px 1px 0 #333;
}

/* 3D 文字效果 */
.text-3d {
  color: #fff;
  text-shadow:
    1px 1px 0 #ccc,
    2px 2px 0 #bbb,
    3px 3px 0 #aaa,
    4px 4px 0 #999;
}
```

#### 3. 发光文字

```css
.glow-text {
  color: #fff;
  text-shadow:
    0 0 10px #fff,
    0 0 20px #0ff,
    0 0 30px #0ff;
}
```

#### 4. 描边效果

```css
/* 使用多重阴影模拟描边 */
.stroke-text {
  color: #fff;
  text-shadow:
    -1px -1px 0 #000,
    1px -1px 0 #000,
    -1px 1px 0 #000,
    1px 1px 0 #000;
}
```

#### 5. 复古印刷效果

```css
.letterpress {
  color: #666;
  text-shadow:
    0 1px 0 #fff,
    0 -1px 0 rgba(0, 0, 0, 0.3);
}
```

---

## 性能考虑

### box-shadow 性能

1. **模糊半径影响性能**：较大的模糊半径需要更多计算
2. **多重阴影累加**：每增加一层阴影都会增加渲染开销
3. **动画优化**：阴影动画会触发重绘

```css
/* 优化阴影动画：使用伪元素 */
.card {
  position: relative;
}

.card::after {
  content: '';
  position: absolute;
  inset: 0;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.card:hover::after {
  opacity: 1;
}
```

::: warning 性能提示
避免在大量元素上使用复杂的 `box-shadow`，尤其是在滚动容器中。可以考虑使用图片或 SVG 替代复杂阴影。
:::

### text-shadow 性能

- 对大量文字使用 `text-shadow` 可能影响渲染性能
- 避免在滚动区域的文字上使用复杂阴影

---

## 兼容性

| 属性 | Chrome | Firefox | Safari | Edge | IE |
|------|--------|---------|--------|------|-----|
| box-shadow | 10+ | 4+ | 5.1+ | 12+ | 9+ |
| text-shadow | 4+ | 3.5+ | 4+ | 12+ | 10+ |

::: tip
现代浏览器已全面支持这两个属性，无需添加浏览器前缀。
:::

---

## 实用技巧

### 1. 使用 CSS 变量管理阴影

```css
:root {
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
}

.card-sm { box-shadow: var(--shadow-sm); }
.card-md { box-shadow: var(--shadow-md); }
.card-lg { box-shadow: var(--shadow-lg); }
```

### 2. 阴影颜色使用 rgba

```css
/* 推荐：使用 rgba 可以更好地融入背景 */
.good {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* 不推荐：纯色阴影显得生硬 */
.bad {
  box-shadow: 0 4px 6px #ccc;
}
```

### 3. 响应式阴影

```css
.card {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

@media (min-width: 768px) {
  .card {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
}
```

## 总结

- `box-shadow` 用于给盒子添加阴影，支持内阴影、多重阴影和扩展半径
- `text-shadow` 用于给文字添加阴影，语法更简单
- 合理使用阴影可以增强界面的层次感和视觉效果
- 注意性能影响，避免过度使用复杂阴影
