import { styled } from '@linaria/react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { themeCssVariables } from 'ui/theme-constants';

import { type MapMarkerRecord, useRecordMapRecords } from '@/object-record/record-map/hooks/useRecordMapRecords';
import { getMapboxAccessToken } from '@/object-record/record-map/utils/getMapboxAccessToken';

const StyledMapContainer = styled.div`
  height: 100%;
  position: relative;
  width: 100%;
`;

const StyledEmptyState = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[2]};
  height: 100%;
  justify-content: center;
  padding: ${themeCssVariables.spacing[4]};
  text-align: center;
`;

const StyledEmptyTitle = styled.h3`
  color: ${themeCssVariables.font.color.primary};
  font-size: 16px;
  font-weight: 600;
  margin: 0;
`;

const StyledEmptyDescription = styled.p`
  color: ${themeCssVariables.font.color.secondary};
  font-size: 13px;
  margin: 0;
  max-width: 300px;
`;

const StyledLoadingOverlay = styled.div`
  align-items: center;
  background: ${themeCssVariables.font.color.inverted}cc;
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[2]};
  height: 100%;
  justify-content: center;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 1;
`;

const StyledLoadingSpinner = styled.div`
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  animation: spin 0.8s linear infinite;
  border: 3px solid ${themeCssVariables.color.blue}20;
  border-radius: 50%;
  border-top-color: ${themeCssVariables.color.blue};
  height: 28px;
  width: 28px;
`;

const StyledLoadingText = styled.span`
  color: ${themeCssVariables.font.color.secondary};
  font-size: 13px;
`;

// Pusat desa Sukamaju (Jawa Tengah) sebagai default center agar marker
// pertama kali buka tidak zoom ke Jakarta yang menyesatkan. Backend MAP
// view biasanya punya record alamat di sekitar koordinat ini.
const DEFAULT_CENTER: [number, number] = [110.6100, -7.4100];
const DEFAULT_ZOOM = 13;
const STORAGE_KEY_PREFIX = 'bades-map-center-';

// Konstanta tuning UX — gampang di-adjust tanpa mengutak-atik JSX.
const MAP_PADDING_FOR_BOUNDS = 60;
const MAP_MAX_ZOOM_AFTER_FIT = 15;
const MAP_SINGLE_MARKER_ZOOM = 14;
const MAP_POPUP_OFFSET = 25;

// Konstanta clustering — threshold zoom untuk cluster break, radius
// interaksi cluster dalam pixel.
const CLUSTER_MAX_ZOOM = 14;
const CLUSTER_RADIUS = 50;
const CLUSTER_COLOR = themeCssVariables.color.blue;

// Nama layer Mapbox yang digunakan untuk clustering.
const SOURCE_ID = 'record-map-records';
const LAYER_CLUSTER_CIRCLE = 'record-map-cluster-circle';
const LAYER_CLUSTER_COUNT = 'record-map-cluster-count';
const LAYER_UNCLUSTERED_POINT = 'record-map-unclustered-point';

// Styles untuk legenda peta — informasi warna kategori untuk perangkat desa
const StyledLegend = styled.div`
  background: ${themeCssVariables.font.color.inverted};
  border-radius: ${themeCssVariables.border.radius.md};
  bottom: ${themeCssVariables.spacing[8]};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  left: ${themeCssVariables.spacing[2]};
  max-height: 200px;
  overflow-y: auto;
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};
  position: absolute;
  z-index: 2;
`;

const StyledLegendTitle = styled.div`
  color: ${themeCssVariables.font.color.primary};
  font-size: 11px;
  font-weight: 600;
  margin-bottom: ${themeCssVariables.spacing[1]};
  text-transform: uppercase;
`;

const StyledLegendItem = styled.div`
  align-items: center;
  display: flex;
  gap: ${themeCssVariables.spacing[1]};
  padding: 2px 0;
`;

const StyledLegendColor = styled.div<{ $color: string }>`
  background: ${({ $color }) => $color};
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  flex-shrink: 0;
  height: 10px;
  width: 10px;
`;

const StyledLegendLabel = styled.span`
  color: ${themeCssVariables.font.color.secondary};
  font-size: 11px;
  line-height: 1.3;
`;

const getStorageKey = (objectNameSingular: string) =>
  `${STORAGE_KEY_PREFIX}${objectNameSingular}`;

// Ambil daftar kategori unik dari marker yang ada, beserta warnanya.
// Digunakan oleh komponen legenda untuk menampilkan keterangan warna.
const getLegendItems = (
  markers: MapMarkerRecord[],
  colors: Record<string, string>,
  defaultColor: string,
): { label: string; color: string }[] => {
  const seen = new Set<string>();
  const items: { label: string; color: string }[] = [];

  for (const marker of markers) {
    if (!marker.category || seen.has(marker.category)) continue;
    seen.add(marker.category);
    items.push({
      label: marker.category.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
      color: colors[marker.category] ?? defaultColor,
    });
  }

  return items;
};

export const RecordMap = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<mapboxgl.Map | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  // Baca token saat render supaya test jsdom yang mock module
  // `getMapboxAccessToken` tidak crash.
  const [hasToken] = useState(() => getMapboxAccessToken().length > 0);

  const {
    mapMarkers,
    loading,
    addressFieldMetadataItem,
    categoryFieldMetadataItem,
    objectNameSingular,
  } = useRecordMapRecords();

  // Warna marker berdasarkan kategori — palet warna untuk perangkat desa
  // menggunakan warna yang mudah dibedakan dan aksesibel (colorblind-friendly).
  // Setiap object SID punya field SELECT berbeda (klasifikasiKeluarga,
  // statusPenerimaan, status, jenisLayanan, dll).
  const CATEGORY_COLORS: Record<string, string> = {
    // Klasifikasi Keluarga (KS1-4)
    'KS1': '#4CAF50',
    'KS2': '#FF9800',
    'KS3': '#2196F3',
    'KS4': '#9C27B0',
    // Status — dipakai oleh penerimaan, bantuan, permohonan surat
    'TERVERIFIKASI': '#4CAF50',
    'MENUNGGU': '#FF9800',
    'DITOLAK': '#F44336',
    'SELESAI': '#4CAF50',
    'DIPROSES': '#2196F3',
    // Status Program Bantuan
    'PELAKSANAAN': '#4CAF50',
    'PERENCANAAN': '#2196F3',
    // Jenis Wilayah
    'DUSUN': '#4CAF50',
    'RW': '#2196F3',
    'RT': '#FF9800',
    // Kondisi Aset
    'BAIK': '#4CAF50',
    'RUSAK_RINGAN': '#FF9800',
    'RUSAK_BERAT': '#F44336',
    // Umum
    'AKTIF': '#4CAF50',
    'TIDAK_AKTIF': '#9E9E9E',
  };

  // Warna default untuk kategori yang tidak dikenal
  const DEFAULT_MARKER_COLOR = themeCssVariables.color.blue;

  // Konversi marker ke GeoJSON FeatureCollection untuk Mapbox source.
  // properties.category dipakai untuk data-driven styling warna marker.
  const geoJsonData = useMemo((): GeoJSON.FeatureCollection => ({
    type: 'FeatureCollection',
    features: mapMarkers.map(({ id, name, lat, lng, category }) => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [lng, lat] },
      properties: { id, name, category: category ?? '' },
    })),
  }), [mapMarkers]);

  const getStoredCenter = useCallback((): [number, number] => {
    if (!objectNameSingular) return DEFAULT_CENTER;
    try {
      const stored = localStorage.getItem(getStorageKey(objectNameSingular));
      if (stored) {
        const parsed = JSON.parse(stored);
        // Validate: harus array dengan 2 number
        if (
          Array.isArray(parsed.center) &&
          parsed.center.length === 2 &&
          typeof parsed.center[0] === 'number' &&
          typeof parsed.center[1] === 'number'
        ) {
          return parsed.center as [number, number];
        }
      }
    } catch {
      // localStorage corrupted — ignore, use default
    }
    return DEFAULT_CENTER;
  }, [objectNameSingular]);

  const storeCurrentCenter = useCallback(
    (map: mapboxgl.Map) => {
      if (!objectNameSingular) return;
      try {
        const center = map.getCenter();
        const zoom = map.getZoom();
        localStorage.setItem(
          getStorageKey(objectNameSingular),
          JSON.stringify({
            center: [center.lng, center.lat] as [number, number],
            zoom,
          }),
        );
      } catch {
        // localStorage full atau unavailable — ignore
      }
    },
    [objectNameSingular],
  );

  // Initialize map
  useEffect(() => {
    if (!hasToken || !mapContainerRef.current) return;

    mapboxgl.accessToken = getMapboxAccessToken();

    const storedCenter = getStoredCenter();

    // Gunakan light-v11 sebagai base style: minimalis, latar putih bersih,
    // optimal untuk overlay data marker. Tidak menggunakan outdoors-v12
    // karena warna hijaunya mengganggu visibility marker biru.
    const map = new mapboxgl.Map({
      center: storedCenter,
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/light-v11',
      zoom: DEFAULT_ZOOM,
    });

    map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

    map.on('load', () => {
      setIsMapReady(true);
    });

    // Simpan center setiap user selesai interact
    map.on('moveend', () => {
      storeCurrentCenter(map);
    });

    setMapInstance(map);

    return () => {
      map.remove();
      setMapInstance(null);
      setIsMapReady(false);
    };
  }, [hasToken, getStoredCenter, storeCurrentCenter]);

  // Update clustered markers via GeoJSON source + layer, bukan DOM marker.
  // Clustering dari Mapbox GL JS mengelompokkan marker yang berdekatan
  // secara otomatis, sehingga performa tetap baik meskipun ada ribuan
  // titik data (seperti dataset penduduk atau riwayat penerima bantuan).
  useEffect(() => {
    const map = mapInstance;
    if (!map || !isMapReady) return;
    if (geoJsonData.features.length === 0) return;

    // Hapus source & layer lama sebelum rebuild.
    // `removeLayer` harus dipanggil sebelum `removeSource`.
    const removeLayersAndSource = () => {
      [LAYER_CLUSTER_CIRCLE, LAYER_CLUSTER_COUNT, LAYER_UNCLUSTERED_POINT]
        .filter((id) => map.getLayer(id))
        .forEach((id) => map.removeLayer(id));
      if (map.getSource(SOURCE_ID)) {
        map.removeSource(SOURCE_ID);
      }
    };

    removeLayersAndSource();

    map.addSource(SOURCE_ID, {
      type: 'geojson',
      data: geoJsonData,
      cluster: true,
      clusterMaxZoom: CLUSTER_MAX_ZOOM,
      clusterRadius: CLUSTER_RADIUS,
    });

    // Layer lingkaran cluster — ukuran proporsional berdasarkan jumlah titik.
    map.addLayer({
      id: LAYER_CLUSTER_CIRCLE,
      type: 'circle',
      source: SOURCE_ID,
      filter: ['has', 'point_count'],
      paint: {
        'circle-color': CLUSTER_COLOR,
        'circle-opacity': 0.3,
        'circle-radius': [
          'step',
          ['get', 'point_count'],
          20,  // default radius untuk cluster kecil
          10, 30,  // >= 10 titik → radius 30
          50, 40,  // >= 50 titik → radius 40
        ],
        'circle-stroke-color': CLUSTER_COLOR,
        'circle-stroke-width': 2,
        'circle-stroke-opacity': 0.6,
      },
    });

    // Layer teks jumlah titik di tengah cluster.
    map.addLayer({
      id: LAYER_CLUSTER_COUNT,
      type: 'symbol',
      source: SOURCE_ID,
      filter: ['has', 'point_count'],
      layout: {
        'text-field': ['get', 'point_count_abbreviated'],
        'text-font': ['DIN Pro Medium', 'Arial Unicode MS Bold'],
        'text-size': 12,
      },
      paint: {
        'text-color': '#ffffff',
      },
    });

    // Layer titik individu (tidak ter-cluster) dengan data-driven styling.
    // Warna marker ditentukan oleh properti `category` di GeoJSON:
    //   - Jika category dikenal → pakai warna dari CATEGORY_COLORS
    //   - Jika category tidak dikenal atau kosong → pakai warna default biru
    // Ini memungkinkan operator desa melihat sekilas sebaran data berdasarkan
    // klasifikasi (KS1/KS2/KS3), status penerimaan, kondisi aset, dll.
    map.addLayer({
      id: LAYER_UNCLUSTERED_POINT,
      type: 'circle',
      source: SOURCE_ID,
      filter: ['!', ['has', 'point_count']],
      paint: {
        'circle-color': [
          'case',
          ['has', 'category'],
          [
            'match',
            ['get', 'category'],
            'KS1', CATEGORY_COLORS['KS1'],
            'KS2', CATEGORY_COLORS['KS2'],
            'KS3', CATEGORY_COLORS['KS3'],
            'KS4', CATEGORY_COLORS['KS4'],
            'TERVERIFIKASI', CATEGORY_COLORS['TERVERIFIKASI'],
            'MENUNGGU', CATEGORY_COLORS['MENUNGGU'],
            'DITOLAK', CATEGORY_COLORS['DITOLAK'],
            'SELESAI', CATEGORY_COLORS['SELESAI'],
            'DIPROSES', CATEGORY_COLORS['DIPROSES'],
            'PELAKSANAAN', CATEGORY_COLORS['PELAKSANAAN'],
            'PERENCANAAN', CATEGORY_COLORS['PERENCANAAN'],
            'DUSUN', CATEGORY_COLORS['DUSUN'],
            'RW', CATEGORY_COLORS['RW'],
            'RT', CATEGORY_COLORS['RT'],
            'BAIK', CATEGORY_COLORS['BAIK'],
            'RUSAK_RINGAN', CATEGORY_COLORS['RUSAK_RINGAN'],
            'RUSAK_BERAT', CATEGORY_COLORS['RUSAK_BERAT'],
            'AKTIF', CATEGORY_COLORS['AKTIF'],
            'TIDAK_AKTIF', CATEGORY_COLORS['TIDAK_AKTIF'],
            // fallback: warna default untuk kategori yang tidak dikenal
            DEFAULT_MARKER_COLOR
          ],
          DEFAULT_MARKER_COLOR,
        ],
        'circle-radius': 7,
        'circle-stroke-color': '#ffffff',
        'circle-stroke-width': 2,
        'circle-opacity': 0.9,
      },
    });

    // Fit bounds setelah data dimuat (hanya sekali).
    const bounds = new mapboxgl.LngLatBounds();
    geoJsonData.features.forEach((feature) => {
      const coords = (feature.geometry as GeoJSON.Point).coordinates;
      bounds.extend(coords as [number, number]);
    });

    if (geoJsonData.features.length > 1) {
      map.fitBounds(bounds, {
        padding: MAP_PADDING_FOR_BOUNDS,
        maxZoom: MAP_MAX_ZOOM_AFTER_FIT,
      });
    } else if (geoJsonData.features.length === 1) {
      const coords = (
        geoJsonData.features[0].geometry as GeoJSON.Point
      ).coordinates;
      map.flyTo({
        center: coords as [number, number],
        zoom: MAP_SINGLE_MARKER_ZOOM,
      });
    }

    return () => {
      removeLayersAndSource();
    };
  }, [geoJsonData, mapInstance, isMapReady]);

  // Handler klik: cluster → zoom in, titik individual → popup.
  useEffect(() => {
    const map = mapInstance;
    if (!map || !isMapReady) return;

    const handleClusterClick = (e: mapboxgl.MapMouseEvent) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: [LAYER_CLUSTER_CIRCLE],
      });
      if (!features.length) return;
      const clusterId = features[0].properties?.cluster_id;
      const source = map.getSource(SOURCE_ID) as mapboxgl.GeoJSONSource;
      source.getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err || zoom === undefined || zoom === null) return;
        const geometry = features[0].geometry as GeoJSON.Point;
        map.easeTo({
          center: geometry.coordinates as [number, number],
          zoom: zoom + 1,
        });
      });
    };

    const handlePointClick = (e: mapboxgl.MapMouseEvent) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: [LAYER_UNCLUSTERED_POINT],
      });
      if (!features.length) return;
      const props = features[0].properties;
      const name = props?.name as string;
      const category = props?.category as string | undefined;
      const geometry = features[0].geometry as GeoJSON.Point;

      // Popup dengan nama record dan kategori (jika ada).
      // Format label kategori dibersihkan dari underscore dan kapitalisasi.
      const categoryHtml = category
        ? `<div style="font-size:11px;color:#666;margin-top:2px;">${category.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}</div>`
        : '';

      new mapboxgl.Popup({ offset: MAP_POPUP_OFFSET })
        .setLngLat(geometry.coordinates as [number, number])
        .setHTML(
          `<div style="padding:2px 0;">
            <div style="font-size:13px;font-weight:600;">${name}</div>
            ${categoryHtml}
          </div>`,
        )
        .addTo(map);
    };

    const handleMouseEnter = () => {
      map.getCanvas().style.cursor = 'pointer';
    };
    const handleMouseLeave = () => {
      map.getCanvas().style.cursor = '';
    };

    map.on('click', LAYER_CLUSTER_CIRCLE, handleClusterClick);
    map.on('click', LAYER_UNCLUSTERED_POINT, handlePointClick);
    map.on('mouseenter', LAYER_CLUSTER_CIRCLE, handleMouseEnter);
    map.on('mouseleave', LAYER_CLUSTER_CIRCLE, handleMouseLeave);
    map.on('mouseenter', LAYER_UNCLUSTERED_POINT, handleMouseEnter);
    map.on('mouseleave', LAYER_UNCLUSTERED_POINT, handleMouseLeave);

    return () => {
      map.off('click', LAYER_CLUSTER_CIRCLE, handleClusterClick);
      map.off('click', LAYER_UNCLUSTERED_POINT, handlePointClick);
      map.off('mouseenter', LAYER_CLUSTER_CIRCLE, handleMouseEnter);
      map.off('mouseleave', LAYER_CLUSTER_CIRCLE, handleMouseLeave);
      map.off('mouseenter', LAYER_UNCLUSTERED_POINT, handleMouseEnter);
      map.off('mouseleave', LAYER_UNCLUSTERED_POINT, handleMouseLeave);
    };
  }, [mapInstance, isMapReady]);

  if (!hasToken) {
    return (
      <StyledEmptyState>
        <StyledEmptyTitle>Tidak ada token Mapbox</StyledEmptyTitle>
        <StyledEmptyDescription>
          Atur <code>REACT_APP_MAPBOX_ACCESS_TOKEN</code> di environment
          variable untuk mengaktifkan tampilan peta.
        </StyledEmptyDescription>
      </StyledEmptyState>
    );
  }

  if (!loading && !addressFieldMetadataItem) {
    return (
      <StyledEmptyState>
        <StyledEmptyTitle>Tidak ada kolom alamat</StyledEmptyTitle>
        <StyledEmptyDescription>
          Object ini belum memiliki kolom bertipe Alamat. Tambahkan field Alamat
          untuk melihat data di peta.
        </StyledEmptyDescription>
      </StyledEmptyState>
    );
  }

  if (!loading && mapMarkers.length === 0) {
    return (
      <StyledEmptyState>
        <StyledEmptyTitle>Tidak ada data lokasi</StyledEmptyTitle>
        <StyledEmptyDescription>
          Data yang ada belum memiliki koordinat lokasi. Isi alamat dengan
          lengkap untuk melihatnya di peta.
        </StyledEmptyDescription>
      </StyledEmptyState>
    );
  }

  // Kumpulkan item legenda dari marker yang memiliki kategori
  const legendItems = useMemo(
    () => getLegendItems(mapMarkers, CATEGORY_COLORS, DEFAULT_MARKER_COLOR),
    [mapMarkers],
  );

  return (
    <StyledMapContainer>
      <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} />
      {loading && (
        <StyledLoadingOverlay>
          <StyledLoadingSpinner />
          <StyledLoadingText>Memuat peta...</StyledLoadingText>
        </StyledLoadingOverlay>
      )}
      {mapMarkers.length > 0 && legendItems.length > 0 && (
        <StyledLegend>
          <StyledLegendTitle>
            {categoryFieldMetadataItem?.label ?? 'Kategori'}
          </StyledLegendTitle>
          {legendItems.map((item) => (
            <StyledLegendItem key={item.label}>
              <StyledLegendColor $color={item.color} />
              <StyledLegendLabel>{item.label}</StyledLegendLabel>
            </StyledLegendItem>
          ))}
        </StyledLegend>
      )}
    </StyledMapContainer>
  );
};
