# Webpack 核心概念、构建流程与打包原理

## 一、核心概念

### 1. Entry（入口）
应用程序的入口点，Webpack 从这里开始构建依赖图。可以指定单个或多个入口。

```javascript
// 单入口
entry: './src/index.js'

// 多入口
entry: {
  main: './src/index.js',
  admin: './src/admin.js'
}
```

### 2. Output（输出）
指定打包结果的输出位置和文件名。

```javascript
output: {
  path: path.resolve(__dirname, 'dist'),
  filename: '[name].[contenthash].js'
}
```

### 3. Loader（加载器）
用于转换非JavaScript文件。Webpack原生只能处理JavaScript，Loader扩展了其能力。

```javascript
module: {
  rules: [
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    },
    {
      test: /\.tsx?$/,
      use: 'ts-loader'
    }
  ]
}
```

### 4. Plugin（插件）
用于扩展Webpack功能，在构建过程中的特定阶段执行。

```javascript
plugins: [
  new HtmlWebpackPlugin({
    template: './src/index.html'
  }),
  new MiniCssExtractPlugin({
    filename: '[name].[contenthash].css'
  })
]
```

### 5. Mode（模式）
指定构建的环境，影响优化策略。

- `development`：开发模式，更快的构建速度
- `production`：生产模式，更小的包体积
- `none`：不使用任何默认优化

## 二、Webpack 构建流程

```
初始化参数 
    ↓
创建编译器 (Compiler)
    ↓
注册插件
    ↓
启动编译
    ↓
确定入口
    ↓
编译模块 (Loader处理)
    ↓
完成模块编译
    ↓
输出资源
    ↓
生成bundle
```

### 详细步骤说明

1. **初始化阶段**
   - 解析webpack配置
   - 初始化Compiler实例
   - 注册所有插件

2. **编译阶段**
   - 从entry指定的模块开始
   - 调用对应的loader处理模块
   - 通过AST分析模块的依赖关系
   - 递归处理所有依赖的模块

3. **优化阶段**
   - 模块分组（chunk）
   - Tree-shaking（删除未使用代码）
   - 代码分割（code-splitting）
   - 压缩代码

4. **输出阶段**
   - 生成output配置指定的文件
   - 写入文件系统

## 三、打包原理

### 1. 依赖图构建
Webpack通过分析源代码中的`import`、`require`等语句，构建一个完整的依赖关系图。

```javascript
// 示例代码
import { add } from './math.js'
import './style.css'

function main() {
  console.log(add(1, 2))
}

main()
```

Webpack会识别出：
- `math.js` 的依赖
- `style.css` 的依赖
- 以及它们的递归依赖

### 2. 模块转换
使用对应的Loader转换模块：
- JS/TS → JavaScript
- CSS → JavaScript（通过style-loader）
- 图片 → Base64或DataURL

### 3. 生成Bundle
将所有模块合并成一个或多个文件，通常会包裹成IIFE（立即执行函数表达式）。

```javascript
// 简化后的bundle结构
(function(modules) {
  var installedModules = {}
  
  function __webpack_require__(moduleId) {
    // 模块缓存
    if (installedModules[moduleId]) {
      return installedModules[moduleId].exports
    }
    
    // 创建新模块
    var module = {
      id: moduleId,
      exports: {}
    }
    installedModules[moduleId] = module
    
    // 执行模块代码
    modules[moduleId].call(
      module.exports,
      module,
      module.exports,
      __webpack_require__
    )
    
    return module.exports
  }
  
  // 加载入口模块
  return __webpack_require__('./src/index.js')
})({
  './src/index.js': function(module, exports, __webpack_require__) {
    // 模块代码...
  },
  './src/math.js': function(module, exports, __webpack_require__) {
    // 模块代码...
  }
})
```

### 4. 代码分割
将代码分割成多个chunk，实现按需加载：

```javascript
// 动态导入
import(/* webpackChunkName: "math" */ './math.js')
  .then(module => {
    module.add(1, 2)
  })
```

## 四、关键开发经验

### 1. 性能优化
- 使用合适的Loader，避免不必要的转换
- 充分利用缓存，使用contenthash
- 代码分割，分离业务代码和第三方库
- 开启Tree-shaking移除死代码

### 2. 开发效率
- 使用webpack-dev-server进行本地开发
- 开启HMR（模块热替换）
- 配置source-map便于调试

### 3. 兼容性考虑
- target配置指定目标环境
- polyfill处理浏览器兼容性
- 合理使用preset处理不同版本特性

## 五、完整配置示例

```javascript
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        },
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.(png|jpg|gif)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024
          }
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css'
    })
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10
        }
      }
    },
    minimizer: [
      // 压缩配置
    ]
  },
  devtool: 'source-map',
  devServer: {
    port: 8080,
    hot: true
  }
}
```

## 六、总结

Webpack通过以下方式工作：
1. **识别依赖**：分析源代码构建依赖图
2. **转换模块**：使用Loader处理各种文件类型
3. **优化代码**：分割、压缩、去重
4. **输出结果**：生成可在浏览器运行的bundle

理解这些核心概念和流程，对于优化Webpack配置和解决构建问题至关重要。
