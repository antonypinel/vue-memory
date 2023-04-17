import { precacheAndRoute } from 'workbox-precaching';
import { CacheFirst } from 'workbox-strategies';
import { registerRoute } from 'workbox-routing';

precacheAndRoute(self.__WB_MANIFEST);

importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

registerRoute(
    ({ request }) => request.destination === 'image',
    new CacheFirst()
);
