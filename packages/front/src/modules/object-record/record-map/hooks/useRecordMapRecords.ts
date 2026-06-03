import { getLabelIdentifierFieldMetadataItem } from '@/object-metadata/utils/getLabelIdentifierFieldMetadataItem';
import { useFindManyRecords } from '@/object-record/hooks/useFindManyRecords';
import { useRecordMapContextOrThrow } from '@/object-record/record-map/contexts/RecordMapContext';
import { recordMapFieldMetadataIdState } from '@/object-record/record-map/states/recordMapFieldMetadataIdState';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { useMemo } from 'react';
import { isDefined } from 'shared/utils';

// Limit jumlah record yang di-fetch untuk MAP view. Dataset desa rata-rata
// memiliki 100-500 KK dan 500-2000 penduduk. Limit 3000 cukup untuk
// mayoritas desa tanpa membebani memory browser.
const MAP_RECORD_LIMIT = 3000;

export type MapMarkerRecord = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  // Kategori/klasifikasi untuk data-driven styling marker.
  // Diisi dari field SELECT pertama pada object (mis. klasifikasiKeluarga,
  // statusPenerimaan). Null jika tidak ada field SELECT yang cocok.
  category: string | null;
};

// Default: skip record dengan koordinat persis (0, 0) — disebut "Null
// Island" di tengah Samudra Atlantik. Hampir selalu placeholder error
// atau seed yang belum diisi, bukan alamat valid. Beberapa desa sangat
// langka berada di Greenwich (lng=0), dan itu pun biasanya tidak di
// Indonesia. Set ke `false` jika deployment Bades dipakai di area
// Greenwich (tidak umum untuk SID Indonesia).
const SKIP_NULL_ISLAND = true;

const isNullIsland = (lat: number, lng: number): boolean =>
  lat === 0 && lng === 0;

// Lat/lng harus berupa finite number dalam range WGS84. Filter out baris
// yang punya koordinat out-of-range (mis. seed dengan placeholder 0,0 atau
// data corrupt dari import) supaya tidak ada marker nyasar di tengah laut.
// Return sebagai tuple ketik `number | number` (atau false) supaya caller
// tidak perlu type-cast manual.
const isValidCoordinate = (
  lat: unknown,
  lng: unknown,
): { lat: number; lng: number } | null => {
  if (typeof lat !== 'number' || typeof lng !== 'number') {
    return null;
  }
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null;
  }
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return null;
  }
  if (SKIP_NULL_ISLAND && isNullIsland(lat, lng)) {
    return null;
  }

  return { lat, lng };
};

export const useRecordMapRecords = () => {
  const { objectNameSingular, objectMetadataItem } =
    useRecordMapContextOrThrow();

  const recordMapFieldMetadataId = useAtomStateValue(
    recordMapFieldMetadataIdState,
  );

  const addressFieldMetadataItem = useMemo(() => {
    if (isDefined(recordMapFieldMetadataId)) {
      return objectMetadataItem.fields.find(
        (field) => field.id === recordMapFieldMetadataId,
      );
    }
    return objectMetadataItem.fields.find(
      (field) => field.type === 'ADDRESS' && field.isActive,
    );
  }, [objectMetadataItem.fields, recordMapFieldMetadataId]);

  // Cari field SELECT/OPTION pertama pada object sebagai sumber kategori
  // untuk data-driven styling marker. Contoh: `klasifikasiKeluarga` pada
  // object keluarga, `statusPenerimaan` pada penerima-bantuan. Fallback
  // ke null jika tidak ada — marker akan pakai warna default.
  const categoryFieldMetadataItem = useMemo(() => {
    return (
      objectMetadataItem.fields.find(
        (field) =>
          field.type === 'SELECT' &&
          field.isActive &&
          field.name !== 'id' &&
          field.name !== 'position',
      ) ?? null
    );
  }, [objectMetadataItem.fields]);

  const { records, loading } = useFindManyRecords({
    objectNameSingular,
    skip: !isDefined(addressFieldMetadataItem),
    // Batasi jumlah record yang di-fetch agar tidak membebani memory
    // browser saat dataset besar (ribuan records). Mapbox clustering
    // menangani visualisasi marker >3000 dengan performa baik.
    limit: MAP_RECORD_LIMIT,
  });

  const labelIdentifierFieldName = useMemo(() => {
    const labelField = getLabelIdentifierFieldMetadataItem(objectMetadataItem);
    return labelField?.name ?? 'id';
  }, [objectMetadataItem]);

  const mapMarkers: MapMarkerRecord[] = useMemo(() => {
    if (!isDefined(addressFieldMetadataItem)) {
      return [];
    }

    const fieldName = addressFieldMetadataItem.name;
    const categoryFieldName = categoryFieldMetadataItem?.name ?? null;

    return records
      .map((record: Record<string, unknown>) => {
        const addressValue = record[fieldName] as Record<
          string,
          unknown
        > | null;
        if (!isDefined(addressValue)) {
          return null;
        }

        const lat = addressValue.addressLat;
        const lng = addressValue.addressLng;

        const validCoords = isValidCoordinate(lat, lng);

        if (!validCoords) {
          return null;
        }

        const name = (record[labelIdentifierFieldName] as string) ?? record.id;

        // Baca nilai kategori untuk data-driven styling. Category value
        // diambil dari field SELECT (mis. 'KS1', 'TERVERIFIKASI', dll.)
        const category =
          categoryFieldName !== null
            ? ((record[categoryFieldName] as string | null) ?? null)
            : null;

        return {
          id: record.id as string,
          name,
          lat: validCoords.lat,
          lng: validCoords.lng,
          category,
        } satisfies MapMarkerRecord;
      })
      .filter(isDefined);
  }, [
    records,
    addressFieldMetadataItem,
    labelIdentifierFieldName,
    categoryFieldMetadataItem,
  ]);

  return {
    mapMarkers,
    loading,
    addressFieldMetadataItem,
    categoryFieldMetadataItem,
    objectNameSingular,
  };
};
