# EventEmitter 发布订阅

```js
class EventEmitter {
  constructor() {
    this.events = {};
  }

  // 监听事件
  on(eventName, cb) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(cb);
  }

  // 移除事件监听
  off(eventName, cb) {
    if (this.events[eventName]) {
      this.events[eventName] = this.events[eventName].filter(
        (item) => item !== cb
      );
    }
  }

  // 触发事件
  emit(eventName, ...args) {
    const tasks = this.events[eventName] || [];
    tasks.forEach((taskItem) => {
      taskItem(...args);
    });
  }

  // 绑定一次性的事件
  once(eventName, cb) {
    const onceListener = (...args) => {
      this.off(eventName, onceListener);
      cb(...args);
    };
    this.on(eventName, onceListener);
  }
}
```

:::details 使用示例

```js
// 使用示例
const eventEmitter = new EventEmitter();

const fn = (name) => {
  console.log(name, "name");
};

eventEmitter.on("greeting", fn);

// 触发事件
eventEmitter.emit("greeting", "Pinocao");
eventEmitter.emit("greeting", "pp");

// 移除事件监听
eventEmitter.off("greeting", fn);

// 再次触发事件，此时不会有输出
eventEmitter.emit("greeting", "white");

// 一次性监听
eventEmitter.once("greeting", (name) => {
  console.log(`This is a one-time event for ${name}.`);
});

// 触发事件
eventEmitter.emit("greeting", "Dave");
// 再次触发事件，此时不会有输出
eventEmitter.emit("greeting", "Eve");
```

:::
