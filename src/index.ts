interface AsyncPoolConfig {
  limit?: number;
}

// 异步请求，最大并发3，请求全部完成后打印结果
export default function asyncPool<T, R>(config?: AsyncPoolConfig) {
  const limit = config?.limit || 6; // 最大并发数
  const queue: Array<() => Promise<any>> = []; // 请求池
  let current = 0;

  const dequeue = () => {
    while (current < limit && queue.length) {
      current++;
      const requestPromiseFactory = queue.shift(); // 出列
      if (requestPromiseFactory) {
        requestPromiseFactory().finally(() => {
          current--;
          dequeue();
        });
      }
    }
  };

  return (fn: Function) => {
    return new Promise((resolve, reject) => {
      queue.push(async () => {
        try {
          let res = await fn();
          resolve(res);
        } catch (e) {
          reject(e);
        }
      }); // 入队
      dequeue();
    });
  };
}
