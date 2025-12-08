# 模块热替换（HMR）原理与实现

HMR（Hot Module Replacement）是现代前端开发中最重要的特性之一，它允许在应用运行时更新模块，无需刷新页面。

## 一、概念定义

### 什么是HMR
**HMR** 是指在应用运行过程中，替换、添加或删除模块，而**无需重新加载整个页面**。

### 为什么需要HMR
```
没有HMR的开发流程：
修改代码 → 手动刷新 → 丢失应用状态 → 重新操作

有HMR的开发流程：
修改代码 → 自动更新 → 保留应用状态 → 继续开发
```

**优势**：
- 保持应用状态（表单数据、路由状态等）
- 加快开发速度
- 改进开发体验
- 调试更方便

## 二、HMR工作原理

### 整体流程

```
┌─────────────────────────────────────────────────┐
│           HMR 工作流程                          │
└─────────────────────────────────────────────────┘

1. 源文件修改
   │
   ├─→ 2. Webpack 监听文件变化
   │
   ├─→ 3. 增量编译修改的模块
   │
   ├─→ 4. 生成新的 HMR Manifest
   │
   ├─→ 5. WebSocket 推送到浏览器
   │
   ├─→ 6. HMR Runtime 接收更新
   │
   ├─→ 7. 调用模块 accept/dispose hooks
   │
   ├─→ 8. 执行新模块代码
   │
   └─→ 9. UI 无缝更新
```

### 详细步骤解析

#### 第1步：文件监听与增量编译
```javascript
// webpack-dev-server 监听源文件变化
// 当文件修改时，只编译这个文件及其依赖

// 修改前的依赖树
entry.js
├── utils.js
├── style.css
└── api.js

// 修改 utils.js 后
// 只重新编译 utils.js，其他文件缓存
```

#### 第2步：生成HMR Manifest
```javascript
// HMR Manifest - 告诉浏览器什么改变了
{
  "h": "4c59b91a98c4def3de9f",  // Hash标识
  "c": {
    "./src/utils.js": {
      // 新的代码哈希
      "code": "export function add(a, b) { return a + b }",
      "hash": "new_hash_123"
    }
  },
  "m": ["./src/utils.js"]  // 改变的模块列表
}
```

#### 第3步：WebSocket 通信
```javascript
// dev-server 通过 WebSocket 推送更新
// Client 端代码（在浏览器中运行）

if (module.hot) {
  module.hot.accept('./utils.js', function() {
    console.log('utils.js 已更新')
  })
}

// WebSocket 消息
{
  type: 'hash',
  data: '4c59b91a98c4def3de9f'
}
{
  type: 'stillok'  // 确认仍然可以HMR
}
```

#### 第4步：HMR Runtime 处理
```javascript
// HMR Runtime 是在浏览器中运行的代码
// 负责处理模块更新

// 简化的HMR Runtime实现
const modules = {}
const installedModules = {}
const moduleHotAcceptCallbacks = {}

function __webpack_require__(moduleId) {
  if (installedModules[moduleId]) {
    return installedModules[moduleId].exports
  }
  
  const module = {
    id: moduleId,
    exports: {}
  }
  
  modules[moduleId].call(module.exports, module, module.exports, __webpack_require__)
  installedModules[moduleId] = module
  
  return module.exports
}

// HMR 处理
__webpack_require__.hmrD = {} // HMR 依赖
__webpack_require__.hmrI = {} // HMR 实例

// 接收模块更新
function webpackHotModuleReplacement() {
  // 清除旧模块
  delete installedModules['./src/utils.js']
  
  // 重新加载模块
  __webpack_require__('./src/utils.js')
  
  // 调用 accept 回调
  if (moduleHotAcceptCallbacks['./src/utils.js']) {
    moduleHotAcceptCallbacks['./src/utils.js']()
  }
}
```

## 三、HMR API详解

### 1. module.hot.accept()
接受模块本身的更新。

```javascript
// utils.js
export function add(a, b) {
  return a + b
}

if (module.hot) {
  // 接受自身更新
  module.hot.accept()
}

// main.js
import { add } from './utils'

// 修改 utils.js 后，add 函数会自动更新
console.log(add(1, 2)) // 3
```

### 2. module.hot.accept(dependencies, callback)
接受依赖的更新，并执行回调。

```javascript
// main.js
import { add } from './utils'
import { subtract } from './math'

if (module.hot) {
  // 监听 utils.js 和 math.js 的变化
  module.hot.accept(['./utils', './math'], function() {
    // 重新执行逻辑
    console.log('dependencies updated')
    console.log('add(5, 3) =', add(5, 3))
    console.log('subtract(5, 3) =', subtract(5, 3))
  })
}
```

### 3. module.hot.dispose()
在模块被替换前执行清理逻辑。

```javascript
// timer.js
let interval = null

export function startTimer() {
  interval = setInterval(() => {
    console.log('tick')
  }, 1000)
}

// 清理资源
if (module.hot) {
  module.hot.dispose(function() {
    // 清除定时器
    if (interval) {
      clearInterval(interval)
    }
  })
}

// main.js
import { startTimer } from './timer'

if (module.hot) {
  module.hot.accept('./timer', function() {
    startTimer() // 重新启动定时器
  })
  
  startTimer()
}
```

### 4. module.hot.decline()
拒绝此模块的热替换，导致整个页面刷新。

```javascript
// 某些模块（如初始化代码）不能被热替换
if (module.hot) {
  module.hot.decline() // 如果有变化，整个页面刷新
}
```

## 四、实战示例

### React中的HMR

```javascript
// App.jsx
import React, { useState } from 'react'

export default function App() {
  const [count, setCount] = useState(0)
  
  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  )
}

// main.jsx
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

const root = ReactDOM.createRoot(document.getElementById('root'))

function render() {
  root.render(<App />)
}

render()

// React Fast Refresh
if (module.hot) {
  module.hot.accept('./App', () => {
    render()
  })
}
```

**效果**：修改App.jsx后，组件会更新，但count状态保留

### Vue中的HMR

```javascript
// Counter.vue
<template>
  <div>
    <h1>Count: {{ count }}</h1>
    <button @click="count++">Increment</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      count: 0
    }
  }
}
</script>

<style scoped>
h1 { color: blue; }
</style>

// main.js
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)
app.mount('#app')

if (module.hot) {
  module.hot.accept()
}
```

**效果**：Vue自动处理HMR，修改SFC后状态保留

### 样式文件的HMR

```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  }
}

// style.css
body {
  background-color: white;
}

h1 {
  color: blue;
  font-size: 24px;
}

// style-loader 内置支持CSS HMR
// 修改 style.css 后，样式立即更新，无需刷新
```

## 五、HMR原理图解

### 完整的HMR通信流程

```
┌──────────────────────────────────┐
│      Webpack Dev Server          │
│                                  │
│  ┌──────────────────────────┐   │
│  │   File Watcher           │   │
│  │   (监听文件变化)          │   │
│  └──────────┬───────────────┘   │
│             │                    │
│  ┌──────────▼───────────────┐   │
│  │   Compiler               │   │
│  │   (增量编译)              │   │
│  └──────────┬───────────────┘   │
│             │                    │
│  ┌──────────▼───────────────┐   │
│  │   HMR Server             │   │
│  │   (生成manifest)         │   │
│  └──────────┬───────────────┘   │
└─────────────┼────────────────────┘
              │ WebSocket
              │ (类型: update)
              │ (payload: manifest)
              ▼
┌──────────────────────────────────┐
│      Browser / Client            │
│                                  │
│  ┌──────────────────────────┐   │
│  │   HMR Client             │   │
│  │   (接收更新)              │   │
│  └──────────┬───────────────┘   │
│             │                    │
│  ┌──────────▼───────────────┐   │
│  │   HMR Runtime            │   │
│  │   (处理更新逻辑)          │   │
│  └──────────┬───────────────┘   │
│             │                    │
│  ┌──────────▼───────────────┐   │
│  │   Module Replace         │   │
│  │   (替换模块)              │   │
│  └──────────┬───────────────┘   │
│             │                    │
│  ┌──────────▼───────────────┐   │
│  │   Callback Execution     │   │
│  │   (执行回调)              │   │
│  └──────────┬───────────────┘   │
│             │                    │
│  ┌──────────▼───────────────┐   │
│  │   UI Update              │   │
│  │   (更新界面)              │   │
│  └──────────────────────────┘   │
└──────────────────────────────────┘
```

## 六、HMR的局限性

### 不支持HMR的情况

```javascript
// 1. 没有编写HMR处理代码
export function utils() {}
// 改变这个函数时会触发整页刷新

// 2. 模块被导出到全局
window.globalFunc = require('./func').default
// 全局引用无法自动更新

// 3. 异常被抛出
if (module.hot) {
  module.hot.accept(function() {
    throw new Error('HMR error')
  })
}
// 错误会导致HMR中断

// 4. 处于HMR不兼容的框架中
// 某些框架不支持HMR（如某些SSR场景）
```

### 解决方案

```javascript
// 1. 使用框架提供的HMR支持
// React: react-fast-refresh
// Vue: @vitejs/plugin-vue
// Svelte: svelte-hmr

// 2. 手动编写HMR处理代码
if (module.hot) {
  module.hot.accept()
}

// 3. 使用高阶函数包装
function withHMR(Component) {
  if (module.hot) {
    module.hot.accept()
  }
  return Component
}

// 4. 使用webpack-dev-server的reload选项
// 无法支持HMR时回退到完整刷新
devServer: {
  hot: true
}
```

## 七、性能影响

### HMR的开销

```javascript
// 1. 内存占用增加
// HMR Runtime 需要维护模块缓存和回调列表
// 增加约 50-200KB（取决于项目大小）

// 2. 编译时间
// 增量编译 vs 全量编译
// 增量编译：50-300ms（快速）
// 全量编译：1-30s（取决于项目）

// 3. 网络传输
// WebSocket 通信相对较小（KB级）

// 4. 浏览器处理
// 模块替换：1-10ms（通常可忽略）
```

### 优化建议

```javascript
// 1. 启用文件缓存
devServer: {
  compress: true,
  historyApiFallback: true
}

// 2. 分离第三方库
optimization: {
  splitChunks: {
    chunks: 'all'
  }
}

// 3. 使用source-map便于调试
devtool: 'eval-source-map'

// 4. 限制HMR范围
module.hot.accept(
  ['./specific-module'],
  callback
)
```

## 八、调试HMR

### 启用HMR调试

```javascript
// webpack.config.js
module.exports = {
  devServer: {
    hot: true,
    hotOnly: true // 只使用HMR，不回退到刷新
  }
}

// 或在浏览器控制台
if (module.hot) {
  module.hot.status() // 'idle', 'ready', 'check', 'dispose', 'apply', 'failed'
  
  module.hot.addStatusHandler(status => {
    console.log('HMR status:', status)
  })
  
  module.hot.addStatusHandler(status => {
    if (status === 'prepare') {
      console.log('模块即将被替换')
    }
    if (status === 'ready') {
      console.log('模块已替换完成')
    }
    if (status === 'fail') {
      console.log('模块替换失败，即将刷新页面')
    }
  })
}
```

### 常见问题排查

```javascript
// 1. HMR 不工作 - 检查是否启用
devServer: {
  hot: true
}

// 2. 状态丢失 - 需要编写HMR处理代码
if (module.hot) {
  module.hot.accept()
}

// 3. 样式HMR不工作 - 检查loader配置
{
  test: /\.css$/,
  use: ['style-loader', 'css-loader']
}

// 4. 页面刷新 - HMR回退
// 检查浏览器开发者工具网络标签
// 查看是否有WebSocket连接
```

## 九、最佳实践

```javascript
// 1. 始终启用HMR
devServer: {
  hot: true
}

// 2. 合理组织代码便于HMR
// ✅ 好的结构
components/
├── Button.js       // 单一责任
├── Input.js
└── index.js        // 导出点

// ❌ 不好的结构
components/
└── index.js        // 过大，不利于HMR精细化

// 3. 为框架提供HMR支持
// React: 使用 react-fast-refresh
// Vue: 使用官方Vite/Webpack插件

// 4. 避免全局状态依赖
// ✅ 好的实践
const store = createStore()
store.subscribe(() => render())

// ❌ 避免
window.appState = {}  // 全局依赖

// 5. 处理副作用
if (module.hot) {
  module.hot.dispose(() => {
    clearInterval(timer)
    removeEventListener()
  })
}
```

## 十、总结

| 方面 | 说明 |
|-----|------|
| **定义** | 运行时替换模块，无需刷新页面 |
| **优势** | 快速反馈、保留状态、提升体验 |
| **工作流** | 监听 → 编译 → 推送 → 更新 → 回调 |
| **关键API** | module.hot.accept/dispose |
| **框架支持** | React/Vue都有官方支持 |
| **开销** | 内存+网络，但整体可控 |
| **调试** | 通过状态监听和控制台调试 |

HMR是现代前端开发的核心特性，掌握它的原理对成为高效开发者至关重要。
