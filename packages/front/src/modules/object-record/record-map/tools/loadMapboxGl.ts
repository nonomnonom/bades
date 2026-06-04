import type mapboxgl from 'mapbox-gl';

// Lazy loader untuk mapbox-gl.
//
// Memuat mapbox-gl via dynamic `import()` agar chunk ~250KB tidak
// masuk ke initial bundle. Chunk ini hanya di-load saat komponen
// RecordMap (atau konsumen lain) pertama kali mount.
//
// Pakai module-level cache agar multiple mount tidak trigger multiple
// network request untuk chunk yang sama.
//
// Side-effect import CSS juga di-lazy — Mapbox stylesheet ikut
// ter-bundle dalam chunk terpisah.
//
// Pakai:
//
//   const mapboxgl = await loadMapboxGl();
//   const map = new mapboxgl.Map({ ... });
//
export type MapboxGlNamespace = typeof mapboxgl;

let cachedPromise: Promise<MapboxGlNamespace> | null = null;

export const loadMapboxGl = (): Promise<MapboxGlNamespace> => {
  if (cachedPromise) return cachedPromise;

  cachedPromise = (async () => {
    // CSS side-effect import — Vite akan emit sebagai CSS chunk.
    await import('mapbox-gl/dist/mapbox-gl.css');
    const mod = (await import('mapbox-gl')) as unknown as {
      default: MapboxGlNamespace;
    };
    return mod.default;
  })();

  return cachedPromise;
};
