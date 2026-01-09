# 前缀（-webkit-、-moz-等）的使用

## 什么是CSS前缀

CSS前缀（Vendor Prefixes）是浏览器厂商为实验性或非标准CSS特性添加的前缀标识符。这些前缀允许开发者在标准确定之前使用新特性，同时避免与未来标准产生冲突。

## 主要浏览器前缀

### 常见前缀列表

| 前缀 | 浏览器 | 说明 |
|------|--------|------|
| `-webkit-` | Safari, Chrome, Edge(新版) | WebKit/Blink引擎 |
| `-moz-` | Firefox | Gecko引擎 |
| `-ms-` | Internet Explorer, Edge(旧版) | Trident/EdgeHTML引擎 |
| `-o-` | Opera(旧版) | Presto引擎 |

### 浏览器引擎对应关系

```css
/* WebKit引擎（Safari、Chrome、新版Edge） */
-webkit-transform: rotate(45deg);

/* Gecko引擎（Firefox） */
-moz-transform: rotate(45deg);

/* Trident引擎（IE） */
-ms-transform: rotate(45deg);

/* Presto引擎（旧版Opera） */
-o-transform: rotate(45deg);

/* 标准语法 */
transform: rotate(45deg);
```

## 常用CSS属性的前缀写法

### 1. Transform变换

```css
.transform-example {
  -webkit-transform: rotate(45deg) scale(1.2);
  -moz-transform: rotate(45deg) scale(1.2);
  -ms-transform: rotate(45deg) scale(1.2);
  -o-transform: rotate(45deg) scale(1.2);
  transform: rotate(45deg) scale(1.2);
}
```

### 2. Transition过渡

```css
.transition-example {
  -webkit-transition: all 0.3s ease;
  -moz-transition: all 0.3s ease;
  -ms-transition: all 0.3s ease;
  -o-transition: all 0.3s ease;
  transition: all 0.3s ease;
}
```

### 3. Animation动画

```css
@-webkit-keyframes slideIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@-moz-keyframes slideIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animation-example {
  -webkit-animation: slideIn 1s ease-in-out;
  -moz-animation: slideIn 1s ease-in-out;
  animation: slideIn 1s ease-in-out;
}
```

### 4. Flexbox布局

```css
.flex-container {
  display: -webkit-box;      /* 旧版WebKit */
  display: -webkit-flex;     /* WebKit */
  display: -moz-box;         /* 旧版Firefox */
  display: -ms-flexbox;      /* IE 10 */
  display: flex;             /* 标准语法 */
  
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  -webkit-flex-direction: row;
  -moz-flex-direction: row;
  -ms-flex-direction: row;
  flex-direction: row;
  
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -moz-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
}
```

### 5. Grid布局

```css
.grid-container {
  display: -ms-grid;    /* IE 10-11 */
  display: grid;        /* 标准语法 */
  
  -ms-grid-columns: 1fr 1fr 1fr;
  grid-template-columns: 1fr 1fr 1fr;
  
  -ms-grid-rows: auto auto;
  grid-template-rows: auto auto;
}
```

### 6. 渐变背景

```css
.gradient-background {
  background: #007bff; /* 降级方案 */
  
  /* WebKit */
  background: -webkit-linear-gradient(top, #007bff, #0056b3);
  background: -webkit-gradient(
    linear,
    left top,
    left bottom,
    from(#007bff),
    to(#0056b3)
  );
  
  /* Firefox */
  background: -moz-linear-gradient(top, #007bff, #0056b3);
  
  /* IE */
  background: -ms-linear-gradient(top, #007bff, #0056b3);
  
  /* Opera */
  background: -o-linear-gradient(top, #007bff, #0056b3);
  
  /* 标准语法 */
  background: linear-gradient(to bottom, #007bff, #0056b3);
}
```

### 7. 圆角边框

```css
.border-radius {
  -webkit-border-radius: 10px;
  -moz-border-radius: 10px;
  border-radius: 10px;
}

/* 单独设置每个角 */
.complex-border-radius {
  -webkit-border-top-left-radius: 10px;
  -webkit-border-top-right-radius: 5px;
  -webkit-border-bottom-right-radius: 10px;
  -webkit-border-bottom-left-radius: 5px;
  
  -moz-border-radius-topleft: 10px;
  -moz-border-radius-topright: 5px;
  -moz-border-radius-bottomright: 10px;
  -moz-border-radius-bottomleft: 5px;
  
  border-top-left-radius: 10px;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 5px;
}
```

### 8. 阴影效果

```css
.box-shadow {
  -webkit-box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  -moz-box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.text-shadow {
  -webkit-text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
  -moz-text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
  text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
}
```

## 移动端特有前缀

### 1. 触摸滚动

```css
.smooth-scroll {
  -webkit-overflow-scrolling: touch; /* iOS平滑滚动 */
  overflow-y: scroll;
}
```

### 2. 点击高亮

```css
.no-tap-highlight {
  -webkit-tap-highlight-color: transparent; /* 移除点击高亮 */
  -webkit-touch-callout: none; /* 禁用长按菜单 */
}
```

### 3. 用户选择

```css
.no-select {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
```

### 4. 外观控制

```css
/* 移除默认样式 */
.custom-input {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

/* 自定义滚动条 */
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}
```

## 前缀的书写顺序

### 推荐顺序
```css
.example {
  /* WebKit */
  -webkit-property: value;
  
  /* Mozilla */
  -moz-property: value;
  
  /* Microsoft */
  -ms-property: value;
  
  /* Opera */
  -o-property: value;
  
  /* 标准语法（必须放在最后） */
  property: value;
}
```

### 为什么标准语法要放在最后？
```css
/* 错误的顺序 */
.bad-example {
  transform: rotate(45deg);        /* 标准语法 */
  -webkit-transform: rotate(90deg); /* 会覆盖标准语法 */
}

/* 正确的顺序 */
.good-example {
  -webkit-transform: rotate(90deg); /* 前缀版本 */
  transform: rotate(45deg);         /* 标准语法覆盖前缀版本 */
}
```

## 自动化工具

### 1. Autoprefixer
最流行的CSS前缀自动添加工具。

```javascript
// 安装
npm install autoprefixer --save-dev

// 使用
const autoprefixer = require('autoprefixer');
const postcss = require('postcss');

postcss([autoprefixer])
  .process(css, { from: undefined })
  .then(result => {
    console.log(result.css);
  });
```

**输入：**
```css
.example {
  display: flex;
  transform: rotate(45deg);
}
```

**输出：**
```css
.example {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-transform: rotate(45deg);
  transform: rotate(45deg);
}
```

### 2. 配置Browserslist
```json
// package.json
{
  "browserslist": [
    "last 2 versions",
    "> 1%",
    "IE 10"
  ]
}
```

### 3. 在构建工具中使用

**Webpack配置：**
```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                require('autoprefixer')
              ]
            }
          }
        ]
      }
    ]
  }
};
```

**Gulp配置：**
```javascript
const gulp = require('gulp');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');

gulp.task('css', () => {
  return gulp.src('src/*.css')
    .pipe(postcss([autoprefixer()]))
    .pipe(gulp.dest('dist'));
});
```

## 何时需要使用前缀

### 1. 检查兼容性
使用 [Can I Use](https://caniuse.com/) 网站查询CSS特性的浏览器支持情况。

### 2. 实验性特性
```css
/* 仍需要前缀的特性（截至2024年） */
.experimental {
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  
  -webkit-mask: url(mask.svg);
  mask: url(mask.svg);
}
```

### 3. 旧浏览器支持
如果需要支持较旧的浏览器版本，可能仍需要前缀。

## 最佳实践

### 1. 使用自动化工具
```css
/* 开发时只写标准语法 */
.modern-development {
  display: flex;
  transform: rotate(45deg);
  transition: all 0.3s ease;
}

/* 构建时自动添加前缀 */
```

### 2. 渐进增强
```css
.progressive-enhancement {
  /* 基础样式 */
  background: #007bff;
  
  /* 增强样式 */
  background: linear-gradient(45deg, #007bff, #0056b3);
}
```

### 3. 特性检测
```css
@supports (display: grid) {
  .grid-layout {
    display: grid;
  }
}

@supports not (display: grid) {
  .grid-layout {
    display: flex;
    flex-wrap: wrap;
  }
}
```

### 4. 条件加载
```css
/* 只为需要的浏览器添加前缀 */
@media screen and (-webkit-min-device-pixel-ratio: 0) {
  .webkit-only {
    -webkit-appearance: none;
  }
}
```

## 注意事项

### 1. 性能影响
- 过多的前缀会增加CSS文件大小
- 只添加必要的前缀

### 2. 维护成本
- 手动维护前缀容易出错
- 优先使用自动化工具

### 3. 前缀移除
随着浏览器更新，某些前缀可能不再需要：

```css
/* 这些前缀现在通常不再需要 */
.outdated-prefixes {
  /* border-radius现在不需要前缀 */
  border-radius: 10px;
  
  /* box-shadow现在不需要前缀 */
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}
```

## 总结

CSS前缀的使用要点：

1. **了解目的**：前缀用于实验性特性的兼容性
2. **使用工具**：优先使用Autoprefixer等自动化工具
3. **正确顺序**：标准语法必须放在最后
4. **按需添加**：根据目标浏览器决定是否需要前缀
5. **定期更新**：随着浏览器发展及时移除不必要的前缀

通过合理使用CSS前缀，可以确保网站在不同浏览器中都能正常显示，同时为用户提供最佳的体验。