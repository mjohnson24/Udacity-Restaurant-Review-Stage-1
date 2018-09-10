var version = 'RestaurantReview-v1';
var cacheURLs = [
    '/',
    '/index.html',
    '/restaurant.html',
    '/css/styles.css',
    '/data/restaurants.json',
    '/img/1.jpg',
    '/img/2.jpg',
    '/img/3.jpg',
    '/img/4.jpg',
    '/img/5.jpg',
    '/img/6.jpg',
    '/img/7.jpg',
    '/img/8.jpg',
    '/img/9.jpg',
    '/img/10.jpg',
    '/js/dbhelper.js',
    '/js/main.js',
    '/js/restaurant_info.js'
];

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(version)
        .then(function (cache) {
            console.log('Service Worker: Cache is installed');
            return cache.addAll(cacheURLs);
        })
        .then(function () {
            console.log('Service Worker: Install is complete');
        })
    );
});

self.addEventListener('fetch', function (event) {
    event.respondWidth(
        caches.match(event.request).then(function (response) {
            if (response) {
                console.log('Oooh Oooh! Guess what! I Found ', event.request, ' in cache');
            } else {
                console.log('Sorry no cache for you! Could not find ', event.request, ' in cache');
                return fetch(event.request)
                    .then(function (response) {
                        const clonedResponse = response.clone();
                        caches.open('v1').then(function (cache) {
                            cache.put(event.request, clonedResponse);
                        })
                        return response;
                    })
                    .catch(function (err) {
                        console.error(err);
                    })
            }
        })
    );
});

self.addEventListener("activate", function (event) {
    event.waitUntil(
        caches.keys().then(cacheNames => Promise.all(cacheNames.map(cache => {
            if (cache !== version) {
                console.log("ServiceWorker: I am removing cached files ");
                return caches.delete(cache);
            }
        })))
    )
});