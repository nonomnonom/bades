import { useEffect, useRef } from 'react';

export type MapboxSourceOptions<TData> = {
  map: mapboxgl.Map | null;
  isReady: boolean;
  sourceId: string;
  // Data GeoJSON atau function untuk fetch. Dipakai untuk update source
  // secara imperatif saat `data` berubah (efisien, tidak perlu remove/re-add).
  data: TData;
  cluster?: boolean;
  clusterMaxZoom?: number;
  clusterRadius?: number;
  // Dipanggil setiap kali source berhasil di-add ATAU data berubah.
  // Tempat yang tepat untuk addLayer (dilakukan sekali per sourceId).
  onSourceReady?: (map: mapboxgl.Map) => void;
};

// Hook untuk manage GeoJSON source + dependent layers dengan lifecycle
// yang aman. Source di-add sekali saat map ready; data di-update via
// `setData` (lebih efisien dari remove+add). Layer juga di-add sekali
// di `onSourceReady`.
//
// Contoh dengan cluster:
//
//   useMapboxSource({
//     map,
//     isReady,
//     sourceId: 'records',
//     data: geoJson,
//     cluster: true,
//     clusterMaxZoom: 14,
//     clusterRadius: 50,
//     onSourceReady: (map) => {
//       map.addLayer({ id: 'clusters', type: 'circle', ... });
//     },
//   });
export const useMapboxSource = <TData>(
  options: MapboxSourceOptions<TData>,
): void => {
  const {
    map,
    isReady,
    sourceId,
    data,
    cluster = false,
    clusterMaxZoom,
    clusterRadius,
    onSourceReady,
  } = options;

  // Pakai ref untuk callback agar update data tidak trigger re-add source.
  const onSourceReadyRef = useRef(onSourceReady);
  onSourceReadyRef.current = onSourceReady;

  // Track apakah source sudah pernah di-add (sehingga kita tahu apakah
  // perlu addSource atau cukup setData).
  const isSourceAddedRef = useRef(false);

  // Tambah source dan layer sekali saat map ready.
  useEffect(() => {
    if (!map || !isReady) return undefined;
    if (isSourceAddedRef.current) return undefined;

    const sourceConfig: mapboxgl.GeoJSONSourceSpecification = {
      type: 'geojson',
      data: data as GeoJSON.FeatureCollection | GeoJSON.Feature | string,
      cluster,
    };
    if (clusterMaxZoom !== undefined) {
      sourceConfig.clusterMaxZoom = clusterMaxZoom;
    }
    if (clusterRadius !== undefined) {
      sourceConfig.clusterRadius = clusterRadius;
    }

    map.addSource(sourceId, sourceConfig);
    isSourceAddedRef.current = true;
    onSourceReadyRef.current?.(map);

    return () => {
      // Hapus dependent layers dulu (Mapbox butuh urutan ini), baru source.
      const style = map.getStyle();
      if (style?.layers) {
        for (const layer of style.layers) {
          if ('source' in layer && layer.source === sourceId) {
            if (map.getLayer(layer.id)) {
              map.removeLayer(layer.id);
            }
          }
        }
      }
      if (map.getSource(sourceId)) {
        map.removeSource(sourceId);
      }
      isSourceAddedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, isReady, sourceId, cluster, clusterMaxZoom, clusterRadius]);

  // Update data via setData saat data berubah (efisien).
  useEffect(() => {
    if (!map || !isReady) return;
    if (!isSourceAddedRef.current) return;
    const source = map.getSource(sourceId) as
      | mapboxgl.GeoJSONSource
      | undefined;
    source?.setData(data as GeoJSON.FeatureCollection | string);
  }, [map, isReady, sourceId, data]);
};
