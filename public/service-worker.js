var CACHE_NAME = 'glb-cache-v1';
var glbFilesToCache = ['hotel.glb', 'room-1-1.glb'];
// // Install event - Cache the GLB files
self.addEventListener('install', function (event) {
    event.waitUntil(caches.open(CACHE_NAME).then(function (cache) {
        console.log('Opened cache and caching GLB files');
        return cache.addAll(glbFilesToCache)
            .then((res) => {
                console.log(res);
            }).catch(error => {
            console.log(error);
        })
    }));
});
// // Fetch event - Serve GLB files from cache or network
// self.addEventListener('fetch', function (event) {
//     var requestUrl = new URL(event.request.url);
//     if (glbFilesToCache.includes(requestUrl.pathname)) {
//         console.log("here");
//         event.respondWith(caches.match(event.request).then(function (response) {
//             return response || fetch(event.request).then(function (networkResponse) {
//                 return caches.open(CACHE_NAME).then(function (cache) {
//                     cache.put(event.request, networkResponse.clone());
//                     return networkResponse;
//                 });
//             });
//         }));
//     }
// });
// // Activate event - Clean up old caches
self.addEventListener('activate', function (event) {
    console.log("active");

    var cacheWhitelist = [CACHE_NAME];
    event.waitUntil(caches.keys().then(function (cacheNames) {
        return Promise.all(cacheNames.map(function (cacheName) {
            if (!cacheWhitelist.includes(cacheName)) {
                return caches.delete(cacheName);
            }
        }));
    }));
});


// // const CACHE_NAME = 'glb-cache-v2';

// // self.addEventListener('install', (event) => {
// //     event.waitUntil(
// //         caches.open(CACHE_NAME).then((cache) => {
// //             console.log('Opened cache and caching GLB files');
// //         })
// //     );
// // });

// // self.addEventListener('fetch', (event) => {
// //     console.log(event.request.url);

// //     if (event.request.url.endsWith('.glb')) {
// //         event.respondWith(
// //             caches.open(CACHE_NAME).then((cache) => {
// //                 return cache.match(event.request).then((response) => {
// //                     if (response) {
// //                         return response; // Return cached response
// //                     }

// //                     return fetch(event.request).then((newResponse) => {
// //                         // Log the newResponse object for debugging
// //                         console.log('Fetch response:', newResponse);

// //                         // Check if the response is valid
// //                         if (!newResponse || newResponse.status !== 200 || newResponse.type !== 'basic') {
// //                             console.warn('Response not cacheable:', newResponse);
// //                             return newResponse; // Return the response if it cannot be cached
// //                         }

// //                         // Cache the response
// //                         return cache.put(event.request, newResponse.clone()).then(() => {
// //                             return newResponse;
// //                         }).catch((error) => {
// //                             console.error('Cache put failed:', error);
// //                         });
// //                     }).catch((error) => {
// //                         console.error('Fetch failed:', error);
// //                     });
// //                 });
// //             })
// //         );
// //     }
// // });


// // self.addEventListener('activate', (event) => {
// //     console.log("hello2");

// //     event.waitUntil(
// //         caches.keys().then((cacheNames) => {
// //             return Promise.all(
// //                 cacheNames.map((cacheName) => {
// //                     if (cacheName !== CACHE_NAME) {
// //                         return caches.delete(cacheName);
// //                     }
// //                 })
// //             );
// //         })
// //     );
// // });

// var glbFilesToCache = ['/hotel.glb', '/room-1-1.glb'];
// // Install event - Cache the GLB files
// self.addEventListener('install', function (event) {
//     event.waitUntil(caches.open(CACHE_NAME).then(function (cache) {
//         console.log('Opened cache and caching GLB files');
//         return cache.addAll(glbFilesToCache)
//             .then((res) => {
//                 console.log(res);
//             }).catch(error => {
//             console.log(error);
//         })
//     }));
// });

self.addEventListener('fetch', event => {
    console.log(event.request);
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});
