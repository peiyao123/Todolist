self.addEventListener("install", (event) => {
  console.log("Service worker installing...");
  // 在这里添加缓存资源的代码
  event.waitUntil(
    caches.open('my-cache').then(cache => {
      return cache.addAll([
        '/src/components/FilterButton.jsx',
        '/src/components/Form.jsx',
        '/public/256x256.png',
        '/public/duomi.png',
        '/components/Todo.jsx',
        '/src/App.css',
        '/src/App.jsx',
        '/src/db.jsx',
        '/src/index.css',
        '/src/main.jsx',
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







