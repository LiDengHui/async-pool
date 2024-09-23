# Async Pool
一个轻量级的 JavaScript 异步任务并发控制工具。它允许你限制同时运行的异步任务数量，确保在同一时间只执行指定数量的任务。

## 安装
通过 npm 安装：

```shell
npm install async-pool
```
## 使用方法
asyncPool 函数可以让你管理异步操作的并发性。你可以限制并行执行的任务数量，并以受控方式处理它们。

## 示例
以下示例展示了如何使用 asyncPool 限制并发的异步任务。

```javascript
import asyncPool from 'async-pool';

// 创建一个异步任务
const mockAsyncTask = (id, delay) => {
  return () =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(`任务 ${id} 完成`);
      }, delay);
    });
};

// 创建一个并发限制为 3 的任务池
const pool = asyncPool({ limit: 3 });

const tasks = [
  pool(() => mockAsyncTask(1, 500)()),
  pool(() => mockAsyncTask(2, 1000)()),
  pool(() => mockAsyncTask(3, 300)()),
  pool(() => mockAsyncTask(4, 700)()),
  pool(() => mockAsyncTask(5, 200)()),
];

// 开始所有任务
Promise.all(tasks).then((results) => {
  console.log('所有任务已完成: ', results);
});
```
在上述示例中：

我们创建了几个不同延迟时间的异步任务。
asyncPool 用于限制同时运行的任务数量为 3。
任务分批执行，确保在任何时刻最多只有 3 个任务在运行。
## 配置
你可以通过传递可选的配置对象来自定义 asyncPool。

```javascript
const pool = asyncPool({ limit: 5 });
```
limit：(可选) 最大并发任务数量。默认为 6。

## API
```
asyncPool(config?)
  config:
    limit: (可选) 同时执行的最大任务数，默认为 6。
```
返回值：
一个函数，该函数接受一个异步任务，并将其加入队列进行执行。

## 示例：
```javascript

const pool = asyncPool({ limit: 3 });
pool(() => someAsyncFunction());
```
## 测试
单元测试使用 ava 编写。你可以使用以下命令运行测试：

```bash
npm test
```
提供了示例测试用例，以验证并发控制和错误处理功能。

## 许可证
该项目基于 MIT 许可证开源。