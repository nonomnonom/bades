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
  // Cleanup popup saat map berubah atau unmount — cegah memory leak
  // dari DOM remnants Mapbox popup.
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
      if (popupRef.current) {
        popupRef.current.remove();
        popupRef.current = null;
      }
    };
  }, [map]);

  const closePopup = useCallback(() => {
    if (popupRef.current) {
      popupRef.current.remove();
    }
  }, []);

  // showPopup — reuse satu Popup instance (create sekali, update selanjutnya).
  // Mapbox best practice: `remove()` lalu `setLngLat` + `setHTML` + `addTo`
  // lebih efisien daripada `new Popup()` per interaksi. Menghindari alokasi
  // DOM tiap klik dan GC pressure, serta transisi popup tetap halus.
  const showPopup = useCallback(
    (coords: [number, number], html: string) => {
      if (!map || !mapboxglRef.current) return;

      const MapboxPopup = mapboxglRef.current.Popup;

      if (popupRef.current) {
        popupRef.current.remove().setLngLat(coords).setHTML(html).addTo(map);
      } else {
        popupRef.current = new MapboxPopup({ offset, closeOnClick })
          .setLngLat(coords)
          .setHTML(html)
          .addTo(map);
      }
    },
    [map, offset, closeOnClick],
  );

  return { showPopup, closePopup };
};
