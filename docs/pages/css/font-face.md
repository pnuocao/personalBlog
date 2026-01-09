# @font-face的使用

## 问题定义

`@font-face` 是CSS3中用于定义和加载自定义字体的规则，允许网页使用服务器上的字体文件，而不依赖用户系统中安装的字体，极大地丰富了网页的字体选择。

## 基本语法

### 标准语法结构

```css
@font-face {
  font-family: 'CustomFontName'; /* 自定义字体名称 */
  src: url('font.woff2') format('woff2'),
       url('font.woff') format('woff'),
       url('font.ttf') format('truetype');
  font-weight: normal; /* 字体粗细 */
  font-style: normal; /* 字体样式 */
  font-display: swap; /* 字体显示策略 */
}
```

### 使用自定义字体

```css
.custom-text {
  font-family: 'CustomFontName', Arial, sans-serif;
}
```

## 字体格式支持

### 主要字体格式

| 格式 | 扩展名 | 浏览器支持 | 文件大小 | 推荐度 |
|---|---|---|---|---|
| WOFF2 | .woff2 | 现代浏览器 | 最小 | ⭐⭐⭐⭐⭐ |
| WOFF | .woff | IE9+ | 小 | ⭐⭐⭐⭐ |
| TTF | .ttf | 广泛支持 | 大 | ⭐⭐⭐ |
| EOT | .eot | IE专用 | 中等 | ⭐⭐ |
| SVG | .svg | 旧版Safari | 大 | ⭐ |

### 兼容性写法

```css
@font-face {
  font-family: 'MyFont';
  src: url('myfont.eot'); /* IE9 兼容模式 */
  src: url('myfont.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
       url('myfont.woff2') format('woff2'), /* 现代浏览器 */
       url('myfont.woff') format('woff'), /* 较新浏览器 */
       url('myfont.ttf') format('truetype'), /* Safari, Android, iOS */
       url('myfont.svg#MyFont') format('svg'); /* 旧版 iOS */
}
```

## font-display 属性

### 字体加载策略

```css
@font-face {
  font-family: 'MyFont';
  src: url('font.woff2') format('woff2');
  font-display: swap; /* 推荐值 */
}
```

### font-display 值详解

| 值 | 行为 | 适用场景 |
|---|---|---|
| auto | 浏览器默认行为 | 一般情况 |
| block | 短暂隐藏，然后显示 | 重要文本 |
| swap | 立即显示备用字体 | 内容优先 |
| fallback | 短暂隐藏，快速切换 | 性能优先 |
| optional | 仅在快速加载时使用 | 装饰性文本 |

### 实际应用

```css
/* 标题字体 - 重要性高 */
@font-face {
  font-family: 'HeadingFont';
  src: url('heading.woff2') format('woff2');
  font-display: block;
}

/* 正文字体 - 内容优先 */
@font-face {
  font-family: 'BodyFont';
  src: url('body.woff2') format('woff2');
  font-display: swap;
}

/* 装饰字体 - 可选 */
@font-face {
  font-family: 'DecorativeFont';
  src: url('decorative.woff2') format('woff2');
  font-display: optional;
}
```

## 字体变体和权重

### 多权重字体定义

```css
/* 正常权重 */
@font-face {
  font-family: 'MyFont';
  src: url('myfont-regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
}

/* 粗体 */
@font-face {
  font-family: 'MyFont';
  src: url('myfont-bold.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
}

/* 斜体 */
@font-face {
  font-family: 'MyFont';
  src: url('myfont-italic.woff2') format('woff2');
  font-weight: 400;
  font-style: italic;
}
```

### 可变字体（Variable Fonts）

```css
@font-face {
  font-family: 'VariableFont';
  src: url('variable-font.woff2') format('woff2-variations');
  font-weight: 100 900; /* 支持的权重范围 */
  font-stretch: 50% 200%; /* 支持的宽度范围 */
}

.variable-text {
  font-family: 'VariableFont';
  font-weight: 350; /* 任意权重值 */
  font-variation-settings: 'wght' 350, 'wdth' 120;
}
```

## 性能优化

### 1. 字体预加载

```html
<!-- HTML 头部预加载 -->
<link rel="preload" href="font.woff2" as="font" type="font/woff2" crossorigin>
```

```css
/* CSS 中的预加载提示 */
@font-face {
  font-family: 'MyFont';
  src: url('font.woff2') format('woff2');
  font-display: swap;
}
```

### 2. 字体子集化

```css
/* 只包含需要的字符 */
@font-face {
  font-family: 'SubsetFont';
  src: url('font-latin.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153;
}

@font-face {
  font-family: 'SubsetFont';
  src: url('font-chinese.woff2') format('woff2');
  unicode-range: U+4E00-9FFF;
}
```

### 3. 条件加载

```css
/* 根据媒体查询加载不同字体 */
@media screen and (min-width: 768px) {
  @font-face {
    font-family: 'DesktopFont';
    src: url('desktop-font.woff2') format('woff2');
  }
}

@media screen and (max-width: 767px) {
  @font-face {
    font-family: 'MobileFont';
    src: url('mobile-font.woff2') format('woff2');
  }
}
```

## 实际应用场景

### 1. 品牌字体应用

```css
/* 品牌标题字体 */
@font-face {
  font-family: 'BrandFont';
  src: url('../fonts/brand-font.woff2') format('woff2'),
       url('../fonts/brand-font.woff') format('woff');
  font-display: block; /* 确保品牌字体显示 */
}

.brand-title {
  font-family: 'BrandFont', Arial, sans-serif;
  font-size: 2rem;
  font-weight: bold;
}
```

### 2. 图标字体

```css
@font-face {
  font-family: 'IconFont';
  src: url('../fonts/icons.woff2') format('woff2');
  font-display: block;
}

.icon {
  font-family: 'IconFont';
  font-style: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
}

.icon-home::before {
  content: '\e001';
}
```

### 3. 多语言字体

```css
/* 中文字体 */
@font-face {
  font-family: 'ChineseFont';
  src: url('chinese-font.woff2') format('woff2');
  unicode-range: U+4E00-9FFF;
}

/* 英文字体 */
@font-face {
  font-family: 'EnglishFont';
  src: url('english-font.woff2') format('woff2');
  unicode-range: U+0000-00FF;
}

.multilingual-text {
  font-family: 'EnglishFont', 'ChineseFont', sans-serif;
}
```

## 错误处理和降级

### 1. 字体加载失败处理

```css
.text-with-fallback {
  font-family: 'CustomFont', 'Helvetica Neue', Arial, sans-serif;
}

/* 检测字体加载状态 */
.font-loaded .text-with-fallback {
  /* 字体加载成功后的样式调整 */
  letter-spacing: -0.02em;
}
```

### 2. JavaScript 字体加载检测

```javascript
// 使用 Font Loading API
if ('fonts' in document) {
  document.fonts.load('1em CustomFont').then(() => {
    document.documentElement.classList.add('font-loaded');
  }).catch(() => {
    console.log('Font failed to load');
  });
}

// 传统检测方法
function checkFontLoaded(fontFamily) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  
  context.font = '72px monospace';
  const defaultWidth = context.measureText('test').width;
  
  context.font = `72px ${fontFamily}, monospace`;
  const customWidth = context.measureText('test').width;
  
  return defaultWidth !== customWidth;
}
```

## 常见问题和解决方案

### 1. CORS 问题

```css
/* 确保字体文件支持跨域 */
@font-face {
  font-family: 'MyFont';
  src: url('https://cdn.example.com/font.woff2') format('woff2');
}
```

```html
<!-- 服务器需要设置正确的 CORS 头 -->
<!-- Access-Control-Allow-Origin: * -->
```

### 2. 字体闪烁问题（FOIT/FOUT）

```css
/* 使用 font-display 解决 */
@font-face {
  font-family: 'MyFont';
  src: url('font.woff2') format('woff2');
  font-display: swap; /* 避免闪烁 */
}
```

### 3. 字体大小优化

```bash
# 使用工具压缩字体
# fonttools 子集化
pyftsubset font.ttf --unicodes="U+0020-007F" --output-file="font-subset.ttf"

# 转换为 WOFF2
woff2_compress font-subset.ttf
```

## 最佳实践

### 1. 字体加载策略

```css
/* 关键字体立即加载 */
@font-face {
  font-family: 'CriticalFont';
  src: url('critical.woff2') format('woff2');
  font-display: block;
}

/* 非关键字体延迟加载 */
@font-face {
  font-family: 'OptionalFont';
  src: url('optional.woff2') format('woff2');
  font-display: optional;
}
```

### 2. 字体栈设计

```css
.text {
  /* 从特定到通用 */
  font-family: 'CustomFont', 'Helvetica Neue', Helvetica, Arial, sans-serif;
}
```

### 3. 性能监控

```javascript
// 监控字体加载性能
const observer = new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    if (entry.initiatorType === 'css' && entry.name.includes('font')) {
      console.log(`Font loaded: ${entry.name} in ${entry.duration}ms`);
    }
  });
});

observer.observe({ entryTypes: ['resource'] });
```

## 总结

`@font-face` 是现代网页设计的重要工具：

1. **格式选择**：优先使用 WOFF2，提供多格式兼容
2. **加载策略**：合理使用 `font-display` 优化用户体验
3. **性能优化**：预加载、子集化、条件加载
4. **兼容性**：提供完整的降级方案
5. **监控调试**：使用现代API监控字体加载状态

掌握这些技术能够创建既美观又高性能的字体解决方案，提升网页的视觉效果和用户体验。