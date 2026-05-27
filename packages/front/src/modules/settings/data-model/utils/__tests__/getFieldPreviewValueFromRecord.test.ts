import { type ObjectRecord } from '@/object-record/types/ObjectRecord';

import { getTestEnrichedObjectMetadataItemsMock } from '~/testing/utils/getTestEnrichedObjectMetadataItemsMock';
import { getFieldPreviewValueFromRecord } from '@/settings/data-model/utils/getFieldPreviewValueFromRecord';
const mockedKeluargaObjectMetadataItem =
  getTestEnrichedObjectMetadataItemsMock().find(
    (item) => item.nameSingular === 'keluarga',
  );

const mockedPendudukObjectMetadataItem =
  getTestEnrichedObjectMetadataItemsMock().find(
    (item) => item.nameSingular === 'penduduk',
  );

describe('getFieldPreviewValueFromRecord', () => {
  describe('RELATION field', () => {
    it('returns the first relation record from a list of edges ("to many" relation)', () => {
      // Given
      const firstRelationRecord = {
        id: '1',
        name: { firstName: 'Siti', lastName: 'Saputra' },
      };
      const record: ObjectRecord = {
        id: '',
        people: {
          edges: [{ node: firstRelationRecord }, { node: { id: '2' } }],
        },
        __typename: 'ProgramBantuan',
      };
      const fieldMetadataItem = mockedKeluargaObjectMetadataItem?.fields.find(
        ({ name }) => name === 'people',
      );

      if (!fieldMetadataItem) {
        throw new Error('Field not found');
      }

      // When
      const result = getFieldPreviewValueFromRecord({
        record,
        fieldMetadataItem,
      });

      // Then
      expect(result).toEqual(firstRelationRecord);
    });

    it('returns the record field value ("to one" relation)', () => {
      // Given
      const relationRecord = { id: '1', name: 'Bades' };
      const record = {
        id: '',
        keluarga: relationRecord,
        __typename: 'ProgramBantuan',
      };
      const fieldMetadataItem = mockedPendudukObjectMetadataItem?.fields.find(
        ({ name }) => name === 'keluarga',
      );

      if (!fieldMetadataItem) {
        throw new Error('Field not found');
      }

      // When
      const result = getFieldPreviewValueFromRecord({
        record,
        fieldMetadataItem,
      });

      // Then
      expect(result).toEqual(relationRecord);
    });
  });

  describe('Other fields', () => {
    it('returns the record field value', () => {
      // Given
      const record = { id: '', name: 'Bades', __typename: 'Permohonan' };
      const fieldMetadataItem = mockedKeluargaObjectMetadataItem?.fields.find(
        ({ name }) => name === 'name',
      );

      if (!fieldMetadataItem) {
        throw new Error('Field not found');
      }

      // When
      const result = getFieldPreviewValueFromRecord({
        record,
        fieldMetadataItem,
      });

      // Then
      expect(result).toEqual(record.name);
    });
  });
});
