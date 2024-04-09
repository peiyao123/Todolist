self.addEventListener("install", (event) => {
  console.log("Service worker installing...");
  // 在这里添加缓存资源的代码
  event.waitUntil(
    caches.open('my-cache').then(cache => {
      return cache.addAll([
        '/sec/components/FilterButton.jsx',
        '/sec/components/Form.jsx',
        '/public/256x256.png',
        '/public/duomi.png',
        '/sec/components/Todo.jsx',
        '/sec/App.css',
        '/sec/App.jsx',
        '/sec/db.jsx',
        '/sec/index.css',
        '/sec/main.jsx',
        '/index.html',
        '/vite.config.js',
      ]);
    })
  );
});

// self.addEventListener('fetch', event => {
//   event.respondWith(
//     caches.match(event.request).then(response => {
//       return response || fetch(event.request);
//     })
//   );
// });







