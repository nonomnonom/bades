import { styled } from '@linaria/react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import { themeCssVariables } from 'ui/theme-constants';

import { useRecordMapRecords } from '@/object-record/record-map/hooks/useRecordMapRecords';

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
  border: 3px solid ${themeCssVariables.color.blue}20;
  border-top-color: ${themeCssVariables.color.blue};
  border-radius: 50%;
  height: 28px;
  width: 28px;
  animation: spin 0.8s linear infinite;
`;

const StyledLoadingText = styled.span`
  color: ${themeCssVariables.font.color.secondary};
  font-size: 13px;
`;

const MAPBOX_TOKEN = import.meta.env.REACT_APP_MAPBOX_ACCESS_TOKEN ?? '';

const DEFAULT_CENTER: [number, number] = [106.8456, -6.2088]; // Jakarta
const DEFAULT_ZOOM = 10;
const STORAGE_KEY_PREFIX = 'bades-map-center-';

const getStorageKey = (objectNameSingular: string) =>
  `${STORAGE_KEY_PREFIX}${objectNameSingular}`;

const DEFAULT_MAP_STORAGE = {
  center: DEFAULT_CENTER,
  zoom: DEFAULT_ZOOM,
};

export const RecordMap = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<mapboxgl.Map | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [hasToken] = useState(() => MAPBOX_TOKEN.length > 0);

  const { mapMarkers, loading, addressFieldMetadataItem, objectNameSingular } =
    useRecordMapRecords();

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

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const storedCenter = getStoredCenter();

    const map = new mapboxgl.Map({
      center: storedCenter,
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/outdoors-v12',
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

  // Update markers when records or map state change
  useEffect(() => {
    const map = mapInstance;
    if (!map || !isMapReady) return;

    const markers: mapboxgl.Marker[] = [];

    if (mapMarkers.length === 0) {
      return;
    }

    const bounds = new mapboxgl.LngLatBounds();

    mapMarkers.forEach(({ name, lat, lng }) => {
      const el = document.createElement('div');
      el.className = 'record-map-marker';
      el.style.cssText = [
        `background: ${themeCssVariables.color.blue}`,
        `border: 2px solid ${themeCssVariables.font.color.inverted}`,
        'border-radius: 50%',
        'cursor: pointer',
        'height: 14px',
        'width: 14px',
        `box-shadow: 0 2px 4px ${themeCssVariables.color.blue}80`,
        'transition: transform 0.2s',
      ].join(';');
      el.title = name;

      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.5)';
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1)';
      });

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
        `<div style="font-size:13px;font-weight:600;padding:4px 0;">${name}</div>`,
      );

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(map);

      markers.push(marker);
      bounds.extend([lng, lat]);
    });

    // Fit map to show all markers
    if (mapMarkers.length > 1) {
      map.fitBounds(bounds, { padding: 60, maxZoom: 15 });
    } else if (mapMarkers.length === 1) {
      map.flyTo({ center: [mapMarkers[0].lng, mapMarkers[0].lat], zoom: 14 });
    }

    return () => {
      markers.forEach((marker) => marker.remove());
    };
  }, [mapMarkers, mapInstance, isMapReady]);

  if (!hasToken) {
    return (
      <StyledEmptyState>
        <StyledEmptyTitle>Tidak ada token Mapbox</StyledEmptyTitle>
        <StyledEmptyDescription>
          Atur <code>REACT_APP_MAPBOX_ACCESS_TOKEN</code> di environment variable
          untuk mengaktifkan tampilan peta.
        </StyledEmptyDescription>
      </StyledEmptyState>
    );
  }

  if (!loading && !addressFieldMetadataItem) {
    return (
      <StyledEmptyState>
        <StyledEmptyTitle>Tidak ada kolom alamat</StyledEmptyTitle>
        <StyledEmptyDescription>
          Object ini belum memiliki kolom bertipe Alamat. Tambahkan field
          Alamat untuk melihat data di peta.
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
      {loading && (
        <StyledLoadingOverlay>
          <StyledLoadingSpinner />
          <StyledLoadingText>Memuat peta...</StyledLoadingText>
        </StyledLoadingOverlay>
      )}
    </StyledMapContainer>
  );
};
