import { type EnrichedObjectMetadataItem } from '@/object-metadata/types/EnrichedObjectMetadataItem';

import { mockedPendudukRecords } from '~/testing/mock-data/generated/data/penduduk/mock-penduduk-data';
import { getTestEnrichedObjectMetadataItemsMock } from '~/testing/utils/getTestEnrichedObjectMetadataItemsMock';
import { getRecordNodeFromRecord } from '@/object-record/cache/utils/getRecordNodeFromRecord';
import { mockedKeluargaRecords } from '~/testing/mock-data/generated/data/keluarga/mock-keluarga-data';

describe('getRecordNodeFromRecord', () => {
  it('computes relation records cache references by default', () => {
    // Given
    const objectMetadataItems: EnrichedObjectMetadataItem[] =
      getTestEnrichedObjectMetadataItemsMock();
    const objectMetadataItem:
      | Pick<
          EnrichedObjectMetadataItem,
          'fields' | 'namePlural' | 'nameSingular'
        >
      | undefined = getTestEnrichedObjectMetadataItemsMock().find(
      (item) => item.nameSingular === 'penduduk',
    );

    if (!objectMetadataItem) {
      throw new Error('Object metadata item not found');
    }

    const keluarga = mockedKeluargaRecords[0];
    const record = {
      ...mockedPendudukRecords[0],
      name: { firstName: 'Budi', lastName: 'Kusuma' },
      keluarga,
      keluargaId: keluarga.id,
    };

    const recordGqlFields = {
      name: true,
      keluarga: true,
    };

    // When
    const result = getRecordNodeFromRecord({
      objectMetadataItems,
      objectMetadataItem,
      recordGqlFields,
      record,
    });

    // Then
    expect(result).toEqual({
      __typename: 'Penduduk',
      keluarga: {
        __ref: `Keluarga:${keluarga.id}`,
      },
      name: {
        __typename: 'FullName',
        firstName: record.name.firstName,
        lastName: record.name.lastName,
      },
    });
  });

  it('does not compute relation records cache references when `computeReferences` is false', () => {
    // Given
    const objectMetadataItems: EnrichedObjectMetadataItem[] =
      getTestEnrichedObjectMetadataItemsMock();
    const objectMetadataItem:
      | Pick<
          EnrichedObjectMetadataItem,
          'fields' | 'namePlural' | 'nameSingular'
        >
      | undefined = getTestEnrichedObjectMetadataItemsMock().find(
      (item) => item.nameSingular === 'penduduk',
    );

    if (!objectMetadataItem) {
      throw new Error('Object metadata item not found');
    }

    const keluarga = mockedKeluargaRecords[0];
    const record = {
      ...mockedPendudukRecords[0],
      name: { firstName: 'Budi', lastName: 'Kusuma' },
      keluarga,
      keluargaId: keluarga.id,
    };

    const recordGqlFields = {
      name: true,
      keluarga: true,
    };
    const computeReferences = false;

    // When
    const result = getRecordNodeFromRecord({
      objectMetadataItems,
      objectMetadataItem,
      recordGqlFields,
      record,
      computeReferences,
    });

    // Then
    expect(result).toEqual({
      __typename: 'Penduduk',
      keluarga: record.keluarga,
      name: {
        __typename: 'FullName',
        firstName: record.name.firstName,
        lastName: record.name.lastName,
      },
    });
  });
});
