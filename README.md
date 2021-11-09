# async-process-limit

[![npm](https://img.shields.io/npm/v/async-process-limit.svg)](https://www.npmjs.com/package/async-process-limit)

This library can be used in the **NodeJs**, **Browser** and **Espruino** , but platform need support `Promise` or `async/await` only.

## Installation

```sh
npm install async-process-limit
```

## How to use

`require` the library

```js
const Queue = require("async-process-limit");
```

create example

```js
const array=[1,2,3,4,5,6,7....]
const q=new Queue({
    list: array,
    limit: 3,
    async process(val, taskId) {
      //....
    }
});

```

## Parameters

`new Queue(options)`

### options

This library support follow options:

- `process`: A function that will be called when a process ( `Callback(cursorValue, taskId)` )
- `error`: A function that will be called when on error ( `Callback(Error, cursorValue, tryCount, taskId)` )
- `list`: A array set process value list ( Default: `[]` )
- `start`: A boolean set execute now ( Default: `false` )
- `limit`: A number set task max length ( Default: `1` )
- `retry`: A number set task retry count ( Default: `0` )

## Methods

### `q.start()`

start forEach and process

### `q.stop()`

Stops the queue. can be resumed with `q.start()`.

### `q.end()`

Stop and empty the queue immediately.

### `q.push(item1,item2,item3...)`

### `q.concat([item1,item2,item3...])`

## example

### simple start :

```js
const queue = new Queue({
  list: rows,
  start: true,
  limit: 3,
  async process(val, taskId) {
    // processing
  },
});

// or

q.start();
```

### normal demo :

I tested it in my espruino board( ESP32 / ESP8266 ). It's OK

```js
const queue = new Queue({
  list: array,
  start: true,
  limit: 3,
  process: (val, taskId) => {
    return new Promise((r) => {
      // processing
    });
  },
});
```

### async function :

```js
const queue = new Queue({
  list: array,
  start: true,
  limit: 3,
  async process(val, taskId) {
    // processing
  },
});
```

### retry :

```js
const queue = new Queue({
  limit: 3,
  retry: 3, //<===
  async process(val, taskId) {
    // processing
  },
  error(err, val, tryCount, taskId) {
    // error
  },
});
```

### PromiseArray

```js
const queue = new Queue({
  list: PromiseArray,
  limit: 3,
  start: true,
  retry: 3,
});
```

### Push / Concat

```js
const queue = new Queue({
  start: true,
  limit: 3,
  async process(val, taskId) {
    // processing
  },
});

queue.push(...array);
queue.concat(array);
```
