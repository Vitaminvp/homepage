// Tombstone for the retired service worker.
//
// The generated Workbox worker that used to live here was last built on
// 2020-01-01. The icons moved to assets/icons/ in June 2021, so 21 of its 58
// precache entries pointed at files that no longer existed, and a precache
// miss fails the install — offline support had been dead for years.
//
// It cannot simply be deleted: a visitor whose browser still runs the old
// worker is served its cached copy of the page, so nothing in the page can
// remove it. The browser does re-fetch this file on navigation, which is the
// one hook left. This version takes over, empties the caches and unregisters
// itself, handing the visitor back to the network.
//
// Once it has been live long enough for that to have happened, delete this
// file. A 404 here also drops the registration in current browsers.

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(names.map((name) => caches.delete(name)));
      await self.registration.unregister();
      const clients = await self.clients.matchAll({ type: "window" });
      clients.forEach((client) => client.navigate(client.url));
    })()
  );
});
