import { useEffect, useRef } from 'react';

import { loadMapboxGl } from './loadMapboxGl';

export type UseMapboxGeolocateOptions = {
  map: mapboxgl.Map | null;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  // Otomatis pusatkan peta ke lokasi user saat pertama kali dapat geolokasi.
  trackUserLocation?: boolean;
  // Tampilkan accuracy circle di sekitar dot lokasi user.
  showAccuracyCircle?: boolean;
  onSuccess?: (coords: { longitude: number; latitude: number }) => void;
  onError?: (error: GeolocationPositionError | Error) => void;
};

export type UseMapboxGeolocateResult = {
  triggerGeolocate: () => void;
};

// Hook untuk menambahkan GeolocateControl (tombol "pusatkan ke lokasi
// saya" bawaan Mapbox) ke peta. Memudahkan operator desa yang ingin
// navigasi dari posisi GPS mereka saat ini.
//
// GeolocateControl adalah Mapbox built-in — tidak perlu token tambahan.
// Browser akan meminta izin akses lokasi ke user saat trigger pertama.
//
// Pakai dynamic import mapbox-gl via `loadMapboxGl()` di balik layar.
//
// Contoh:
//
//   useMapboxGeolocate({ map, position: 'top-right' });
export const useMapboxGeolocate = (
  options: UseMapboxGeolocateOptions,
): UseMapboxGeolocateResult => {
  const {
    map,
    position = 'top-right',
    trackUserLocation = false,
    showAccuracyCircle = true,
    onSuccess,
    onError,
  } = options;

  const controlRef = useRef<mapboxgl.GeolocateControl | null>(null);

  useEffect(() => {
    if (!map) return undefined;

    // Ref cleanup agar return useEffect bisa invoke dari async path.
    const cleanupRef: { current: (() => void) | null } = { current: null };
    let cancelled = false;

    void (async () => {
      const mapboxgl = await loadMapboxGl();
      if (cancelled) return;

      const control = new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation,
        showAccuracyCircle,
      });
      controlRef.current = control;
      map.addControl(control, position);

      const handleGeolocate = (event: GeolocationPosition) => {
        onSuccess?.({
          longitude: event.coords.longitude,
          latitude: event.coords.latitude,
        });
      };

      const handleErrorEvent = (event: GeolocationPositionError) => {
        onError?.(event);
      };

      control.on('geolocate', handleGeolocate);
      control.on('error', handleErrorEvent);

      cleanupRef.current = () => {
        control.off('geolocate', handleGeolocate);
        control.off('error', handleErrorEvent);
        if (controlRef.current) {
          map.removeControl(controlRef.current);
          controlRef.current = null;
        }
      };
    })();

    return () => {
      cancelled = true;
      cleanupRef.current?.();
    };
  }, [
    map,
    position,
    trackUserLocation,
    showAccuracyCircle,
    onSuccess,
    onError,
  ]);

  const triggerGeolocate = () => {
    controlRef.current?.trigger();
  };

  return { triggerGeolocate };
};
