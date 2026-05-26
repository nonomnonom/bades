import { FieldActorSource } from 'shared/types';
import { isDefined } from 'shared/utils';
import { type EntityManager } from 'typeorm';

import { type FlatEntityMaps } from 'src/engine/metadata-modules/flat-entity/types/flat-entity-maps.type';
import { findFlatEntityByIdInFlatEntityMaps } from 'src/engine/metadata-modules/flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps.util';
import { type FlatFieldMetadata } from 'src/engine/metadata-modules/flat-field-metadata/types/flat-field-metadata.type';
import { type FlatObjectMetadata } from 'src/engine/metadata-modules/flat-object-metadata/types/flat-object-metadata.type';
import { buildObjectIdByNameMaps } from 'src/engine/metadata-modules/flat-object-metadata/utils/build-object-id-by-name-maps.util';
import { generateObjectRecordFields } from 'src/modules/workflow/workflow-builder/workflow-schema/utils/generate-object-record-fields';

export const PENDAFTARAN_WARGA_WORKFLOW_ID =
  '8b213cac-a68b-4ffe-817a-3ec994e9932d';
export const PENDAFTARAN_WARGA_WORKFLOW_VERSION_ID =
  'ac67974f-c524-4288-9d88-af8515400b68';

export const prefillWorkflows = async (
  entityManager: EntityManager,
  workspaceId: string,
  schemaName: string,
  flatObjectMetadataMaps: FlatEntityMaps<FlatObjectMetadata>,
  flatFieldMetadataMaps: FlatEntityMaps<FlatFieldMetadata>,
) => {
  const { idByNameSingular: objectIdByNameSingular } = buildObjectIdByNameMaps(
    flatObjectMetadataMaps,
  );

  const keluargaObjectMetadataId = objectIdByNameSingular['keluarga'];
  const pendudukObjectMetadataId = objectIdByNameSingular['penduduk'];

  if (
    !isDefined(keluargaObjectMetadataId) ||
    !isDefined(pendudukObjectMetadataId)
  ) {
    throw new Error('Metadata objek keluarga atau penduduk tidak ditemukan');
  }

  const keluargaObjectMetadata = findFlatEntityByIdInFlatEntityMaps({
    flatEntityId: keluargaObjectMetadataId,
    flatEntityMaps: flatObjectMetadataMaps,
  });

  const pendudukObjectMetadata = findFlatEntityByIdInFlatEntityMaps({
    flatEntityId: pendudukObjectMetadataId,
    flatEntityMaps: flatObjectMetadataMaps,
  });

  if (
    !isDefined(keluargaObjectMetadata) ||
    !isDefined(pendudukObjectMetadata)
  ) {
    throw new Error('Metadata objek keluarga atau penduduk tidak ditemukan');
  }

  await entityManager
    .createQueryBuilder()
    .insert()
    .into(`${schemaName}.workflow`, [
      'id',
      'name',
      'lastPublishedVersionId',
      'statuses',
      'position',
      'createdBySource',
      'createdByWorkspaceMemberId',
      'createdByName',
      'createdByContext',
      'updatedBySource',
      'updatedByWorkspaceMemberId',
      'updatedByName',
    ])
    .orIgnore()
    .values([
      {
        id: PENDAFTARAN_WARGA_WORKFLOW_ID,
        name: 'Pendaftaran Warga Baru',
        lastPublishedVersionId: PENDAFTARAN_WARGA_WORKFLOW_VERSION_ID,
        statuses: ['ACTIVE'],
        position: 1,
        createdBySource: FieldActorSource.SYSTEM,
        createdByWorkspaceMemberId: null,
        createdByName: 'System',
        createdByContext: {},
        updatedBySource: FieldActorSource.SYSTEM,
        updatedByWorkspaceMemberId: null,
        updatedByName: 'System',
      },
    ])
    .returning('*')
    .execute();

  await entityManager
    .createQueryBuilder()
    .insert()
    .into(`${schemaName}.workflowVersion`, [
      'id',
      'name',
      'trigger',
      'steps',
      'status',
      'position',
      'workflowId',
    ])
    .orIgnore()
    .values([
      {
        id: PENDAFTARAN_WARGA_WORKFLOW_VERSION_ID,
        name: 'v1',
        trigger: JSON.stringify({
          name: 'Jalankan manual',
          type: 'MANUAL',
          settings: {
            outputSchema: {},
            icon: 'IconUserPlus',
            availability: { type: 'GLOBAL', locations: undefined },
          },
          nextStepIds: ['6e089bc9-aabd-435f-865f-f31c01c8f4a7'],
        }),
        steps: JSON.stringify([
          {
            id: '6e089bc9-aabd-435f-865f-f31c01c8f4a7',
            name: 'Formulir Pendaftaran',
            type: 'FORM',
            valid: false,
            settings: {
              input: [
                {
                  id: '14d669f0-5249-4fa4-b0bb-f8bd408328d5',
                  name: 'nik',
                  type: 'TEXT',
                  label: 'NIK',
                  placeholder: '3234567890123456',
                },
                {
                  id: '4eb6ce85-d231-4aef-9837-744490c026d0',
                  name: 'namaLengkap',
                  type: 'TEXT',
                  label: 'Nama Lengkap',
                  placeholder: 'Made Sutrisna',
                },
                {
                  id: 'adbf0e9f-1427-49be-b4fb-092b34d97350',
                  name: 'tempatLahir',
                  type: 'TEXT',
                  label: 'Tempat Lahir',
                  placeholder: 'Denpasar',
                },
                {
                  id: '4ffc7992-9e65-4a4d-9baf-b52e62f2c273',
                  name: 'tanggalLahir',
                  type: 'TEXT_DATE',
                  label: 'Tanggal Lahir',
                  placeholder: '01/01/1990',
                },
                {
                  id: '42f11926-04ea-4924-94a4-2293cc748362',
                  name: 'jenisKelamin',
                  type: 'TEXT',
                  label: 'Jenis Kelamin',
                  placeholder: 'Laki-laki',
                },
                {
                  id: 'd6ca80ee-26cd-466d-91bf-984d7205451c',
                  name: 'alamat',
                  type: 'TEXT',
                  label: 'Alamat',
                  placeholder: 'Jl. Desa No. 1',
                },
              ],
              outputSchema: {
                nik: {
                  type: 'TEXT',
                  label: 'NIK',
                  value: 'My text',
                  isLeaf: true,
                },
                namaLengkap: {
                  type: 'TEXT',
                  label: 'Nama Lengkap',
                  value: 'My text',
                  isLeaf: true,
                },
                tempatLahir: {
                  type: 'TEXT',
                  label: 'Tempat Lahir',
                  value: 'My text',
                  isLeaf: true,
                },
                tanggalLahir: {
                  type: 'TEXT_DATE',
                  label: 'Tanggal Lahir',
                  value: 'My text',
                  isLeaf: true,
                },
                jenisKelamin: {
                  type: 'TEXT',
                  label: 'Jenis Kelamin',
                  value: 'My text',
                  isLeaf: true,
                },
                alamat: {
                  type: 'TEXT',
                  label: 'Alamat',
                  value: 'My text',
                  isLeaf: true,
                },
              },
              errorHandlingOptions: {
                retryOnFailure: { value: false },
                continueOnFailure: { value: false },
              },
            },
            __typename: 'WorkflowAction',
            nextStepIds: ['6f553ea7-b00e-4371-9d88-d8298568a246'],
          },
          {
            id: '6f553ea7-b00e-4371-9d88-d8298568a246',
            name: 'Buat Penduduk',
            type: 'CREATE_RECORD',
            valid: false,
            settings: {
              input: {
                objectName: 'penduduk',
                objectRecord: {
                  nik: '{{6e089bc9-aabd-435f-865f-f31c01c8f4a7.nik}}',
                  namaLengkap:
                    '{{6e089bc9-aabd-435f-865f-f31c01c8f4a7.namaLengkap}}',
                  tempatLahir:
                    '{{6e089bc9-aabd-435f-865f-f31c01c8f4a7.tempatLahir}}',
                },
              },
              outputSchema: {
                object: {
                  icon: 'IconUser',
                  label: 'Penduduk',
                  value: 'Seorang penduduk',
                  isLeaf: true,
                  fieldIdName: 'id',
                  nameSingular: 'penduduk',
                },
                _outputSchemaType: 'RECORD',
                fields: generateObjectRecordFields({
                  objectMetadataInfo: {
                    flatObjectMetadata: pendudukObjectMetadata,
                    flatObjectMetadataMaps,
                    flatFieldMetadataMaps,
                  },
                }),
              },
              errorHandlingOptions: {
                retryOnFailure: { value: false },
                continueOnFailure: { value: false },
              },
            },
            __typename: 'WorkflowAction',
            nextStepIds: null,
          },
        ]),
        status: 'ACTIVE',
        position: 1,
        workflowId: PENDAFTARAN_WARGA_WORKFLOW_ID,
      },
    ])
    .returning('*')
    .execute();
};
