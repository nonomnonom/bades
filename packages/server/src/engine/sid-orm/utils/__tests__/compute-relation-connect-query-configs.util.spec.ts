import { FieldMetadataType } from 'shared/types';

import { RelationType } from 'src/engine/metadata-modules/field-metadata/interfaces/relation-type.interface';

import { type FlatEntityMaps } from 'src/engine/metadata-modules/flat-entity/types/flat-entity-maps.type';
import { type FlatFieldMetadata } from 'src/engine/metadata-modules/flat-field-metadata/types/flat-field-metadata.type';
import { type FlatIndexMetadata } from 'src/engine/metadata-modules/flat-index-metadata/types/flat-index-metadata.type';
import { type FlatObjectMetadata } from 'src/engine/metadata-modules/flat-object-metadata/types/flat-object-metadata.type';
import { computeRelationConnectQueryConfigs } from 'src/engine/sid-orm/utils/compute-relation-connect-query-configs.util';

describe('computeRelationConnectQueryConfigs', () => {
  const personFields: FlatFieldMetadata[] = [
    {
      id: 'penduduk-id-field-id',
      name: 'id',
      type: FieldMetadataType.UUID,
      label: 'id',
      objectMetadataId: 'penduduk-object-metadata-id',
      isNullable: false,
      isLabelSyncedWithName: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      universalIdentifier: 'penduduk-id-field-id',
      viewFieldIds: [],
      viewFilterIds: [],
      kanbanAggregateOperationViewIds: [],
      calendarViewIds: [],
      applicationId: null,
    } as unknown as FlatFieldMetadata,
    {
      id: 'penduduk-name-field-id',
      name: 'name',
      type: FieldMetadataType.FULL_NAME,
      label: 'name',
      objectMetadataId: 'penduduk-object-metadata-id',
      isNullable: true,
      isLabelSyncedWithName: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      universalIdentifier: 'penduduk-name-field-id',
      viewFieldIds: [],
      viewFilterIds: [],
      kanbanAggregateOperationViewIds: [],
      calendarViewIds: [],
      applicationId: null,
    } as unknown as FlatFieldMetadata,
    {
      id: 'penduduk-keluarga-1-field-id',
      name: 'keluarga-related-to-1',
      type: FieldMetadataType.RELATION,
      label: 'keluarga-related-to-1',
      objectMetadataId: 'penduduk-object-metadata-id',
      isNullable: true,
      isLabelSyncedWithName: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      universalIdentifier: 'penduduk-keluarga-1-field-id',
      viewFieldIds: [],
      viewFilterIds: [],
      kanbanAggregateOperationViewIds: [],
      calendarViewIds: [],
      applicationId: null,
      relationTargetObjectMetadataId: 'keluarga-object-metadata-id',
      relationTargetFieldMetadataId: 'keluarga-id-field-id',
      settings: {
        relationType: RelationType.MANY_TO_ONE,
        joinColumnName: 'keluarga-related-to-1Id',
      },
    } as unknown as FlatFieldMetadata,
    {
      id: 'penduduk-keluarga-2-field-id',
      name: 'keluarga-related-to-2',
      type: FieldMetadataType.RELATION,
      label: 'keluarga-related-to-2',
      objectMetadataId: 'penduduk-object-metadata-id',
      isNullable: true,
      isLabelSyncedWithName: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      universalIdentifier: 'penduduk-keluarga-2-field-id',
      viewFieldIds: [],
      viewFilterIds: [],
      kanbanAggregateOperationViewIds: [],
      calendarViewIds: [],
      applicationId: null,
      relationTargetObjectMetadataId: 'keluarga-object-metadata-id',
      relationTargetFieldMetadataId: 'keluarga-id-field-id',
      settings: {
        relationType: RelationType.MANY_TO_ONE,
        joinColumnName: 'keluarga-related-to-2Id',
      },
    } as unknown as FlatFieldMetadata,
  ];

  const companyFields: FlatFieldMetadata[] = [
    {
      id: 'keluarga-id-field-id',
      name: 'id',
      type: FieldMetadataType.UUID,
      label: 'id',
      objectMetadataId: 'keluarga-object-metadata-id',
      isNullable: false,
      isLabelSyncedWithName: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      universalIdentifier: 'keluarga-id-field-id',
      viewFieldIds: [],
      viewFilterIds: [],
      kanbanAggregateOperationViewIds: [],
      calendarViewIds: [],
      applicationId: null,
    } as unknown as FlatFieldMetadata,
    {
      id: 'keluarga-name-field-id',
      name: 'name',
      type: FieldMetadataType.TEXT,
      label: 'name',
      objectMetadataId: 'keluarga-object-metadata-id',
      isNullable: true,
      isLabelSyncedWithName: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      universalIdentifier: 'keluarga-name-field-id',
      viewFieldIds: [],
      viewFilterIds: [],
      kanbanAggregateOperationViewIds: [],
      calendarViewIds: [],
      applicationId: null,
    } as unknown as FlatFieldMetadata,
    {
      id: 'keluarga-description-field-id',
      name: 'description',
      type: FieldMetadataType.TEXT,
      label: 'description',
      objectMetadataId: 'keluarga-object-metadata-id',
      isNullable: true,
      isLabelSyncedWithName: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      universalIdentifier: 'keluarga-description-field-id',
      viewFieldIds: [],
      viewFilterIds: [],
      kanbanAggregateOperationViewIds: [],
      calendarViewIds: [],
      applicationId: null,
    } as unknown as FlatFieldMetadata,
    {
      id: 'keluarga-domain-name-field-id',
      name: 'domainName',
      type: FieldMetadataType.LINKS,
      label: 'domainName',
      objectMetadataId: 'keluarga-object-metadata-id',
      isNullable: true,
      isLabelSyncedWithName: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      universalIdentifier: 'keluarga-domain-name-field-id',
      viewFieldIds: [],
      viewFilterIds: [],
      kanbanAggregateOperationViewIds: [],
      calendarViewIds: [],
      applicationId: null,
    } as unknown as FlatFieldMetadata,
    {
      id: 'keluarga-address-field-id',
      name: 'address',
      type: FieldMetadataType.TEXT,
      label: 'address',
      objectMetadataId: 'keluarga-object-metadata-id',
      isNullable: true,
      isLabelSyncedWithName: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      universalIdentifier: 'keluarga-address-field-id',
      viewFieldIds: [],
      viewFilterIds: [],
      kanbanAggregateOperationViewIds: [],
      calendarViewIds: [],
      applicationId: null,
    } as unknown as FlatFieldMetadata,
  ];

  const allFields = [...personFields, ...companyFields];

  const flatFieldMetadataMaps: FlatEntityMaps<FlatFieldMetadata> = {
    byUniversalIdentifier: allFields.reduce(
      (acc, field) => {
        acc[field.universalIdentifier] = field;

        return acc;
      },
      {} as Record<string, FlatFieldMetadata>,
    ),
    universalIdentifierById: allFields.reduce(
      (acc, field) => {
        acc[field.id] = field.universalIdentifier;

        return acc;
      },
      {} as Record<string, string>,
    ),
    universalIdentifiersByApplicationId: {},
  };

  const createFlatObjectMetadata = (
    partial: Partial<FlatObjectMetadata> & {
      id: string;
      nameSingular: string;
      fieldIds: string[];
      indexMetadataIds: string[];
    },
  ): FlatObjectMetadata =>
    ({
      namePlural: `${partial.nameSingular}s`,
      labelSingular: partial.nameSingular,
      labelPlural: `${partial.nameSingular}s`,
      icon: 'Icon',
      targetTableName: partial.nameSingular,
      workspaceId: 'workspace-id',
      isCustom: false,
      isRemote: false,
      isActive: true,
      isSystem: false,
      isAuditLogged: true,
      isSearchable: true,
      universalIdentifier: partial.id,
      objectPermissionIds: [],
      fieldPermissionIds: [],
      viewIds: [],
      applicationId: null,
      isLabelSyncedWithName: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      shortcut: null,
      description: null,
      standardOverrides: null,
      isUIReadOnly: false,
      labelIdentifierFieldMetadataId: null,
      imageIdentifierFieldMetadataId: null,
      duplicateCriteria: null,
      applicationUniversalIdentifier: '',
      fieldUniversalIdentifiers: [],
      objectPermissionUniversalIdentifiers: [],
      viewUniversalIdentifiers: [],
      indexMetadataUniversalIdentifiers: [],
      labelIdentifierFieldMetadataUniversalIdentifier: null,
      imageIdentifierFieldMetadataUniversalIdentifier: null,
      ...partial,
    }) as FlatObjectMetadata;

  const personMetadata = createFlatObjectMetadata({
    id: 'penduduk-object-metadata-id',
    nameSingular: 'penduduk',
    indexMetadataIds: [],
    fieldIds: personFields.map((f) => f.id),
  });

  const companyMetadata = createFlatObjectMetadata({
    id: 'keluarga-object-metadata-id',
    nameSingular: 'keluarga',
    indexMetadataIds: [
      'keluarga-id-index-metadata-id',
      'keluarga-domain-index-metadata-id',
      'keluarga-composite-index-metadata-id',
    ],
    fieldIds: companyFields.map((f) => f.id),
  });

  const flatObjectMetadataMaps: FlatEntityMaps<FlatObjectMetadata> = {
    byUniversalIdentifier: {
      'penduduk-object-metadata-id': personMetadata,
      'keluarga-object-metadata-id': companyMetadata,
    },
    universalIdentifierById: {
      'penduduk-object-metadata-id': 'penduduk-object-metadata-id',
      'keluarga-object-metadata-id': 'keluarga-object-metadata-id',
    },
    universalIdentifiersByApplicationId: {},
  };

  const createFlatIndexFieldMetadata = (
    id: string,
    fieldMetadataId: string,
    indexMetadataId: string,
    order: number,
  ) => ({
    id,
    fieldMetadataId,
    indexMetadataId,
    order,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const flatIndexMaps: FlatEntityMaps<FlatIndexMetadata> = {
    byUniversalIdentifier: {
      'keluarga-id-index-metadata-id': {
        id: 'keluarga-id-index-metadata-id',
        name: 'keluarga-id-index-metadata-name',
        isUnique: true,
        objectMetadataId: 'keluarga-object-metadata-id',
        universalIdentifier: 'keluarga-id-index-metadata-id',
        flatIndexFieldMetadatas: [
          createFlatIndexFieldMetadata(
            'keluarga-id-index-field-metadata-id',
            'keluarga-id-field-id',
            'keluarga-id-index-metadata-id',
            0,
          ),
        ],
      } as unknown as FlatIndexMetadata,
      'keluarga-domain-index-metadata-id': {
        id: 'keluarga-domain-index-metadata-id',
        name: 'keluarga-domain-index-metadata-name',
        isUnique: true,
        objectMetadataId: 'keluarga-object-metadata-id',
        universalIdentifier: 'keluarga-domain-index-metadata-id',
        flatIndexFieldMetadatas: [
          createFlatIndexFieldMetadata(
            'keluarga-domain-index-field-metadata-id',
            'keluarga-domain-name-field-id',
            'keluarga-domain-index-metadata-id',
            0,
          ),
        ],
      } as unknown as FlatIndexMetadata,
      'keluarga-composite-index-metadata-id': {
        id: 'keluarga-composite-index-metadata-id',
        name: 'keluarga-composite-index-metadata-name',
        isUnique: true,
        objectMetadataId: 'keluarga-object-metadata-id',
        universalIdentifier: 'keluarga-composite-index-metadata-id',
        flatIndexFieldMetadatas: [
          createFlatIndexFieldMetadata(
            'keluarga-name-index-field-metadata-id',
            'keluarga-name-field-id',
            'keluarga-composite-index-metadata-id',
            0,
          ),
          createFlatIndexFieldMetadata(
            'keluarga-description-index-field-metadata-id',
            'keluarga-description-field-id',
            'keluarga-composite-index-metadata-id',
            1,
          ),
        ],
      } as unknown as FlatIndexMetadata,
    },
    universalIdentifierById: {
      'keluarga-id-index-metadata-id': 'keluarga-id-index-metadata-id',
      'keluarga-domain-index-metadata-id': 'keluarga-domain-index-metadata-id',
      'keluarga-composite-index-metadata-id':
        'keluarga-composite-index-metadata-id',
    },
    universalIdentifiersByApplicationId: {},
  };

  it('should return an empty object if no connect fields are found', () => {
    const peopleEntityInputs = [
      {
        id: '1',
        name: { lastName: 'Saputra', firstName: 'Budi' },
      },
      {
        id: '2',
        name: { lastName: 'Saputra', firstName: 'Siti' },
      },
    ];

    const result = computeRelationConnectQueryConfigs(
      peopleEntityInputs,
      personMetadata,
      flatObjectMetadataMaps,
      flatFieldMetadataMaps,
      flatIndexMaps,
      {},
    );

    expect(result).toEqual([]);
  });

  it('should throw an error if a connect field is not a relation field', () => {
    const peopleEntityInputs = [
      {
        id: '1',
        name: { connect: { where: { name: { lastName: 'Saputra' } } } },
      },
      {
        id: '2',
      },
    ];

    const relationConnectQueryFieldsByEntityIndex = {
      '0': {
        name: { connect: { where: { name: { lastName: 'Saputra' } } } },
      },
    };

    expect(() => {
      computeRelationConnectQueryConfigs(
        peopleEntityInputs,
        personMetadata,
        flatObjectMetadataMaps,
        flatFieldMetadataMaps,
        flatIndexMaps,
        relationConnectQueryFieldsByEntityIndex,
      );
    }).toThrow('Connect is not allowed for name on penduduk');
  });

  it('should throw an error if connect field has not any unique constraint fully populated', () => {
    const peopleEntityInputs = [
      {
        id: '1',
        'keluarga-related-to-1': {
          connect: { where: { name: 'company1' } },
        },
      },
    ];

    const relationConnectQueryFieldsByEntityIndex = {
      '0': {
        'keluarga-related-to-1': { connect: { where: { name: 'company1' } } },
      },
    };

    expect(() => {
      computeRelationConnectQueryConfigs(
        peopleEntityInputs,
        personMetadata,
        flatObjectMetadataMaps,
        flatFieldMetadataMaps,
        flatIndexMaps,
        relationConnectQueryFieldsByEntityIndex,
      );
    }).toThrow(
      "Missing required fields: at least one unique constraint have to be fully populated for 'keluarga-related-to-1'.",
    );
  });

  it('should throw an error if connect field are not in constraint fields', () => {
    const peopleEntityInputs = [
      {
        id: '1',
        'keluarga-related-to-1': {
          connect: {
            where: {
              domainName: { primaryLinkUrl: 'company1.com' },
              id: '1',
              address: 'company1 address',
            },
          },
        },
      },
    ];

    const relationConnectQueryFieldsByEntityIndex = {
      '0': {
        'keluarga-related-to-1': {
          connect: {
            where: {
              domainName: { primaryLinkUrl: 'company1.com' },
              id: '1',
              address: 'company1 address',
            },
          },
        },
      },
    };

    expect(() => {
      computeRelationConnectQueryConfigs(
        peopleEntityInputs,
        personMetadata,
        flatObjectMetadataMaps,
        flatFieldMetadataMaps,
        flatIndexMaps,
        relationConnectQueryFieldsByEntityIndex,
      );
    }).toThrow(
      "Field address is not a unique constraint field for 'keluarga-related-to-1'.",
    );
  });

  it('should throw an error if connect field has different unique constraints populated', () => {
    const peopleEntityInputs = [
      {
        id: '1',
        'keluarga-related-to-1': {
          connect: {
            where: {
              domainName: { primaryLinkUrl: 'company1.com' },
            },
          },
        },
      },
      {
        id: '2',
        'keluarga-related-to-1': {
          connect: {
            where: { id: '2' },
          },
        },
      },
    ];

    const relationConnectQueryFieldsByEntityIndex = {
      '0': {
        'keluarga-related-to-1': {
          connect: {
            where: {
              domainName: { primaryLinkUrl: 'company1.com' },
            },
          },
        },
      },
      '1': {
        'keluarga-related-to-1': { connect: { where: { id: '2' } } },
      },
    };

    expect(() => {
      computeRelationConnectQueryConfigs(
        peopleEntityInputs,
        personMetadata,
        flatObjectMetadataMaps,
        flatFieldMetadataMaps,
        flatIndexMaps,
        relationConnectQueryFieldsByEntityIndex,
      );
    }).toThrow(
      'Expected the same constraint fields to be used consistently across all operations for keluarga-related-to-1.',
    );
  });

  it('should return the correct relation connect query configs', () => {
    const peopleEntityInputs = [
      {
        id: '1',
        'keluarga-related-to-1': {
          connect: {
            where: {
              domainName: { primaryLinkUrl: 'keluarga.com' },
            },
          },
        },
        'keluarga-related-to-2': {
          connect: {
            where: { id: '1' },
          },
        },
      },
      {
        id: '2',
        'keluarga-related-to-1': {
          connect: {
            where: { domainName: { primaryLinkUrl: 'other-keluarga.com' } },
          },
        },
        'keluarga-related-to-2': {
          connect: {
            where: { id: '2' },
          },
        },
      },
    ];

    const relationConnectQueryFieldsByEntityIndex = {
      '0': {
        'keluarga-related-to-1': {
          connect: {
            where: { domainName: { primaryLinkUrl: 'keluarga.com' } },
          },
        },
        'keluarga-related-to-2': {
          connect: {
            where: { id: '1' },
          },
        },
      },
      '1': {
        'keluarga-related-to-1': {
          connect: {
            where: { domainName: { primaryLinkUrl: 'other-keluarga.com' } },
          },
        },
        'keluarga-related-to-2': {
          connect: {
            where: { id: '2' },
          },
        },
      },
    };

    const result = computeRelationConnectQueryConfigs(
      peopleEntityInputs,
      personMetadata,
      flatObjectMetadataMaps,
      flatFieldMetadataMaps,
      flatIndexMaps,
      relationConnectQueryFieldsByEntityIndex,
    );

    expect(result).toEqual([
      {
        connectFieldName: 'keluarga-related-to-1',
        recordToConnectConditions: [
          [['domainNamePrimaryLinkUrl', 'keluarga.com']],
          [['domainNamePrimaryLinkUrl', 'other-keluarga.com']],
        ],
        recordToConnectConditionByEntityIndex: {
          '0': [['domainNamePrimaryLinkUrl', 'keluarga.com']],
          '1': [['domainNamePrimaryLinkUrl', 'other-keluarga.com']],
        },
        relationFieldName: 'keluarga-related-to-1Id',
        targetObjectName: 'keluarga',
        uniqueConstraintFields: [
          expect.objectContaining({
            id: 'keluarga-domain-name-field-id',
            name: 'domainName',
            type: FieldMetadataType.LINKS,
          }),
        ],
      },
      {
        connectFieldName: 'keluarga-related-to-2',
        recordToConnectConditions: [[['id', '1']], [['id', '2']]],
        recordToConnectConditionByEntityIndex: {
          '0': [['id', '1']],
          '1': [['id', '2']],
        },
        relationFieldName: 'keluarga-related-to-2Id',
        targetObjectName: 'keluarga',
        uniqueConstraintFields: [
          expect.objectContaining({
            id: 'keluarga-id-field-id',
            name: 'id',
            type: FieldMetadataType.UUID,
          }),
        ],
      },
    ]);
  });
});
