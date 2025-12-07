# CSS 压缩和合并

## 核心概念

### 什么是 CSS 压缩？

CSS 压缩是指**移除 CSS 代码中的冗余信息，减少文件体积**，同时保持功能不变的过程。

**压缩前后对比**：

```css
/* 压缩前：2.5KB */
body {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
  /* 注释：这是主体 */
}

.container {
  width: 1200px;
  margin: 0 auto;
}

/* 压缩后：0.8KB（节省 68%） */
body{margin:0;padding:0;font-family:Arial,sans-serif}.container{width:1200px;margin:0 auto}
```

**压缩的范围**：
- ✂️ 移除空格、换行、缩进
- ✂️ 移除注释
- ✂️ 简化颜色值（`#ffffff` → `#fff`）
- ✂️ 移除末尾分号
- ✂️ 合并相同属性

---

### 什么是 CSS 合并？

CSS 合并是指**将多个 CSS 文件整合成一个文件**，减少 HTTP 请求数的优化方式。

**合并的优势**：

| 指标 | 多个文件 | 合并后 |
|------|--------|-------|
| HTTP 请求数 | 5-10 个 | 1 个 |
| 总传输时间 | 500-800ms | 150-200ms |
| 重复 CSS 代码 | 有冗余 | 统一管理 |
| 缓存利用率 | 低（某个文件改动全部失效） | 中等 |
| 首屏加载 | 需要等待多个请求 | 只需等待 1 个请求 |

**关键指标**：
- **减少往返延迟（RTT）** - HTTP/2 多路复用后作用减弱
- **减少 DNS 查询** - 只需查询一个域名
- **统一管理** - 避免样式覆盖和冲突

---

## 压缩原理和实现

### 原理：AST 解析和代码优化

```
CSS 源代码 → 词法分析 → 语法分析 → AST 构建 → 代码优化 → 压缩输出
```

### 实现 1：使用构建工具自动压缩

#### Webpack + css-loader + cssnano

```javascript
// webpack.config.js
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [
      // JavaScript 压缩
      '...',
      // CSS 压缩
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: [
            'default',
            {
              discardComments: { removeAll: true },
              normalizeUnicode: false,
            },
          ],
        },
      }),
    ],
  },
};
```

**压缩效果**：
```
原始大小：120 KB
压缩后：45 KB（节省 62.5%）
GZIP 后：12 KB（HTTP 传输时）
```

#### Vite + Lightning CSS

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  build: {
    cssCodeSplit: true,  // 按需分割 CSS
    cssMinify: 'lightningcss',  // 使用 Lightning CSS 压缩
    minify: 'terser',
  },
  css: {
    transformer: 'postcss',
  },
});
```

### 实现 2：PostCSS 压缩配置

```javascript
// postcss.config.js
module.exports = {
  plugins: [
    require('autoprefixer'),
    require('cssnano')({
      preset: [
        'default',
        {
          // 禁用某些优化
          discardComments: {
            removeAll: true,
          },
          // 保留 @supports 查询
          normalizeUnicode: false,
          // 禁用 z-index 压缩（可能改变堆叠顺序）
          zindex: false,
        },
      ],
    }),
  ],
};
```

### 实现 3：手工简化 CSS 代码

```css
/* ❌ 冗余 CSS */
body {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
  color: #333333;
  background-color: #ffffff;
}

.btn {
  background-color: #3366ff;
  border-color: #3366ff;
  color: #ffffff;
}

.btn-large {
  background-color: #3366ff;
  border-color: #3366ff;
  color: #ffffff;
  padding: 12px 24px;
}

/* ✅ 优化后 */
body {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
  color: #333;
  background-color: #fff;
}

.btn {
  background-color: #36f;
  border-color: #36f;
  color: #fff;
}

.btn-large {
  padding: 12px 24px;
}
```

---

## CSS 合并策略

### 策略 1：全部合并（简单应用）

```javascript
// webpack.config.js
module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: __dirname + '/dist',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};
```

**优点**：
- 简单直接
- 减少 HTTP 请求

**缺点**：
- 首屏加载包含不需要的 CSS
- 缓存策略差

---

### 策略 2：代码分割（关键 CSS + 非关键 CSS）

```javascript
// webpack.config.js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'production',
  entry: {
    main: './src/main.js',
    admin: './src/admin.js',
  },
  output: {
    filename: '[name].[contenthash].js',
    path: __dirname + '/dist',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: '[id].[contenthash].css',
    }),
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        // 提取公共 CSS
        common: {
          minChunks: 2,
          priority: 5,
          reuseExistingChunk: true,
          name: 'common',
        },
        // 提取第三方库 CSS
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          priority: 10,
        },
      },
    },
  },
};
```

**输出结果**：
```
dist/
├── common.[hash].css      // 公共样式（10KB）
├── vendor.[hash].css      // 第三方样式（20KB）
├── main.[hash].css        // 主页面样式（15KB）
├── admin.[hash].css       // 管理页面样式（25KB）
├── common.[hash].js
├── vendor.[hash].js
├── main.[hash].js
└── admin.[hash].js
```

---

### 策略 3：关键 CSS 提取（推荐）

```javascript
// build/extract-critical-css.js
const critical = require('critical');
const fs = require('fs');

async function extractCritical() {
  const result = await critical.generate({
    base: 'dist/',
    src: 'index.html',
    dest: 'critical.css',
    inline: false,
    minify: true,
    width: 1366,
    height: 768,
  });

  return result;
}

// 步骤：
// 1. 内联关键 CSS 到 HTML
// 2. 异步加载非关键 CSS
// 3. 合并其他 CSS

extractCritical().then(() => {
  console.log('Critical CSS 提取完成');
});
```

**HTML 输出**：
```html
<!DOCTYPE html>
<html>
<head>
  <!-- 关键 CSS 内联 -->
  <style>
    body { font-family: Arial; }
    .header { display: flex; }
    .hero { min-height: 100vh; }
  </style>
  
  <!-- 非关键 CSS 异步加载 -->
  <link rel="preload" href="styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="styles.css"></noscript>
</head>
<body>
  ...
</body>
</html>
```

---

## 完整实现示例

### 示例 1：Webpack 生产配置（完整）

```javascript
// webpack.config.js
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    mode: isProduction ? 'production' : 'development',
    entry: {
      main: './src/main.js',
      admin: './src/admin.js',
    },
    output: {
      filename: isProduction
        ? 'js/[name].[contenthash:8].js'
        : 'js/[name].js',
      path: path.resolve(__dirname, 'dist'),
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
            'postcss-loader',
          ],
        },
        {
          test: /\.scss$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
            'postcss-loader',
            'sass-loader',
          ],
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: isProduction
          ? 'css/[name].[contenthash:8].css'
          : 'css/[name].css',
        chunkFilename: isProduction
          ? 'css/[id].[contenthash:8].css'
          : 'css/[id].css',
      }),
    ],
    optimization: {
      minimize: isProduction,
      minimizer: [
        new TerserPlugin(),
        new CssMinimizerPlugin({
          minimizerOptions: {
            preset: [
              'default',
              {
                discardComments: { removeAll: true },
                normalizeUnicode: false,
              },
            ],
          },
        }),
      ],
      splitChunks: {
        cacheGroups: {
          // 提取公共 CSS
          styles: {
            name: 'styles',
            type: 'css/mini-extract',
            chunks: 'all',
            enforce: true,
          },
          // 提取第三方库
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            priority: 10,
            reuseExistingChunk: true,
          },
        },
      },
    },
    devtool: isProduction ? 'source-map' : 'cheap-module-source-map',
  };
};
```

### 示例 2：Vite 配置（现代方案）

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    vue(),
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  build: {
    // 启用 CSS 代码分割
    cssCodeSplit: true,
    // 启用源映射便于调试
    sourcemap: false,
    // 压缩配置
    minify: 'terser',
    rollupOptions: {
      output: {
        // CSS 文件输出配置
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.css')) {
            return 'css/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
        // 代码分割配置
        manualChunks: {
          'vendor': ['vue', 'vue-router'],
          'ui': ['@/components/ui'],
        },
      },
    },
    // CSS 合并配置
    cssMinify: 'lightningcss',
  },
});
```

### 示例 3：性能分析和优化脚本

```javascript
// scripts/analyze-css.js
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const CleanCSS = require('clean-css');

class CSSAnalyzer {
  constructor(cssPath) {
    this.cssPath = cssPath;
    this.content = fs.readFileSync(cssPath, 'utf-8');
  }

  /**
   * 分析 CSS 文件大小
   */
  analyzeSize() {
    const original = Buffer.byteLength(this.content, 'utf-8');
    const gzipped = zlib.gzipSync(this.content).length;
    
    return {
      original: `${(original / 1024).toFixed(2)} KB`,
      gzipped: `${(gzipped / 1024).toFixed(2)} KB`,
      ratio: `${((gzipped / original) * 100).toFixed(2)}%`,
    };
  }

  /**
   * 压缩 CSS
   */
  minify() {
    const minified = new CleanCSS({
      level: 2,
      returnPromise: false,
    }).minify(this.content);

    const compressed = Buffer.byteLength(minified.styles, 'utf-8');
    const original = Buffer.byteLength(this.content, 'utf-8');
    const saved = ((1 - compressed / original) * 100).toFixed(2);

    return {
      minified: minified.styles,
      saved: `${saved}%`,
      originalSize: `${(original / 1024).toFixed(2)} KB`,
      minifiedSize: `${(compressed / 1024).toFixed(2)} KB`,
    };
  }

  /**
   * 检测冗余 CSS
   */
  detectDuplicates() {
    const rules = this.content.match(/[^{}]+{[^{}]*}/g) || [];
    const ruleMap = new Map();
    const duplicates = [];

    rules.forEach((rule) => {
      const selector = rule.split('{')[0].trim();
      if (ruleMap.has(selector)) {
        duplicates.push({
          selector,
          count: ruleMap.get(selector) + 1,
        });
        ruleMap.set(selector, ruleMap.get(selector) + 1);
      } else {
        ruleMap.set(selector, 1);
      }
    });

    return duplicates.filter(d => d.count > 1);
  }

  /**
   * 生成分析报告
   */
  generateReport() {
    console.log('📊 CSS 分析报告\n');
    console.log('📈 文件大小：');
    console.table(this.analyzeSize());
    
    console.log('\n🗜️ 压缩效果：');
    console.table(this.minify());
    
    const duplicates = this.detectDuplicates();
    if (duplicates.length > 0) {
      console.log('\n⚠️ 检测到重复规则：');
      console.table(duplicates);
    }
  }
}

// 使用
const analyzer = new CSSAnalyzer(path.join(__dirname, '../dist/styles.css'));
analyzer.generateReport();
```

**输出示例**：
```
📊 CSS 分析报告

📈 文件大小：
┌─────────┬──────────┐
│ original│ 120 KB   │
│ gzipped │ 12 KB    │
│ ratio   │ 10.00%   │
└─────────┴──────────┘

🗜️ 压缩效果：
┌──────────────┬─────────┐
│ originalSize │ 120 KB  │
│ minifiedSize │ 45 KB   │
│ saved        │ 62.50%  │
└──────────────┴─────────┘
```

---

## 最佳实践和注意事项

### ✅ 应该做的事

1. **启用生产环境压缩**
   ```javascript
   // webpack.config.js
   module.exports = {
     mode: 'production',  // 自动启用压缩
     optimization: {
       minimize: true,
     },
   };
   ```

2. **合理分割 CSS**
   ```javascript
   // 按页面分割
   entry: {
     home: './src/pages/home.js',
     admin: './src/pages/admin.js',
   },
   ```

3. **使用 Source Maps 便于调试**
   ```javascript
   devtool: process.env.NODE_ENV === 'production'
     ? 'source-map'
     : 'cheap-module-source-map',
   ```

4. **监测 CSS 包大小**
   ```javascript
   // 使用 bundle analyzer
   const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
   plugins: [
     new BundleAnalyzerPlugin(),
   ],
   ```

### ❌ 避免的陷阱

1. **过度压缩导致不可读**
   ```css
   /* ❌ 不好：变量被压缩，难以调试 */
   --color-primary: #3366ff;
   
   /* ✅ 好：保留变量名 */
   --cp: #36f;
   ```

2. **忽视 CSS 分割**
   ```javascript
   /* ❌ 所有页面加载所有 CSS */
   import './styles.css';  // 100KB
   
   /* ✅ 按需加载 */
   import('./admin-styles.css');  // 仅 admin 页面加载
   ```

3. **缓存策略不当**
   ```javascript
   /* ❌ 使用静态文件名 */
   output: { filename: 'style.css' }
   
   /* ✅ 使用 hash 方便缓存 */
   output: { filename: 'style.[contenthash].css' }
   ```

4. **压缩过度导致功能损坏**
   ```javascript
   /* ❌ 压缩 z-index 可能改变堆叠顺序 */
   new CssMinimizerPlugin()
   
   /* ✅ 禁用不安全的优化 */
   new CssMinimizerPlugin({
     minimizerOptions: {
       preset: ['default', { zindex: false }],
     },
   })
   ```

---

## 性能对比数据

### 压缩效果对比

| CSS 大小 | 原始 | 压缩后 | 节省 | GZIP |
|---------|------|-------|------|------|
| Bootstrap | 150KB | 60KB | 60% | 8KB |
| Tailwind | 300KB | 120KB | 60% | 15KB |
| 自定义 | 80KB | 30KB | 62.5% | 3.5KB |
| 平均 | - | - | **60.5%** | **10%** |

### HTTP 请求对比

| 方案 | 文件数 | 请求数 | 加载时间 | 总体积 |
|------|-------|--------|--------|-------|
| 无合并 | 10 CSS | 10 | 500ms | 150KB |
| 部分合并 | 3 CSS | 3 | 200ms | 150KB |
| 完全合并 | 1 CSS | 1 | 150ms | 150KB |
| 合并+压缩 | 1 CSS | 1 | 100ms | 50KB |

### 浏览器兼容性

| 工具/技术 | Chrome | Firefox | Safari | Edge | IE |
|----------|--------|---------|--------|------|-----|
| CSS Minify | ✅ | ✅ | ✅ | ✅ | ✅ |
| Source Maps | ✅ 30+ | ✅ 36+ | ✅ 13+ | ✅ 15+ | ❌ |
| Code Split | ✅ | ✅ | ✅ | ✅ | ⚠️ 部分 |

---

## 工具对比

### 常用 CSS 压缩工具

| 工具 | 压缩率 | 速度 | 安全性 | 使用场景 |
|------|-------|------|--------|---------|
| **cssnano** | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 最推荐，生产环境 |
| **clean-css** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 简单稳定 |
| **Lightning CSS** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 现代方案，很快 |
| **YUI Compressor** | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | 老旧，不推荐 |

---

## 调试和监测

### 检查压缩效果

```javascript
// 在 Node.js 中测试
const fs = require('fs');
const zlib = require('zlib');

const css = fs.readFileSync('style.css', 'utf-8');
const original = Buffer.byteLength(css, 'utf-8');
const gzipped = zlib.gzipSync(css).length;

console.log(`
原始大小: ${(original / 1024).toFixed(2)} KB
GZIP大小: ${(gzipped / 1024).toFixed(2)} KB
压缩率: ${((1 - gzipped / original) * 100).toFixed(2)}%
`);
```

### Chrome DevTools 检查

1. **Network 标签**
   - 查看 CSS 文件大小
   - 查看传输大小（compressed）
   - 查看加载时间

2. **Coverage 标签**
   - 查看未使用的 CSS
   - 计算 CSS 覆盖率

3. **Performance 标签**
   - 测量 CSS 加载对 FCP/LCP 的影响
   - 检测是否阻塞渲染

---

## 总结

**CSS 压缩和合并的三步法**：

1. **压缩** → 使用 `cssnano` 或 `clean-css`，减少 60% 体积
2. **合并** → 合理分割和合并，减少 HTTP 请求
3. **优化** → 配合 GZIP，实现最大化压缩

**记住**：
- 📦 Webpack/Vite 已内置压缩，生产环境自动启用
- 🔄 HTTP/2 多路复用后，合并作用减弱，应关注代码分割
- 🎯 关键 CSS 内联，非关键 CSS 异步加载是现代最佳实践
- 📊 始终使用 bundle analyzer 监测包大小
- 🧪 定期检查未使用 CSS，使用 PurgeCSS/Tailwind JIT 清理
