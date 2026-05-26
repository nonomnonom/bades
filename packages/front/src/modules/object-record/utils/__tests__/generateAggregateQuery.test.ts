import { type EnrichedObjectMetadataItem } from '@/object-metadata/types/EnrichedObjectMetadataItem';
import { generateAggregateQuery } from '@/object-record/utils/generateAggregateQuery';

describe('generateAggregateQuery', () => {
  it('should generate correct aggregate query', () => {
    const mockObjectMetadataItem: EnrichedObjectMetadataItem = {
      nameSingular: 'keluarga',
      namePlural: 'daftarKeluarga',
      id: 'test-id',
      universalIdentifier: 'test-id',
      labelSingular: 'Keluarga',
      labelPlural: 'Keluarga',
      labelIdentifierFieldMetadataId: '20202020-72ba-4e11-a36d-e17b544541e1',
      isCustom: false,
      isActive: true,
      isSearchable: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      fields: [],
      readableFields: [],
      updatableFields: [],
      indexMetadatas: [],
      isLabelSyncedWithName: true,
      isRemote: false,
      isSystem: false,
      isUIReadOnly: false,
    };

    const mockRecordGqlFields = {
      id: true,
      name: true,
      address: false,
      createdAt: true,
    };

    const result = generateAggregateQuery({
      objectMetadataItem: mockObjectMetadataItem,
      recordGqlFields: mockRecordGqlFields,
    });

    const normalizedQuery = result.loc?.source.body.replace(/\s+/g, ' ').trim();

    expect(normalizedQuery).toBe(
      'query AggregateDaftarKeluarga($filter: KeluargaFilterInput) { daftarKeluarga(filter: $filter) { id name createdAt } }',
    );
  });

  it('should handle empty record fields', () => {
    const mockObjectMetadataItem: EnrichedObjectMetadataItem = {
      nameSingular: 'penduduk',
      namePlural: 'daftarPenduduk',
      id: 'test-id',
      universalIdentifier: 'test-id',
      labelSingular: 'Penduduk',
      labelPlural: 'Penduduk',
      labelIdentifierFieldMetadataId: '20202020-72ba-4e11-a36d-e17b544541e1',
      isCustom: false,
      isActive: true,
      isSearchable: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      fields: [],
      readableFields: [],
      updatableFields: [],
      indexMetadatas: [],
      isLabelSyncedWithName: true,
      isRemote: false,
      isSystem: false,
      isUIReadOnly: false,
    };

    const mockRecordGqlFields = {
      id: true,
    };

    const result = generateAggregateQuery({
      objectMetadataItem: mockObjectMetadataItem,
      recordGqlFields: mockRecordGqlFields,
    });

    const normalizedQuery = result.loc?.source.body.replace(/\s+/g, ' ').trim();

    expect(normalizedQuery).toBe(
      'query AggregateDaftarPenduduk($filter: PendudukFilterInput) { daftarPenduduk(filter: $filter) { id } }',
    );
  });
});
