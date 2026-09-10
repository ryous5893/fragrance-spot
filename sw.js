/* Fragrance Spot: static-hosting friendly offline support */
const CACHE_NAME = "fragrance-spot-v1";
const APP_SHELL = [
  "./",
  "./fragrance-spot.html",
  "./manifest.webmanifest",
  "./icons/icon.svg",
  "./assets/w/cut-bot-crimsonrose.webp",
  "./assets/w/cut-bot-freesia.webp",
  "./assets/w/cut-bot-iris.webp",
  "./assets/w/cut-bot-lavender.webp",
  "./assets/w/cut-bot-magnolia.webp",
  "./assets/w/cut-bot-muguet.webp",
  "./assets/w/cut-bot-pear.webp",
  "./assets/w/cut-bot-peony.webp",
  "./assets/w/cut-bot-redberry.webp",
  "./assets/w/cut-bot-violet.webp",
  "./assets/w/cut-fl-clear.webp",
  "./assets/w/cut-fl-crimson.webp",
  "./assets/w/cut-fl-gold.webp",
  "./assets/w/cut-fl-mauve.webp",
  "./assets/w/cut-fl-peach.webp",
  "./assets/w/cut-fl-rose.webp",
  "./assets/w/mat-grain.webp",
  "./assets/w/mat-mist.webp",
  "./assets/w/mat-paper.webp",
  "./assets/w/mat-silk.webp",
  "./assets/w/orn-band-mask.webp",
  "./assets/w/orn-rosette-mask.webp",
  "./assets/w/raw-bg-clear.webp",
  "./assets/w/raw-bg-crimson.webp",
  "./assets/w/raw-bg-gold.webp",
  "./assets/w/raw-bg-mauve.webp",
  "./assets/w/raw-bg-peach.webp",
  "./assets/w/raw-bg-quiz.webp",
  "./assets/w/raw-bg-rose.webp",
  "./assets/w/raw-mt-redsilk.webp",
  "./assets/w/raw-mt-redvelvet.webp",
  "./assets/w/raw-q-clean.webp",
  "./assets/w/raw-q-daily.webp",
  "./assets/w/raw-q-fresh.webp",
  "./assets/w/raw-q-mature.webp",
  "./assets/w/raw-q-morning.webp",
  "./assets/w/raw-q-mystery.webp",
  "./assets/w/raw-q-night.webp",
  "./assets/w/raw-q-special.webp",
  "./assets/w/raw-q-sweet.webp",
  "./assets/w/raw-q-warm.webp"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => caches.match("./fragrance-spot.html"))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      const update = fetch(event.request).then(response => {
        if (response.ok || response.type === "opaque") {
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, response.clone()));
        }
        return response;
      });
      return cached || update;
    })
  );
});
