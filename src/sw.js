const CACHE_NAME = 'fairyfloss-cache-v1';
const urlsToCache = [
  '/',
  '/images/image1.jpg',
  '/images/image2.jpg',
  '/images/small/image1.jpg',
  '/images/small/image2.jpg',
];

self.addEventListener('install', (event) => {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});