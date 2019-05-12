/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "assets/photos/1.jpg",
    "revision": "ca2bf391c505eb7baa62851e4b9983b3"
  },
  {
    "url": "assets/photos/10.jpg",
    "revision": "a1cf095853b5ddbe9c6842f227dccf35"
  },
  {
    "url": "assets/photos/11.jpg",
    "revision": "65ac3ddb20b4c5a0faef4671eab5fecf"
  },
  {
    "url": "assets/photos/12.jpg",
    "revision": "43f8ad18ffa9fdf6ce29eb855b121239"
  },
  {
    "url": "assets/photos/13.jpg",
    "revision": "0c901d54ccc9f490abf872aa80817ed1"
  },
  {
    "url": "assets/photos/14.jpg",
    "revision": "32af3db68275f53a5c329d8f993930b0"
  },
  {
    "url": "assets/photos/2.jpg",
    "revision": "1dfc0a5a290318e99a438b10f53bd786"
  },
  {
    "url": "assets/photos/3.jpg",
    "revision": "2ddb14c1b7d7b90cb1e9bdc4e68487b4"
  },
  {
    "url": "assets/photos/4.jpg",
    "revision": "34d56acdf0383b4418c3ffc86a70fcbb"
  },
  {
    "url": "assets/photos/5.jpg",
    "revision": "5987ca54b5014e4b4d4a0ef9616283b9"
  },
  {
    "url": "assets/photos/6.jpg",
    "revision": "fcec7d279970844a1ec64c684bb0c326"
  },
  {
    "url": "assets/photos/7.jpg",
    "revision": "ddc1105ba349fb5afc88b643551e18aa"
  },
  {
    "url": "assets/photos/8.jpg",
    "revision": "f521f89cf36e4fa23662ebea18f8e724"
  },
  {
    "url": "assets/photos/9.jpg",
    "revision": "3f4616b7e63566207ec9f6b0298c4867"
  },
  {
    "url": "assets/photos/logo.jpg",
    "revision": "8bcdd60797b25b844e732285d863294a"
  },
  {
    "url": "assets/sounds/meh.mp3",
    "revision": "cab8cb281bed323604cd6544eeb4c470"
  },
  {
    "url": "assets/styles/base.css",
    "revision": "5bb01f540082ce711fbb66cab51bcf8d"
  },
  {
    "url": "favicon.ico",
    "revision": "6ff539df065a0c01f10e83f650532223"
  },
  {
    "url": "index.html",
    "revision": "d9769ed529ffd7c24cbf053d4bd54c23"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
