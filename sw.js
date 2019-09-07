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
    "url": "android-icon-144x144.png",
    "revision": "dd71f72e73a07d21f39c113851c342f6"
  },
  {
    "url": "android-icon-192x192.png",
    "revision": "4b3709f739d0ae27174586b1356ea899"
  },
  {
    "url": "android-icon-36x36.png",
    "revision": "19eec8b22e14a51503d75cace87eb6d4"
  },
  {
    "url": "android-icon-48x48.png",
    "revision": "227ddd9ff2255232cd12e5a43db3e30b"
  },
  {
    "url": "android-icon-72x72.png",
    "revision": "6d9778844c14583cb20a8845a7e06c6b"
  },
  {
    "url": "android-icon-96x96.png",
    "revision": "b3663d78cdcf31c17d54a331e956d4b4"
  },
  {
    "url": "apple-icon-114x114.png",
    "revision": "8e6c87d9fbf615085eaf58888599a930"
  },
  {
    "url": "apple-icon-120x120.png",
    "revision": "db977f6528b5ba26c7b4011186423182"
  },
  {
    "url": "apple-icon-144x144.png",
    "revision": "dd71f72e73a07d21f39c113851c342f6"
  },
  {
    "url": "apple-icon-152x152.png",
    "revision": "ab1e4ccc811991ca467def2892ddcb4c"
  },
  {
    "url": "apple-icon-180x180.png",
    "revision": "091d529ff4baa46e87795de8b701df47"
  },
  {
    "url": "apple-icon-57x57.png",
    "revision": "1457624e76a5d977237fc5c51338d409"
  },
  {
    "url": "apple-icon-60x60.png",
    "revision": "9c72c512b55cb64274fcabef140251fc"
  },
  {
    "url": "apple-icon-72x72.png",
    "revision": "6d9778844c14583cb20a8845a7e06c6b"
  },
  {
    "url": "apple-icon-76x76.png",
    "revision": "5e2b270db828be3251f3b0d11b93a058"
  },
  {
    "url": "apple-icon-precomposed.png",
    "revision": "2e1ec0322311f281e6fb0f61753b7744"
  },
  {
    "url": "apple-icon.png",
    "revision": "2e1ec0322311f281e6fb0f61753b7744"
  },
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
    "url": "assets/photos/avatar.svg",
    "revision": "67ac2e26ce4f235f8c08a06b8ab5c9a6"
  },
  {
    "url": "assets/photos/diploma-EasyCode.jpg",
    "revision": "53e8b475b38aeb6c4d6a8db1f0d64a19"
  },
  {
    "url": "assets/photos/diploma-university.jpg",
    "revision": "6c4ad1be41c49469f32120ca8eb3389f"
  },
  {
    "url": "assets/photos/diploma-WebAcademy.jpg",
    "revision": "c4495b6522f0a15b046ee1483bfc70b8"
  },
  {
    "url": "assets/photos/en.jpg",
    "revision": "e4c38be5a7ebf08b2fd1afb3b626f9d4"
  },
  {
    "url": "assets/photos/en2.jpg",
    "revision": "e4b0f1dc3cee9b8f4642102b9716d94e"
  },
  {
    "url": "assets/photos/en3.jpg",
    "revision": "827e1a957fe5de2187eae4b6382dde44"
  },
  {
    "url": "assets/photos/en4.jpg",
    "revision": "6d5507cda9a5a9630db1c020ec321b14"
  },
  {
    "url": "assets/photos/en5.jpg",
    "revision": "0e28355505c5c31e43a1ee93f8bd6558"
  },
  {
    "url": "assets/photos/smoking.png",
    "revision": "c7053b2dd319e45769a985a41677e920"
  },
  {
    "url": "assets/sounds/all-folks.mp3",
    "revision": "a518345abbaf86d002d8cb8ee3a37b38"
  },
  {
    "url": "assets/sounds/likeabos.mp3",
    "revision": "fc8126cc2d7168f9f978220890a04ceb"
  },
  {
    "url": "assets/sounds/meh.mp3",
    "revision": "cab8cb281bed323604cd6544eeb4c470"
  },
  {
    "url": "assets/styles/base.css",
    "revision": "d315ae5232fe7aa92e83eee903ac881c"
  },
  {
    "url": "favicon-16x16.png",
    "revision": "8e6e0d5b4d564b0927e88df598077aa9"
  },
  {
    "url": "favicon-32x32.png",
    "revision": "13392c7f2ae8b99441b383e63ef19682"
  },
  {
    "url": "favicon-96x96.png",
    "revision": "b3663d78cdcf31c17d54a331e956d4b4"
  },
  {
    "url": "favicon.ico",
    "revision": "631bf9a80b98c5889fd818727ec00f12"
  },
  {
    "url": "index.html",
    "revision": "ba6a06544d73ce6dc5505e9f48aaffc6"
  },
  {
    "url": "ms-icon-144x144.png",
    "revision": "dd71f72e73a07d21f39c113851c342f6"
  },
  {
    "url": "ms-icon-150x150.png",
    "revision": "0dc5fa23eee97eb95dd7b0a3ed9468a9"
  },
  {
    "url": "ms-icon-310x310.png",
    "revision": "0d6c00870f2760e8249c425cc7aba56b"
  },
  {
    "url": "ms-icon-70x70.png",
    "revision": "53683dbe90b5b71b04a381d2cd204b83"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
