import type mapboxgl from 'mapbox-gl';
import { styled } from '@linaria/react';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { themeCssVariables } from 'ui/theme-constants';

import {
  type MapMarkerRecord,
  MAP_RECORD_LIMIT,
  useRecordMapRecords,
} from '@/object-record/record-map/hooks/useRecordMapRecords';
import { MAPBOX_CLUSTER_TEXT_FONT } from '@/object-record/record-map/constants/recordMapboxStyle.constant';
import { useMapboxStandardStyle } from '@/object-record/record-map/hooks/useMapboxStandardStyle';
import { useOpenRecordFromIndexView } from '@/object-record/record-index/hooks/useOpenRecordFromIndexView';
import {
  useMapboxGeolocate,
  useMapboxMap,
  useMapboxPopup,
  useMapboxSource,
} from '@/object-record/record-map/tools/mapbox-tools.constant';
import { useMapboxAccessToken } from '@/object-record/record-map/hooks/useMapboxAccessToken';
import { loadMapboxGl } from '@/object-record/record-map/tools/loadMapboxGl';
import {
  isMapUsable,
  safeGetMapSource,
} from '@/object-record/record-map/utils/isMapStyleLoaded';
import { MAPBOX_MAP_COLORS } from '@/object-record/record-map/constants/recordMapboxMapColors.constant';
import { MAPBOX_CATEGORY_COLORS } from '@/object-record/record-map/constants/recordMapboxCategoryColors.constant';
import { isDefined } from 'shared/utils';

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
const CLUSTER_COLOR = MAPBOX_MAP_COLORS.cluster;
const CLUSTER_TEXT_COLOR = MAPBOX_MAP_COLORS.clusterText;

// Nama layer Mapbox yang digunakan untuk clustering.
const SOURCE_ID = 'record-map-records';
const LAYER_CLUSTER_CIRCLE = 'record-map-cluster-circle';
const LAYER_CLUSTER_COUNT = 'record-map-cluster-count';
const LAYER_UNCLUSTERED_POINT = 'record-map-unclustered-point';

const CATEGORY_COLORS = MAPBOX_CATEGORY_COLORS;

// Warna default untuk kategori yang tidak dikenal
const DEFAULT_MARKER_COLOR = MAPBOX_MAP_COLORS.defaultMarker;

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

const StyledLimitBanner = styled.div`
  background: ${themeCssVariables.background.secondary};
  border-bottom: 1px solid ${themeCssVariables.border.color.light};
  color: ${themeCssVariables.font.color.secondary};
  font-size: ${themeCssVariables.font.size.sm};
  left: 0;
  padding: ${themeCssVariables.spacing[2]} ${themeCssVariables.spacing[3]};
  position: absolute;
  right: 0;
  top: 0;
  z-index: 2;
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

const fitMapToGeoJsonData = (
  mapInstance: mapboxgl.Map,
  geoJsonData: GeoJSON.FeatureCollection,
) => {
  if (geoJsonData.features.length === 0) {
    return;
  }

  void loadMapboxGl().then((mapboxglModule) => {
    if (!isMapUsable(mapInstance)) {
      return;
    }

    if (geoJsonData.features.length > 1) {
      const bounds = new mapboxglModule.LngLatBounds();
      geoJsonData.features.forEach((feature: GeoJSON.Feature) => {
        const coords = (feature.geometry as GeoJSON.Point).coordinates;
        bounds.extend(coords as [number, number]);
      });
      mapInstance.fitBounds(bounds, {
        padding: MAP_PADDING_FOR_BOUNDS,
        maxZoom: MAP_MAX_ZOOM_AFTER_FIT,
      });
      return;
    }

    const coords = (geoJsonData.features[0].geometry as GeoJSON.Point)
      .coordinates;
    mapInstance.flyTo({
      center: coords as [number, number],
      zoom: MAP_SINGLE_MARKER_ZOOM,
    });
  });
};

type RecordMapCanvasProps = {
  mapboxStyle: string;
  accessToken: string;
  geoJsonData: GeoJSON.FeatureCollection;
  legendItems: { label: string; color: string }[];
  categoryLegendLabel: string | undefined;
  loading: boolean;
  showLimitBanner: boolean;
  totalCount: number | undefined;
  objectNameSingular: string | undefined;
  getStoredCenter: () => [number, number];
};

const RecordMapCanvas = ({
  mapboxStyle,
  accessToken,
  geoJsonData,
  legendItems,
  categoryLegendLabel,
  loading,
  showLimitBanner,
  totalCount,
  objectNameSingular,
  getStoredCenter,
}: RecordMapCanvasProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const { openRecordFromIndexView } = useOpenRecordFromIndexView();

  // oxlint-disable-next-line bades/no-state-useref
  const hoveredFeatureIdRef = useRef<string | number | null>(null);

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

  const { map, isReady } = useMapboxMap({
    containerRef: mapContainerRef,
    accessToken,
    style: mapboxStyle,
    center: getStoredCenter(),
    zoom: DEFAULT_ZOOM,
    moveEndThrottleMs: MOVE_END_THROTTLE_MS,
    onLoad: (mapInstance) => {
      void loadMapboxGl().then((mapboxglModule) => {
        if (!isMapUsable(mapInstance)) return;
        mapInstance.addControl(
          new mapboxglModule.NavigationControl(),
          'bottom-right',
        );
      });
    },
    onMoveEnd: storeCurrentCenter,
  });

  const { showTextPopup, closePopup } = useMapboxPopup({
    map,
    offset: MAP_POPUP_OFFSET,
  });

  const attachClickHandlers = useCallback(
    (mapInstance: mapboxgl.Map) => {
      const handleClusterClick = (e: mapboxgl.MapMouseEvent) => {
        const features = mapInstance.queryRenderedFeatures(e.point, {
          layers: [LAYER_CLUSTER_CIRCLE],
        });
        if (!features.length) return;
        const clusterId = features[0].properties?.cluster_id;
        const source = safeGetMapSource(mapInstance, SOURCE_ID) as
          | mapboxgl.GeoJSONSource
          | undefined;
        if (!source) return;
        source.getClusterExpansionZoom(
          clusterId,
          (err: Error | null | undefined, zoom: number | null | undefined) => {
            if (err || zoom === undefined || zoom === null) return;
            const geometry = features[0].geometry as GeoJSON.Point;
            mapInstance.easeTo({
              center: geometry.coordinates as [number, number],
              zoom: zoom + 1,
            });
          },
        );
      };

      const handlePointClick = (e: mapboxgl.MapMouseEvent) => {
        const features = mapInstance.queryRenderedFeatures(e.point, {
          layers: [LAYER_UNCLUSTERED_POINT],
        });
        if (!features.length) return;
        const props = features[0].properties;
        const recordId = props?.id as string | undefined;
        if (!recordId) return;
        closePopup();
        openRecordFromIndexView({ recordId });
      };

      const handleClusterMouseEnter = () => {
        mapInstance.getCanvas().style.cursor = 'pointer';
      };
      const handleClusterMouseLeave = () => {
        mapInstance.getCanvas().style.cursor = '';
      };

      const handlePointMouseEnter = (e: mapboxgl.MapMouseEvent) => {
        mapInstance.getCanvas().style.cursor = 'pointer';
        const feature = e.features?.[0];
        const featureId = feature?.id;
        if (featureId !== undefined && featureId !== null) {
          mapInstance.setFeatureState(
            { source: SOURCE_ID, id: featureId },
            { hover: true },
          );
          hoveredFeatureIdRef.current = featureId;
        }

        const props = feature?.properties;
        const name = (props?.name as string | undefined) ?? '';
        const category = props?.category as string | undefined;
        const geometry = feature?.geometry as GeoJSON.Point | undefined;
        if (geometry && name.length > 0) {
          const subtitle = category
            ? category
                .replace(/_/g, ' ')
                .replace(/\b\w/g, (character: string) =>
                  character.toUpperCase(),
                )
            : undefined;
          showTextPopup(geometry.coordinates as [number, number], {
            title: name,
            subtitle,
          });
        }
      };

      const handlePointMouseLeave = () => {
        mapInstance.getCanvas().style.cursor = '';
        closePopup();
        if (hoveredFeatureIdRef.current !== null) {
          mapInstance.setFeatureState(
            { source: SOURCE_ID, id: hoveredFeatureIdRef.current },
            { hover: false },
          );
          hoveredFeatureIdRef.current = null;
        }
      };

      mapInstance.on('click', LAYER_CLUSTER_CIRCLE, handleClusterClick);
      mapInstance.on('click', LAYER_UNCLUSTERED_POINT, handlePointClick);
      mapInstance.on(
        'mouseenter',
        LAYER_CLUSTER_CIRCLE,
        handleClusterMouseEnter,
      );
      mapInstance.on(
        'mouseleave',
        LAYER_CLUSTER_CIRCLE,
        handleClusterMouseLeave,
      );
      mapInstance.on(
        'mouseenter',
        LAYER_UNCLUSTERED_POINT,
        handlePointMouseEnter,
      );
      mapInstance.on(
        'mouseleave',
        LAYER_UNCLUSTERED_POINT,
        handlePointMouseLeave,
      );
    },
    [closePopup, openRecordFromIndexView, showTextPopup],
  );

  useMapboxSource({
    map,
    isReady,
    sourceId: SOURCE_ID,
    data: geoJsonData,
    cluster: true,
    clusterMaxZoom: CLUSTER_MAX_ZOOM,
    clusterRadius: CLUSTER_RADIUS,
    onSourceReady: (mapInstance) => {
      mapInstance.addLayer({
        id: LAYER_CLUSTER_CIRCLE,
        type: 'circle',
        source: SOURCE_ID,
        filter: ['has', 'point_count'],
        maxzoom: CLUSTER_MAX_ZOOM,
        paint: {
          'circle-color': CLUSTER_COLOR,
          'circle-opacity': 0.3,
          'circle-radius': ['step', ['get', 'point_count'], 20, 10, 30, 50, 40],
          'circle-stroke-color': CLUSTER_COLOR,
          'circle-stroke-width': 2,
          'circle-stroke-opacity': 0.6,
        },
      });

      mapInstance.addLayer({
        id: LAYER_CLUSTER_COUNT,
        type: 'symbol',
        source: SOURCE_ID,
        filter: ['has', 'point_count'],
        maxzoom: CLUSTER_MAX_ZOOM,
        layout: {
          'text-field': ['get', 'point_count_abbreviated'],
          'text-font': [...MAPBOX_CLUSTER_TEXT_FONT],
          'text-size': 12,
        },
        paint: {
          'text-color': CLUSTER_TEXT_COLOR,
          'text-halo-color': CLUSTER_COLOR,
          'text-halo-width': 1,
        },
      });

      mapInstance.addLayer({
        id: LAYER_UNCLUSTERED_POINT,
        type: 'circle',
        source: SOURCE_ID,
        filter: ['!', ['has', 'point_count']],
        minzoom: CLUSTER_MAX_ZOOM - 1,
        paint: {
          'circle-color': [
            'case',
            ['has', 'category'],
            CATEGORY_COLOR_EXPRESSION,
            DEFAULT_MARKER_COLOR,
          ],
          'circle-radius': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            11,
            7,
          ],
          'circle-stroke-color': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            'white',
            'white',
          ],
          'circle-stroke-width': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            3,
            2,
          ],
          'circle-opacity': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            1,
            0.9,
          ],
        },
      });

      fitMapToGeoJsonData(mapInstance, geoJsonData);
      attachClickHandlers(mapInstance);
    },
  });

  useEffect(() => {
    if (
      !map ||
      !isReady ||
      !isMapUsable(map) ||
      geoJsonData.features.length === 0
    ) {
      return;
    }
    fitMapToGeoJsonData(map, geoJsonData);
  }, [map, isReady, geoJsonData]);

  useMapboxGeolocate({ map, position: 'top-right' });

  return (
    <StyledMapContainer>
      <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} />
      {showLimitBanner && (
        <StyledLimitBanner>
          Menampilkan {MAP_RECORD_LIMIT.toLocaleString('id-ID')} dari{' '}
          {totalCount?.toLocaleString('id-ID')} record. Persempit filter untuk
          melihat semua.
        </StyledLimitBanner>
      )}
      {loading && (
        <StyledLoadingOverlay>
          <StyledLoadingSpinner />
          <StyledLoadingText>Memuat peta...</StyledLoadingText>
        </StyledLoadingOverlay>
      )}
      {legendItems.length > 0 && (
        <StyledLegend>
          <StyledLegendTitle>
            {categoryLegendLabel ?? 'Kategori'}
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

export const RecordMap = () => {
  const mapboxStyle = useMapboxStandardStyle();
  const { accessToken, hasValidAccessToken, isClientConfigLoaded } =
    useMapboxAccessToken();

  const {
    mapMarkers,
    loading,
    totalCount,
    addressFieldMetadataItem,
    categoryFieldMetadataItem,
    objectNameSingular,
  } = useRecordMapRecords();

  const geoJsonData = useMemo(
    (): GeoJSON.FeatureCollection => ({
      type: 'FeatureCollection',
      features: mapMarkers.map(({ id, name, lat, lng, category }) => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [lng, lat] },
        id,
        properties: { id, name, category: category ?? '' },
      })),
    }),
    [mapMarkers],
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

  const showLimitBanner =
    isDefined(totalCount) && totalCount > MAP_RECORD_LIMIT;

  if (!isClientConfigLoaded) {
    return (
      <StyledMapContainer>
        <StyledLoadingOverlay>
          <StyledLoadingSpinner />
          <span>Memuat konfigurasi peta…</span>
        </StyledLoadingOverlay>
      </StyledMapContainer>
    );
  }

  if (!hasValidAccessToken) {
    return (
      <StyledEmptyState>
        <StyledEmptyTitle>Tidak ada token Mapbox</StyledEmptyTitle>
        <StyledEmptyDescription>
          Atur <code>MAPBOX_ACCESS_TOKEN</code> di konfigurasi server
          (environment variable) untuk mengaktifkan tampilan peta.
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
    const hasFilteredRecordsWithoutCoords =
      isDefined(totalCount) && totalCount > 0;

    return (
      <StyledEmptyState>
        <StyledEmptyTitle>
          {hasFilteredRecordsWithoutCoords
            ? 'Tidak ada lokasi untuk filter ini'
            : 'Tidak ada data lokasi'}
        </StyledEmptyTitle>
        <StyledEmptyDescription>
          {hasFilteredRecordsWithoutCoords
            ? 'Record yang cocok dengan filter belum memiliki koordinat valid. Periksa kolom alamat atau persempit filter.'
            : 'Data yang ada belum memiliki koordinat lokasi. Isi alamat dengan lengkap untuk melihatnya di peta.'}
        </StyledEmptyDescription>
      </StyledEmptyState>
    );
  }

  return (
    <RecordMapCanvas
      key={mapboxStyle}
      mapboxStyle={mapboxStyle}
      accessToken={accessToken}
      geoJsonData={geoJsonData}
      legendItems={legendItems}
      categoryLegendLabel={categoryFieldMetadataItem?.label}
      loading={loading}
      showLimitBanner={showLimitBanner}
      totalCount={totalCount}
      objectNameSingular={objectNameSingular}
      getStoredCenter={getStoredCenter}
    />
  );
};
