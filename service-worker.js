const CACHE_NAME = "kurdisiv-cache-v1";
const API_PREFIX = "/api/";
const STATIC_ASSETS = [
    "/",
    "/index.html",
    "/style.css",
    "/main.js",
    "/manifest.json"
];


self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(STATIC_ASSETS);
        })
    );
});


self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
            );
        })
    );
});


self.addEventListener("fetch", event => {
    const reqUrl = new URL(event.request.url);

    // Handle API requests with network-first, fallback to cache
    if (reqUrl.pathname.startsWith(API_PREFIX)) {
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    // cache a clone of successful GET responses for offline
                    if (event.request.method === 'GET' && response.ok) {
                        const copy = response.clone();
                        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
                    }
                    return response;
                })
                .catch(() => caches.match(event.request))
        );
        return;
    }

    // For static assets: cache-first
    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            return cachedResponse || fetch(event.request).then(resp => {
                // populate cache for future offline use
                if (event.request.method === 'GET') {
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, resp.clone()));
                }
                return resp;
            }).catch(() => {
                // fallback to root for navigation requests
                if (event.request.mode === 'navigate') return caches.match('/');
            });
        })
    );
});
