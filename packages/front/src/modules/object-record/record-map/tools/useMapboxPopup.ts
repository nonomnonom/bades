import type mapboxgl from 'mapbox-gl';
import { useCallback, useEffect, useRef } from 'react';

import { loadMapboxGl } from './loadMapboxGl';

export type UseMapboxPopupOptions = {
  map: mapboxgl.Map | null;
  offset?: number;
  closeOnClick?: boolean;
};

export type UseMapboxPopupResult = {
  showPopup: (coords: [number, number], html: string) => void;
  closePopup: () => void;
};

// Hook untuk reuse satu instance Popup across banyak klik.
// Mapbox best practice: jangan buat Popup baru per interaksi — reuse
// instance dan panggil `setLngLat` + `setHTML` untuk memperbarui.
//
// Catatan: gunakan template HTML yang aman (escape user input) sebelum
// pass ke `setHTML` jika popup berisi data record bebas.
//
// Pakai dynamic import mapbox-gl via `loadMapboxGl()` di balik layar.
//
// Contoh:
//
//   const { showPopup, closePopup } = useMapboxPopup({ map });
//   map.on('click', 'my-layer', (e) => {
//     showPopup([e.lngLat.lng, e.lngLat.lat], `<h3>${name}</h3>`);
//   });
export const useMapboxPopup = (
  options: UseMapboxPopupOptions,
): UseMapboxPopupResult => {
  const { map, offset = 25, closeOnClick = true } = options;
  // oxlint-disable-next-line bades/no-state-useref
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  // oxlint-disable-next-line bades/no-state-useref
  const mapboxglRef = useRef<typeof mapboxgl | null>(null);

  // Preload mapbox-gl saat map ready agar showPopup() synchronous.
  useEffect(() => {
    if (!map) return;
    let cancelled = false;
    void (async () => {
      const mapboxgl = await loadMapboxGl();
      if (cancelled) return;
      mapboxglRef.current = mapboxgl;
    })();
    return () => {
      cancelled = true;
    };
  }, [map]);

  const closePopup = useCallback(() => {
    if (popupRef.current) {
      popupRef.current.remove();
    }
  }, []);

  const showPopup = useCallback(
    (coords: [number, number], html: string) => {
      if (!map || !mapboxglRef.current) return;

      // Reuse instance yang sama — Mapbox best practice untuk hemat
      // alokasi memory dan agar transisi animasi tetap halus.
      if (popupRef.current) {
        popupRef.current.remove();
      }
      popupRef.current = new mapboxglRef.current.Popup({ offset, closeOnClick })
        .setLngLat(coords)
        .setHTML(html)
        .addTo(map);
    },
    [map, offset, closeOnClick],
  );

  return { showPopup, closePopup };
};
