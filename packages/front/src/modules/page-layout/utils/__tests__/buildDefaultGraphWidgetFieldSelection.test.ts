import { type EnrichedObjectMetadataItem } from '@/object-metadata/types/EnrichedObjectMetadataItem';
import { buildDefaultGraphWidgetFieldSelection } from '@/page-layout/utils/buildDefaultGraphWidgetFieldSelection';
import { FieldMetadataType } from '~/generated-metadata/graphql';

const createObjectMetadataItem = (
  fields: EnrichedObjectMetadataItem['fields'],
): EnrichedObjectMetadataItem =>
  ({
    id: 'object-penduduk',
    nameSingular: 'penduduk',
    labelPlural: 'Penduduk',
    fields,
  }) as EnrichedObjectMetadataItem;

describe('buildDefaultGraphWidgetFieldSelection', () => {
  it('memilih field angka untuk agregat dan field select untuk group by', () => {
    const fieldSelection = buildDefaultGraphWidgetFieldSelection(
      createObjectMetadataItem([
        {
          id: 'field-status',
          name: 'status',
          label: 'Status',
          type: FieldMetadataType.SELECT,
          isActive: true,
          isSystem: false,
        },
        {
          id: 'field-jumlah',
          name: 'jumlah',
          label: 'Jumlah',
          type: FieldMetadataType.NUMBER,
          isActive: true,
          isSystem: false,
        },
      ] as EnrichedObjectMetadataItem['fields']),
    );

    expect(fieldSelection).toEqual({
      objectMetadataId: 'object-penduduk',
      aggregateFieldMetadataId: 'field-jumlah',
      groupByFieldMetadataIdX: 'field-status',
    });
  });

  it('mengembalikan objectMetadataId meski tidak ada field yang cocok', () => {
    const fieldSelection = buildDefaultGraphWidgetFieldSelection(
      createObjectMetadataItem([]),
    );

    expect(fieldSelection).toEqual({
      objectMetadataId: 'object-penduduk',
      aggregateFieldMetadataId: undefined,
      groupByFieldMetadataIdX: undefined,
    });
  });
});
