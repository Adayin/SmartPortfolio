const CACHE_NAME = 'smartportfolio-v1';
const STATIC_CACHE = [
  '/',
  '/manifest.json',
  '/index.html',
  // 这些路径会在构建时生成，实际使用时需要根据dist目录中的文件调整
];

// 安装 Service Worker 并缓存静态资源
self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_CACHE);
    })
  );
});

// 激活新的 Service Worker 并清理旧缓存
self.addEventListener('activate', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
});

// 拦截请求并提供缓存或网络资源
self.addEventListener('fetch', (event: FetchEvent) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // 如果缓存中有响应，直接返回
      if (response) {
        return response;
      }

      // 否则发起网络请求
      return fetch(event.request).then((networkResponse) => {
        // 克隆响应，因为响应流只能使用一次
        const responseToCache = networkResponse.clone();

        // 将响应存入缓存（仅对成功的GET请求）
        if (networkResponse.status === 200 && event.request.method === 'GET') {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }

        return networkResponse;
      }).catch(() => {
        // 网络失败时，尝试返回离线页面或缓存内容
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});

// 扩展类型声明
declare global {
  interface ExtendableEvent extends Event {
    waitUntil(promise: Promise<any>): void;
  }

  interface FetchEvent extends Event {
    request: Request;
    respondWith(response: Promise<Response> | Response): void;
  }
}
