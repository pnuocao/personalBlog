# 节流函数

::: tip
定义：当持续触发事件时，在规定时间段内只能调用一次回调函数
:::

## 应用场景

1. 滚动事件监听，使用节流来判断是否滑动到底部，菜单联动等
2. 窗口 resize 事件
3. 诸如拖拽等鼠标事件，在拖拽过程的监听也可以使用节流
4. 频繁的点击事件，在每个时间间隔内执行一次

## 实现

- v1.0 版本
  - 利用时间戳作差（立即执行，最后一次不执行）

```js
const throttle = (fn, delay) => {
  let pre = 0;
  return function (...args) {
    if (Date.now() - pre > delay) {
      pre = Date.now();
      fn.apply(this, args);
    }
  };
};
```

- v2.0 版本
  - 使用定时器（第一次延时执行，会执行最后）

```js
const throttle = (fn, delay) => {
  let timer = null;
  return function (...args) {
    if (!timer) {
      timer = setTimeout(() => {
        // 这里要重置，和防抖有区别
        timer = null;
        fn.apply(this, args);
      }, delay);
    }
  };
};
```

- v3.0 版本
  - 结合 V1.0 和 V2.0 版本，保证第一次和最后一次都会执行

```js
const throttle = (fn, delay) => {
  let pre = 0;
  let timer = null;
  return function (...args) {
    if (Date.now() - pre > delay) {
      // 这里timer相关的也要reset
      clearTimeout(timer);
      timer = null;
      pre = Date.now();
      fn.apply(this, args);
    } else if (!timer) {
      // 保证最后一次会执行，无需操作pre
      timer = setTimeout(() => {
        fn.apply(this, args);
      }, fn);
    }
  };
};
```

- v4.0 版本
  - 支持第一次和最后一次是否执行的参数配置 leading：false 表示禁用第一次执行 trailing: false 表示禁用停止触发的回调, 不能同时为 false
  - 支持取消

```js
const throttle = (fn, delay, options = {}) => {
  let timer = null;
  let pre = 0;
  let context, args;

  const later = function () {
    pre = options.leading === false ? 0 : Date.now();
    timer = null;
    fn.apply(context, args);
    context = args = null;
  };

  const throttled = function () {
    const now = Date.now();
    // leading为false的话第一次不执行
    if (!pre && options.leading === false) pre = now;
    context = this;
    args = arguments;
    const remaining = delay - (now - pre);

    if (remaining <= 0) {
      // 清除中间过程中可能增加的定时器
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      pre = now;
      fn.apply(context, args);
      context = args = null;
      // trailing 设置计时器执行最后一次
    } else if (!timer && options.trailing !== false) {
      timer = setTimeout(later, remaining);
    }
  };

  throttled.cancel = function () {
    clearTimeout(timer);
    pre = 0;
    timer = null;
  };

  return throttled;
};
```

> [学习文章](https://github.com/mqyqingfeng/Blog/issues/26)
