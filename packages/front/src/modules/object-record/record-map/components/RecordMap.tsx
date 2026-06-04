import type mapboxgl from 'mapbox-gl';
import { styled } from '@linaria/react';
import { useCallback, useMemo, useRef, useState } from 'react';
import { themeCssVariables } from 'ui/theme-constants';

import {
  type MapMarkerRecord,
  useRecordMapRecords,
} from '@/object-record/record-map/hooks/useRecordMapRecords';
import {
  useMapboxGeolocate,
  useMapboxMap,
  useMapboxPopup,
  useMapboxSource,
} from '@/object-record/record-map/tools/mapbox-tools.constant';
import {
  getMapboxAccessToken,
  hasValidMapboxAccessToken,
} from '@/object-record/record-map/utils/getMapboxAccessToken';

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
const DEFAULT_CENTER: [number, number] = [110.61, -7.41];
const DEFAULT_ZOOM = 13;
const STORAGE_KEY_PREFIX = 'bades-map-center-';

// Konstanta tuning UX — gampang di-adjust tanpa mengutak-atik JSX.
const MAP_PADDING_FOR_BOUNDS = 60;
const MAP_MAX_ZOOM_AFTER_FIT = 15;
const MAP_SINGLE_MARKER_ZOOM = 14;
const MAP_POPUP_OFFSET = 25;
// Throttle penulisan center ke localStorage saat user menggeser/zoom peta.
// Tanpa throttle, `moveend` fire tiap pixel dan membebani I/O browser.
const MOVE_END_THROTTLE_MS = 500;

// Konstanta clustering — threshold zoom untuk cluster break, radius
// interaksi cluster dalam pixel.
const CLUSTER_MAX_ZOOM = 14;
const CLUSTER_RADIUS = 50;
const CLUSTER_COLOR = themeCssVariables.color.blue;
const CLUSTER_TEXT_COLOR = themeCssVariables.font.color.inverted;

// Nama layer Mapbox yang digunakan untuk clustering.
const SOURCE_ID = 'record-map-records';
const LAYER_CLUSTER_CIRCLE = 'record-map-cluster-circle';
const LAYER_CLUSTER_COUNT = 'record-map-cluster-count';
const LAYER_UNCLUSTERED_POINT = 'record-map-unclustered-point';

// Warna marker berdasarkan kategori — palet warna untuk perangkat desa
// menggunakan warna yang mudah dibedakan dan aksesibel (colorblind-friendly).
// Setiap object SID punya field SELECT berbeda (klasifikasiKeluarga,
// statusPenerimaan, status, jenisLayanan, dll).
const CATEGORY_COLORS: Record<string, string> = {
  // Klasifikasi Keluarga (KS1-4)
  KS1: themeCssVariables.color.green,
  KS2: themeCssVariables.color.orange,
  KS3: themeCssVariables.color.blue,
  KS4: themeCssVariables.color.purple,
  // Status — dipakai oleh penerimaan, bantuan, permohonan surat
  TERVERIFIKASI: themeCssVariables.color.green,
  MENUNGGU: themeCssVariables.color.orange,
  DITOLAK: themeCssVariables.color.red,
  SELESAI: themeCssVariables.color.green,
  DIPROSES: themeCssVariables.color.blue,
  // Status Program Bantuan
  PELAKSANAAN: themeCssVariables.color.green,
  PERENCANAAN: themeCssVariables.color.blue,
  // Jenis Wilayah
  DUSUN: themeCssVariables.color.green,
  RW: themeCssVariables.color.blue,
  RT: themeCssVariables.color.orange,
  // Kondisi Aset
  BAIK: themeCssVariables.color.green,
  RUSAK_RINGAN: themeCssVariables.color.orange,
  RUSAK_BERAT: themeCssVariables.color.red,
  // Umum
  AKTIF: themeCssVariables.color.green,
  TIDAK_AKTIF: themeCssVariables.color.gray,
};

// Warna default untuk kategori yang tidak dikenal
const DEFAULT_MARKER_COLOR = themeCssVariables.color.blue;

// Bangun Mapbox `match` expression untuk warna marker dari CATEGORY_COLORS.
// Single source of truth: tambah/ubah kategori hanya di satu tempat
// dan legend + layer akan otomatis ikut.
const buildCategoryColorExpression = (): mapboxgl.ExpressionSpecification => {
  const branches: (string | string[])[] = [];
  for (const [category, color] of Object.entries(CATEGORY_COLORS)) {
    branches.push(category, color);
  }
  branches.push(DEFAULT_MARKER_COLOR);
  return [
    'match',
    ['get', 'category'],
    ...branches,
  ] as mapboxgl.ExpressionSpecification;
};

const CATEGORY_COLOR_EXPRESSION = buildCategoryColorExpression();

// Styles untuk legenda peta — informasi warna kategori untuk perangkat desa
const StyledLegend = styled.div`
  background: ${themeCssVariables.font.color.inverted};
  border-radius: ${themeCssVariables.border.radius.md};
  bottom: ${themeCssVariables.spacing[8]};
  box-shadow: 0 2px 8px ${themeCssVariables.boxShadow.color};
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
  border: 1px solid ${themeCssVariables.border.color.light};
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
      label: marker.category
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (c: string) => c.toUpperCase()),
      color: colors[marker.category] ?? defaultColor,
    });
  }

  return items;
};

// Style untuk search box overlay — search by nama record untuk filter
// marker di peta. Bades tidak butuh geocoder Mapbox (memerlukan token
// berbayar untuk fitur production) — cukup filter in-memory sederhana.
const StyledSearchBar = styled.div`
  background: ${themeCssVariables.font.color.inverted};
  border-radius: ${themeCssVariables.border.radius.md};
  box-shadow: 0 2px 8px ${themeCssVariables.boxShadow.color};
  left: ${themeCssVariables.spacing[2]};
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};
  position: absolute;
  top: ${themeCssVariables.spacing[2]};
  width: 280px;
  z-index: 2;
`;

const StyledSearchInput = styled.input`
  background: ${themeCssVariables.background.secondary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.sm};
  padding: ${themeCssVariables.spacing[1]} ${themeCssVariables.spacing[2]};
  width: 100%;

  &:focus {
    border-color: ${themeCssVariables.color.blue};
    outline: none;
  }
`;

const StyledSearchResultCount = styled.div`
  color: ${themeCssVariables.font.color.secondary};
  font-size: 11px;
  margin-top: ${themeCssVariables.spacing[1]};
`;

export const RecordMap = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  // Baca token saat render supaya test jsdom yang mock module
  // `getMapboxAccessToken` tidak crash.
  const [hasToken] = useState(() => hasValidMapboxAccessToken());
  // Search filter — in-memory sederhana, tidak menambah dependency
  // eksternal. Match case-insensitive terhadap nama record.
  const [searchQuery, setSearchQuery] = useState('');

  const {
    mapMarkers,
    loading,
    addressFieldMetadataItem,
    categoryFieldMetadataItem,
    objectNameSingular,
  } = useRecordMapRecords();

  // Filter marker berdasarkan search query (case-insensitive substring).
  // Empty query → tampilkan semua. Kosongkan hasil 0 untuk konsistensi
  // dengan empty state existing.
  const filteredMarkers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (query.length === 0) return mapMarkers;
    return mapMarkers.filter((marker) =>
      marker.name.toLowerCase().includes(query),
    );
  }, [mapMarkers, searchQuery]);

  // Konversi marker ke GeoJSON FeatureCollection untuk Mapbox source.
  // properties.category dipakai untuk data-driven styling warna marker,
  // properties.searchName dipakai untuk highlight saat ada search aktif.
  const geoJsonData = useMemo(
    (): GeoJSON.FeatureCollection => ({
      type: 'FeatureCollection',
      features: filteredMarkers.map(({ id, name, lat, lng, category }) => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [lng, lat] },
        properties: { id, name, category: category ?? '' },
      })),
    }),
    [filteredMarkers],
  );

  // Kumpulkan item legenda dari marker yang memiliki kategori
  const legendItems = useMemo(
    () => getLegendItems(mapMarkers, CATEGORY_COLORS, DEFAULT_MARKER_COLOR),
    [mapMarkers],
  );

  // Persisted center/zoom per object — simpan preferensi view user.
  const getStoredCenter = useCallback((): [number, number] => {
    if (!objectNameSingular) return DEFAULT_CENTER;
    try {
      const stored = localStorage.getItem(getStorageKey(objectNameSingular));
      if (stored) {
        const parsed = JSON.parse(stored);
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
        localStorage.setItem(
          getStorageKey(objectNameSingular),
          JSON.stringify({
            center: [center.lng, center.lat] as [number, number],
          }),
        );
      } catch {
        // localStorage full atau unavailable — ignore
      }
    },
    [objectNameSingular],
  );

  // Hook tools — lifecycle map, source data, popup, geolocate.
  const { map, isReady } = useMapboxMap({
    containerRef: mapContainerRef,
    accessToken: getMapboxAccessToken(),
    style: 'mapbox://styles/mapbox/light-v11',
    center: getStoredCenter(),
    zoom: DEFAULT_ZOOM,
    moveEndThrottleMs: MOVE_END_THROTTLE_MS,
    onLoad: (mapInstance) => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const mapboxglModule = require('mapbox-gl') as typeof mapboxgl;
      mapInstance.addControl(
        new mapboxglModule.NavigationControl(),
        'bottom-right',
      );
    },
    onMoveEnd: storeCurrentCenter,
  });

  useMapboxSource({
    map,
    isReady,
    sourceId: SOURCE_ID,
    data: geoJsonData,
    cluster: true,
    clusterMaxZoom: CLUSTER_MAX_ZOOM,
    clusterRadius: CLUSTER_RADIUS,
    onSourceReady: (mapInstance) => {
      // Layer lingkaran cluster — ukuran proporsional berdasarkan jumlah titik.
      mapInstance.addLayer({
        id: LAYER_CLUSTER_CIRCLE,
        type: 'circle',
        source: SOURCE_ID,
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': CLUSTER_COLOR,
          'circle-opacity': 0.3,
          'circle-radius': ['step', ['get', 'point_count'], 20, 10, 30, 50, 40],
          'circle-stroke-color': CLUSTER_COLOR,
          'circle-stroke-width': 2,
          'circle-stroke-opacity': 0.6,
        },
      });

      // Layer teks jumlah titik di tengah cluster.
      mapInstance.addLayer({
        id: LAYER_CLUSTER_COUNT,
        type: 'symbol',
        source: SOURCE_ID,
        filter: ['has', 'point_count'],
        layout: {
          'text-field': ['get', 'point_count_abbreviated'],
          'text-font': ['Open Sans Bold', 'Noto Sans Bold'],
          'text-size': 12,
        },
        paint: {
          'text-color': CLUSTER_TEXT_COLOR,
          'text-halo-color': CLUSTER_COLOR,
          'text-halo-width': 1,
        },
      });

      // Layer titik individu dengan data-driven styling via
      // CATEGORY_COLOR_EXPRESSION (single source of truth dari
      // CATEGORY_COLORS).
      mapInstance.addLayer({
        id: LAYER_UNCLUSTERED_POINT,
        type: 'circle',
        source: SOURCE_ID,
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': [
            'case',
            ['has', 'category'],
            CATEGORY_COLOR_EXPRESSION,
            DEFAULT_MARKER_COLOR,
          ],
          'circle-radius': 7,
          'circle-stroke-color': 'white',
          'circle-stroke-width': 2,
          'circle-opacity': 0.9,
        },
      });

      // Fit bounds ke data yang baru dimuat.
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const mapboxglModule = require('mapbox-gl') as typeof mapboxgl;
      const LngLatBounds = mapboxglModule.LngLatBounds;
      const bounds = new LngLatBounds();
      geoJsonData.features.forEach((feature) => {
        const coords = (feature.geometry as GeoJSON.Point).coordinates;
        bounds.extend(coords as [number, number]);
      });

      if (geoJsonData.features.length > 1) {
        mapInstance.fitBounds(bounds, {
          padding: MAP_PADDING_FOR_BOUNDS,
          maxZoom: MAP_MAX_ZOOM_AFTER_FIT,
        });
      } else if (geoJsonData.features.length === 1) {
        const coords = (geoJsonData.features[0].geometry as GeoJSON.Point)
          .coordinates;
        mapInstance.flyTo({
          center: coords as [number, number],
          zoom: MAP_SINGLE_MARKER_ZOOM,
        });
      }

      // Pasang click handler: cluster → zoom in, titik → popup.
      attachClickHandlers(mapInstance);
    },
  });

  useMapboxGeolocate({ map, position: 'top-right' });

  const { showPopup } = useMapboxPopup({ map, offset: MAP_POPUP_OFFSET });

  // Pasang event handler cluster + point click ke peta.
  // Dipisah dari `onSourceReady` agar tidak terjadi double-attach.
  const attachClickHandlers = useCallback(
    (mapInstance: mapboxgl.Map) => {
      const handleClusterClick = (e: mapboxgl.MapMouseEvent) => {
        const features = mapInstance.queryRenderedFeatures(e.point, {
          layers: [LAYER_CLUSTER_CIRCLE],
        });
        if (!features.length) return;
        const clusterId = features[0].properties?.cluster_id;
        const source = mapInstance.getSource(SOURCE_ID) as
          | mapboxgl.GeoJSONSource
          | undefined;
        if (!source) return;
        source.getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err || zoom === undefined || zoom === null) return;
          const geometry = features[0].geometry as GeoJSON.Point;
          mapInstance.easeTo({
            center: geometry.coordinates as [number, number],
            zoom: zoom + 1,
          });
        });
      };

      const handlePointClick = (e: mapboxgl.MapMouseEvent) => {
        const features = mapInstance.queryRenderedFeatures(e.point, {
          layers: [LAYER_UNCLUSTERED_POINT],
        });
        if (!features.length) return;
        const props = features[0].properties;
        const name = (props?.name as string | undefined) ?? '';
        const category = props?.category as string | undefined;
        const geometry = features[0].geometry as GeoJSON.Point;

        // Format label kategori: ganti underscore dengan spasi dan kapitalisasi.
        const categoryHtml = category
          ? `<div style="font-size:11px;color:gray;margin-top:2px;">${category
              .replace(/_/g, ' ')
              .replace(/\b\w/g, (c: string) => c.toUpperCase())}</div>`
          : '';

        showPopup(
          geometry.coordinates as [number, number],
          `<div style="padding:2px 0;">
            <div style="font-size:13px;font-weight:600;">${name}</div>
            ${categoryHtml}
          </div>`,
        );
      };

      const handleMouseEnter = () => {
        mapInstance.getCanvas().style.cursor = 'pointer';
      };
      const handleMouseLeave = () => {
        mapInstance.getCanvas().style.cursor = '';
      };

      mapInstance.on('click', LAYER_CLUSTER_CIRCLE, handleClusterClick);
      mapInstance.on('click', LAYER_UNCLUSTERED_POINT, handlePointClick);
      mapInstance.on('mouseenter', LAYER_CLUSTER_CIRCLE, handleMouseEnter);
      mapInstance.on('mouseleave', LAYER_CLUSTER_CIRCLE, handleMouseLeave);
      mapInstance.on('mouseenter', LAYER_UNCLUSTERED_POINT, handleMouseEnter);
      mapInstance.on('mouseleave', LAYER_UNCLUSTERED_POINT, handleMouseLeave);
    },
    [showPopup],
  );

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

  return (
    <StyledMapContainer>
      <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} />
      {mapMarkers.length > 0 && (
        <StyledSearchBar>
          <StyledSearchInput
            type="search"
            placeholder="Cari nama KK atau penduduk..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Cari record di peta"
          />
          {searchQuery.trim().length > 0 && (
            <StyledSearchResultCount>
              {filteredMarkers.length} dari {mapMarkers.length} record
            </StyledSearchResultCount>
          )}
        </StyledSearchBar>
      )}
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
