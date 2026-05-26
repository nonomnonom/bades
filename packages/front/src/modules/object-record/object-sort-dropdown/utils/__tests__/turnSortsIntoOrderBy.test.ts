import { type FieldMetadataItem } from '@/object-metadata/types/FieldMetadataItem';
import { type EnrichedObjectMetadataItem } from '@/object-metadata/types/EnrichedObjectMetadataItem';
import { type RecordGqlOperationOrderBy } from 'shared/types';
import { turnSortsIntoOrderBy } from '@/object-record/object-sort-dropdown/utils/turnSortsIntoOrderBy';
import { type RecordSort } from '@/object-record/record-sort/types/RecordSort';
import { type EachTestingContext } from 'shared/testing';
import {
  FieldMetadataType,
  RelationType,
  ViewSortDirection,
} from '~/generated-metadata/graphql';

const fields = [
  {
    name: 'name',
    updatedAt: '2021-01-01',
    createdAt: '2021-01-01',
    id: '20202020-18b3-4099-86e3-c46b2d5d42f2',
    universalIdentifier: '20202020-18b3-4099-86e3-c46b2d5d42f2',
    type: FieldMetadataType.POSITION,
    label: 'label',
  },
];

const objectMetadataItemWithPositionField: EnrichedObjectMetadataItem = {
  id: 'object1',
  universalIdentifier: 'object1',
  fields,
  readableFields: fields,
  updatableFields: fields,
  indexMetadatas: [],
  createdAt: '2021-01-01',
  updatedAt: '2021-01-01',
  nameSingular: 'object1',
  namePlural: 'object1s',
  labelIdentifierFieldMetadataId: '20202020-72ba-4e11-a36d-e17b544541e1',
  icon: 'icon',
  isActive: true,
  isSystem: false,
  isUIReadOnly: false,
  isCustom: false,
  isRemote: false,
  isSearchable: false,
  labelPlural: 'object1s',
  labelSingular: 'object1',
  isLabelSyncedWithName: true,
};

type PartialFieldMetadaItemWithRequiredId = Pick<FieldMetadataItem, 'id'> &
  Partial<Omit<FieldMetadataItem, 'id'>>;
const getMockFieldMetadataItem = (
  overrides: PartialFieldMetadaItemWithRequiredId,
): FieldMetadataItem => ({
  name: 'name',
  universalIdentifier: overrides.id,
  updatedAt: '2021-01-01',
  createdAt: '2021-01-01',
  type: FieldMetadataType.TEXT,
  label: 'label',
  ...overrides,
});

type TurnSortsIntoOrderTestContext = EachTestingContext<{
  fields: PartialFieldMetadaItemWithRequiredId[];
  expected: RecordGqlOperationOrderBy;
  sort: RecordSort[];
  objectMetadataItemOverrides?: Partial<
    Omit<EnrichedObjectMetadataItem, 'fields'>
  >;
}>;

const turnSortsIntoOrderByTestUseCases: TurnSortsIntoOrderTestContext[] = [
  {
    title: 'It should sort by recordPosition if no sorts',
    context: {
      fields: [{ id: 'field1', name: 'field1' }],
      sort: [],
      expected: [
        {
          position: 'AscNullsFirst',
        },
      ],
    },
  },
  {
    title: 'It should create OrderByField with single sort',
    context: {
      fields: [{ id: 'field1', name: 'field1' }],
      sort: [
        {
          id: 'id',
          fieldMetadataId: 'field1',
          direction: ViewSortDirection.ASC,
        },
      ],
      expected: [{ field1: 'AscNullsFirst' }, { position: 'AscNullsFirst' }],
    },
  },
  {
    title: 'It should create OrderByField with multiple sorts',
    context: {
      fields: [
        { id: 'field1', name: 'field1' },
        { id: 'field2', name: 'field2' },
      ],
      sort: [
        {
          id: 'id',
          fieldMetadataId: 'field1',
          direction: ViewSortDirection.ASC,
        },
        {
          id: 'id',
          fieldMetadataId: 'field2',
          direction: ViewSortDirection.DESC,
        },
      ],
      expected: [
        { field1: 'AscNullsFirst' },
        { field2: 'DescNullsLast' },
        { position: 'AscNullsFirst' },
      ],
    },
  },
  {
    title: 'It should ignore if field not found',
    context: {
      fields: [],
      sort: [
        {
          id: 'id',
          fieldMetadataId: 'invalidField',
          direction: ViewSortDirection.ASC,
        },
      ],
      expected: [{ position: 'AscNullsFirst' }],
    },
  },
  {
    title: 'It should not return position for remotes',
    context: {
      fields: [],
      sort: [
        {
          id: 'id',
          fieldMetadataId: 'invalidField',
          direction: ViewSortDirection.ASC,
        },
      ],
      expected: [],
      objectMetadataItemOverrides: {
        isRemote: true,
      },
    },
  },
];

describe('turnSortsIntoOrderBy', () => {
  it.each<TurnSortsIntoOrderTestContext>(turnSortsIntoOrderByTestUseCases)(
    '.$title',
    ({ context: { fields, sort, expected, objectMetadataItemOverrides } }) => {
      const newFields = fields.map(getMockFieldMetadataItem);
      const objectMetadataItemWithNewFields = {
        ...objectMetadataItemWithPositionField,
        ...objectMetadataItemOverrides,
        fields: [...objectMetadataItemWithPositionField.fields, ...newFields],
      };

      expect(
        turnSortsIntoOrderBy(objectMetadataItemWithNewFields, sort),
      ).toEqual(expected);
    },
  );

  describe('relation field sorting', () => {
    const companyObjectMetadataItem: EnrichedObjectMetadataItem = {
      id: 'keluarga-object-id',
      universalIdentifier: 'keluarga-object-id',
      fields: [
        {
          id: 'keluarga-name-field-id',
          universalIdentifier: 'keluarga-name-field-id',
          name: 'name',
          type: FieldMetadataType.TEXT,
          label: 'Name',
          createdAt: '2021-01-01',
          updatedAt: '2021-01-01',
          isActive: true,
        } as FieldMetadataItem,
      ],
      readableFields: [],
      updatableFields: [],
      indexMetadatas: [],
      createdAt: '2021-01-01',
      updatedAt: '2021-01-01',
      nameSingular: 'keluarga',
      namePlural: 'daftarKeluarga',
      labelIdentifierFieldMetadataId: 'keluarga-name-field-id',
      icon: 'IconBuildingSkyscraper',
      isActive: true,
      isSystem: false,
      isUIReadOnly: false,
      isCustom: false,
      isRemote: false,
      isSearchable: false,
      labelPlural: 'Keluarga',
      labelSingular: 'Keluarga',
      isLabelSyncedWithName: true,
    };

    const personObjectMetadataItem: EnrichedObjectMetadataItem = {
      id: 'penduduk-object-id',
      universalIdentifier: 'penduduk-object-id',
      fields: [
        {
          id: 'keluarga-relation-field-id',
          universalIdentifier: 'keluarga-relation-field-id',
          name: 'keluarga',
          type: FieldMetadataType.RELATION,
          label: 'Keluarga',
          createdAt: '2021-01-01',
          updatedAt: '2021-01-01',
          isActive: true,
          relation: {
            type: RelationType.MANY_TO_ONE,
            targetObjectMetadata: {
              nameSingular: 'keluarga',
            },
          },
        } as unknown as FieldMetadataItem,
        {
          id: 'position-field-id',
          universalIdentifier: 'position-field-id',
          name: 'position',
          type: FieldMetadataType.POSITION,
          label: 'Position',
          createdAt: '2021-01-01',
          updatedAt: '2021-01-01',
        } as FieldMetadataItem,
      ],
      readableFields: [],
      updatableFields: [],
      indexMetadatas: [],
      createdAt: '2021-01-01',
      updatedAt: '2021-01-01',
      nameSingular: 'penduduk',
      namePlural: 'daftarPenduduk',
      labelIdentifierFieldMetadataId: 'penduduk-name-field-id',
      icon: 'IconUser',
      isActive: true,
      isSystem: false,
      isUIReadOnly: false,
      isCustom: false,
      isRemote: false,
      isSearchable: false,
      labelPlural: 'Penduduk',
      labelSingular: 'Penduduk',
      isLabelSyncedWithName: true,
    };

    it('should sort by relation field using label identifier', () => {
      const sorts: RecordSort[] = [
        {
          id: 'sort-1',
          fieldMetadataId: 'keluarga-relation-field-id',
          direction: ViewSortDirection.ASC,
        },
      ];

      const result = turnSortsIntoOrderBy(personObjectMetadataItem, sorts, [
        companyObjectMetadataItem,
      ]);

      // Should produce nested structure for GraphQL: { keluarga: { name: 'AscNullsFirst' } }
      expect(result).toEqual([
        { keluarga: { name: 'AscNullsFirst' } },
        { position: 'AscNullsFirst' },
      ]);
    });

    it('should sort by relation field descending', () => {
      const sorts: RecordSort[] = [
        {
          id: 'sort-1',
          fieldMetadataId: 'keluarga-relation-field-id',
          direction: ViewSortDirection.DESC,
        },
      ];

      const result = turnSortsIntoOrderBy(personObjectMetadataItem, sorts, [
        companyObjectMetadataItem,
      ]);

      // Should produce nested structure for GraphQL: { keluarga: { name: 'DescNullsLast' } }
      expect(result).toEqual([
        { keluarga: { name: 'DescNullsLast' } },
        { position: 'AscNullsFirst' },
      ]);
    });

    it('should fallback to FK when related object not found', () => {
      const sorts: RecordSort[] = [
        {
          id: 'sort-1',
          fieldMetadataId: 'keluarga-relation-field-id',
          direction: ViewSortDirection.ASC,
        },
      ];

      // Pass empty objectMetadataItems array - related object not found
      const result = turnSortsIntoOrderBy(personObjectMetadataItem, sorts, []);

      expect(result).toEqual([
        { keluargaId: 'AscNullsFirst' },
        { position: 'AscNullsFirst' },
      ]);
    });
  });
});
