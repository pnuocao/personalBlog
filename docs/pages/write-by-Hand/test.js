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
