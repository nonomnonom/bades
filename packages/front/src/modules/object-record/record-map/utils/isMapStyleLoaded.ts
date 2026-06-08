import type mapboxgl from 'mapbox-gl';

// Guard operasi Mapbox saat style belum siap atau map sudah di-remove().
export const isMapUsable = (map: mapboxgl.Map | null): boolean => {
  if (map === null) {
    return false;
  }

  try {
    // getSource() memanggil this.style.getOwnSource — pastikan style object ada.
    return map.getStyle() !== undefined && map.isStyleLoaded();
  } catch {
    return false;
  }
};

/** @deprecated Pakai `isMapUsable` — nama lama dipertahankan untuk import yang ada. */
export const isMapStyleLoaded = (map: mapboxgl.Map): boolean =>
  isMapUsable(map);

export const safeGetMapSource = (
  map: mapboxgl.Map,
  sourceId: string,
): mapboxgl.Source | undefined => {
  if (!isMapUsable(map)) {
    return undefined;
  }

  try {
    return map.getSource(sourceId) ?? undefined;
  } catch {
    return undefined;
  }
};

export const safeRemoveMapControl = (
  map: mapboxgl.Map,
  control: mapboxgl.IControl,
): void => {
  if (!isMapUsable(map)) {
    return;
  }

  try {
    map.removeControl(control);
  } catch {
    // Mapbox melempar jika kontrol sudah di-remove bersama map.remove().
  }
};
