# 防抖函数

::: tip
定义：事件触发 n 秒后再执行回调，若 n 秒内再次被触发，则重新计时后执行
:::

## 应用场景

1. 搜索联想，输入时自动搜索，在输入过程中利用防抖减少请求
2. 窗口 resize 事件，利用防抖减少每次窗口大小的回调，如数据上报等
3. 频繁的点击事件，提交表单等操作

## 实现

- v1.0 版本

```js
const debounce = (fn, delay) => {
  let timer = null;
  return function (...args) {
    // 这里也可以不判断直接清除
    clearTimeout(timer);
    timer = setTimeout(() => {
      // 绑定上下文
      fn.apply(this, args);
    }, delay);
  };
};
```

- v2.0 版本
  - 支持立即执行一次

```js
const debounce = (fn, delay, immediate = false) => {
  let timer = null;
  return function (...args) {
    // 这里也可以不判断直接清除
    clearTimeout(timer);
    // 首次立即执行
    if (immediate && !timer) {
      fn.apply(this, args);
    }
    // 多执行一次
    timer = setTimeout(() => {
      // 绑定上下文
      fn.apply(this, args);
    }, delay);
  };
};
```

- v3.0 版本
  - 考虑回调函数有返回值
  - 支持 Cancel 功能

```js
function debounce(fn, delay, immediate) {
  let timer, res;

  const debounced = function () {
    const context = this;
    const args = arguments;
    // 这里也可以不判断直接清除
    clearTimeout(timer);
    // 支持首次立即执行
    if (immediate && !timer) {
      res = fn.apply(context, args);
    }
    // 多执行一次
    timer = setTimeout(function () {
      res = fn.apply(context, args);
    }, delay);

    return res;
  };

  debounced.cancel = function () {
    clearTimeout(timer);
    // reset
    timer = null;
  };

  return debounced;
}
```
