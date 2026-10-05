/* sw.js — JB Design PWA 서비스 워커 (Phase 3-3).
 *
 * 목표: 공개 사이트의 **오프라인 셸**(정적 자산 + 루트 셸)만 캐시한다.
 * 원칙
 *  - API(`/api/*`)와 교차 출처(GAS 등)는 **절대 캐시하지 않는다**(항상 네트워크).
 *  - 정적 자산(빌드 해시가 붙은 /assets, 이미지, 폰트)은 cache-first 로 즉시 응답.
 *  - 페이지 이동(navigate)은 network-first, 오프라인이면 캐시한 셸로 폴백한다.
 *  - 설치/활성화 실패가 앱을 깨뜨리지 않도록 모든 단계를 try/catch 로 감싼다.
 *  - 프론트 배포(빌드 해시 변경) 시 이전 캐시는 activate 에서 정리한다.
 */
const CACHE = "jbdesign-pwa-v1";
const PRECACHE = [
  "/",
  "/manifest.webmanifest",
  "/logo.svg",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .catch(() => {})
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .catch(() => {})
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  let url;
  try {
    url = new URL(req.url);
  } catch (e) {
    return;
  }
  // 교차 출처(GAS API 등)와 API 요청은 캐시하지 않는다.
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/")) return;

  const isStatic = url.pathname.startsWith("/assets/") || /\.(png|jpe?g|webp|avif|gif|svg|ico|woff2?|css|js)$/i.test(url.pathname);
  if (isStatic) {
    event.respondWith(
      caches.match(req).then(
        (hit) =>
          hit ||
          fetch(req)
            .then((res) => {
              if (res && res.ok) {
                const copy = res.clone();
                caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
              }
              return res;
            })
            .catch(() => hit)
      )
    );
    return;
  }

  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
          }
          return res;
        })
        .catch(() => caches.match(req).then((hit) => hit || caches.match("/")))
    );
  }
});
