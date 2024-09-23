import test from 'ava';
import asyncPool from './dist/index.js'; // 假设 asyncPool 是默认导出的

// 模拟一个异步请求函数
const mockAsyncTask = (id, delay) => {
  return () =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(id);
      }, delay);
    });
};

test('asyncPool should handle max concurrency limit', async (t) => {
  const pool = asyncPool({ limit: 3 }); // 限制最大并发为3

  // 创建一些任务
  const tasks = [
    pool(() => mockAsyncTask(1, 500)()),
    pool(() => mockAsyncTask(2, 1000)()),
    pool(() => mockAsyncTask(3, 300)()),
    pool(() => mockAsyncTask(4, 700)()),
    pool(() => mockAsyncTask(5, 200)()),
  ];

  // 开始所有任务
  const results = await Promise.all(tasks);

  // 验证结果
  t.deepEqual(results.sort(), [1, 2, 3, 4, 5]); // 确保所有结果都完成
});

test('asyncPool should reject on error', async (t) => {
  const pool = asyncPool({ limit: 3 });

  const errorTask = () =>
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Task failed')), 500);
    });

  const tasks = [pool(() => mockAsyncTask(1, 300)()), pool(() => errorTask())];

  try {
    await Promise.all(tasks);
    t.fail('One task should have failed');
  } catch (error) {
    t.is(error.message, 'Task failed'); // 检查错误信息
  }
});
