import { type EnrichedObjectMetadataItem } from '@/object-metadata/types/EnrichedObjectMetadataItem';

import { mockedPendudukRecords } from '~/testing/mock-data/generated/data/penduduk/mock-penduduk-data';
import { getTestEnrichedObjectMetadataItemsMock } from '~/testing/utils/getTestEnrichedObjectMetadataItemsMock';
import { getRecordNodeFromRecord } from '@/object-record/cache/utils/getRecordNodeFromRecord';

const peopleMock = [...mockedPendudukRecords];

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

    const recordGqlFields = {
      namaLengkap: true,
      kartuKeluarga: true,
    };
    const record = peopleMock[0];

    // When
    const result = getRecordNodeFromRecord({
      objectMetadataItems,
      objectMetadataItem,
      recordGqlFields,
      record,
    });

    // Then
    expect(result).toEqual({
      __typename: 'Person',
      kartuKeluarga: {
        __ref: `Keluarga:${record.kartuKeluarga.id}`,
      },
      namaLengkap: {
        __typename: 'FullName',
        firstName: record.namaLengkap.firstName,
        lastName: record.namaLengkap.lastName,
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

    const recordGqlFields = {
      namaLengkap: true,
      kartuKeluarga: true,
    };
    const record = peopleMock[0];
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
      __typename: 'Person',
      kartuKeluarga: record.kartuKeluarga,
      namaLengkap: {
        __typename: 'FullName',
        firstName: record.namaLengkap.firstName,
        lastName: record.namaLengkap.lastName,
      },
    });
  });
});
