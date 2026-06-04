import { type RefObject, useEffect, useRef, useState } from 'react';

import { loadMapboxGl } from './loadMapboxGl';

// Reuse popup instance untuk hemat alokasi memory per interaksi.
// Dipakai di `useMapboxPopup` dan komponen lain yang sering create popup.
export type MapboxMapHandle = {
  map: mapboxgl.Map | null;
  isReady: boolean;
};

export type UseMapboxMapOptions = {
  containerRef: RefObject<HTMLDivElement | null>;
  accessToken: string;
  // Mapbox style URL (mis. 'mapbox://styles/mapbox/light-v11') atau
  // style specification object.
  style: string;
  center: [number, number];
  zoom: number;
  // Throttle `moveend` callback. Default 100ms. Set 0 untuk disable.
  moveEndThrottleMs?: number;
  // Dipanggil sekali saat style sudah loaded. Tempat ideal untuk
  // addSource/addLayer dan pasang click handler.
  onLoad?: (map: mapboxgl.Map) => void;
  // Dipanggil setiap ada error Mapbox (rate limit, network, dll).
  onError?: (event: mapboxgl.ErrorEvent) => void;
  // Dipanggil setelah user selesai interaksi (pan/zoom), sudah di-throttle.
  onMoveEnd?: (map: mapboxgl.Map) => void;
  // Dipanggil sekali saat cleanup, untuk unmount kontrol/popup eksternal.
  onBeforeUnmount?: (map: mapboxgl.Map) => void;
};

// Hook generik untuk lifecycle Mapbox: inisialisasi map (via dynamic
// import mapbox-gl), attach event listener (load/error/moveend), dan
// cleanup memori. Pakai refs di balik layar untuk hindari re-render
// tambahan — component hanya re-render saat `isReady` berubah.
//
// Pakai `loadMapboxGl()` di balik layar sehingga chunk mapbox-gl
// ~250KB tidak masuk ke initial bundle.
//
// Contoh:
//
//   const containerRef = useRef<HTMLDivElement>(null);
//   const { map, isReady } = useMapboxMap({
//     containerRef,
//     accessToken: getMapboxAccessToken(),
//     style: 'mapbox://styles/mapbox/light-v11',
//     center: [110.61, -7.41],
//     zoom: 13,
//     onLoad: (map) => {
//       map.addSource(...);
//       map.addLayer(...);
//     },
//   });
export const useMapboxMap = (options: UseMapboxMapOptions): MapboxMapHandle => {
  const {
    containerRef,
    accessToken,
    style,
    center,
    zoom,
    moveEndThrottleMs = 100,
    onLoad,
    onError,
    onMoveEnd,
    onBeforeUnmount,
  } = options;

  const centerLng = center[0];
  const centerLat = center[1];

  // Pakai ref untuk map instance — map object tidak perlu trigger re-render.
  // oxlint-disable-next-line bades/no-state-useref
  const mapRef = useRef<mapboxgl.Map | null>(null);
  // Simpan callback refs agar effect init tidak perlu re-run ketika
  // callback berubah identitas. Mengikuti pattern `useEffectEvent` agar
  // callback bisa di-pass inline tanpa menambah dep.
  // oxlint-disable-next-line bades/no-state-useref
  const onLoadRef = useRef(onLoad);
  // oxlint-disable-next-line bades/no-state-useref
  const onErrorRef = useRef(onError);
  // oxlint-disable-next-line bades/no-state-useref
  const onMoveEndRef = useRef(onMoveEnd);
  // oxlint-disable-next-line bades/no-state-useref
  const onBeforeUnmountRef = useRef(onBeforeUnmount);
  // oxlint-disable-next-line bades/no-state-useref
  const moveEndTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // State `isReady` adalah pengecualian — dipakai untuk render conditional.
  const [isReady, setIsReady] = useState(false);

  // Sinkronkan callback refs dengan nilai terbaru di setiap render.
  // TIDAK menyebabkan effect init re-run.
  onLoadRef.current = onLoad;
  onErrorRef.current = onError;
  onMoveEndRef.current = onMoveEnd;
  onBeforeUnmountRef.current = onBeforeUnmount;

  useEffect(() => {
    const container = containerRef.current;
    if (!container || accessToken.length === 0) return undefined;

    let cancelled = false;
    let mapInstance: mapboxgl.Map | null = null;

    void (async () => {
      const mapboxgl = await loadMapboxGl();
      if (cancelled) return;

      // Dynamic import via `loadMapboxGl` mengembalikan default export
      // yang tipenya tidak mencakup properti static `accessToken`.
      // Cast aman karena di runtime mapbox-gl namespace punya properti ini.
      (mapboxgl as unknown as { accessToken: string }).accessToken =
        accessToken;

      // Warn dev kalau token terlihat salah (sk.* atau tidak ber-prefix pk.*).
      // Hanya jalan sekali per hook mount; tidak mengganggu production.
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { warnIfMapboxTokenLooksInvalid } =
        require('@/object-record/record-map/utils/getMapboxAccessToken') as {
          warnIfMapboxTokenLooksInvalid: () => void;
        };
      warnIfMapboxTokenLooksInvalid();

      const map = new mapboxgl.Map({
        center,
        container,
        style,
        zoom,
      });

      mapRef.current = map;
      mapInstance = map;

      const handleLoad = () => {
        if (cancelled) return;
        setIsReady(true);
        onLoadRef.current?.(map);
      };

      const handleError = (event: mapboxgl.ErrorEvent) => {
        // eslint-disable-next-line no-console
        console.error('[Mapbox]', event.error?.message ?? event);
        onErrorRef.current?.(event);
      };

      const handleMoveEnd = () => {
        if (moveEndThrottleMs <= 0) {
          onMoveEndRef.current?.(map);
          return;
        }
        if (moveEndTimerRef.current !== null) {
          clearTimeout(moveEndTimerRef.current);
        }
        moveEndTimerRef.current = setTimeout(() => {
          onMoveEndRef.current?.(map);
        }, moveEndThrottleMs);
      };

      map.on('load', handleLoad);
      map.on('error', handleError);
      map.on('moveend', handleMoveEnd);
    })();

    return () => {
      cancelled = true;
      if (moveEndTimerRef.current !== null) {
        clearTimeout(moveEndTimerRef.current);
        moveEndTimerRef.current = null;
      }
      if (mapInstance) {
        onBeforeUnmountRef.current?.(mapInstance);
      }
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      setIsReady(false);
    };
    // Efek init hanya bergantung pada identitas container, token, dan
    // konfigurasi map. Callback di-pass via ref agar perubahan callback
    // tidak memicu re-init.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    containerRef,
    accessToken,
    style,
    moveEndThrottleMs,
    centerLng,
    centerLat,
    zoom,
  ]);

  return { map: mapRef.current, isReady };
};
