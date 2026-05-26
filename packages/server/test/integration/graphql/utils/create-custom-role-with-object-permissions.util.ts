import gql from 'graphql-tag';
import { makeMetadataAPIRequest } from 'test/integration/metadata/suites/utils/make-metadata-api-request.util';

export const createCustomRoleWithObjectPermissions = async (options: {
  label: string;
  canReadPenduduk?: boolean;
  canReadKeluarga?: boolean;
  canReadProgramBantuan?: boolean;
  canUpdatePenduduk?: boolean;
  canUpdateKeluarga?: boolean;
  canUpdateProgramBantuan?: boolean;
  hasAllObjectRecordsReadPermission?: boolean;
}) => {
  const createRoleOperation = {
    query: gql`
        mutation CreateOneRole {
          createOneRole(createRoleInput: {
            label: "${options.label}"
            description: "Test role untuk pengujian permission"
            canUpdateAllSettings: ${options.hasAllObjectRecordsReadPermission ?? true}
            canReadAllObjectRecords: ${options.hasAllObjectRecordsReadPermission ?? true}
            canUpdateAllObjectRecords: ${options.hasAllObjectRecordsReadPermission ?? true}
            canSoftDeleteAllObjectRecords: ${options.hasAllObjectRecordsReadPermission ?? true}
            canDestroyAllObjectRecords: ${options.hasAllObjectRecordsReadPermission ?? true}
          }) {
            id
            label
          }
        }
      `,
  };

  const response = await makeMetadataAPIRequest(createRoleOperation);

  expect(response.body.errors).toBeUndefined();
  expect(response.body.data.createOneRole).toBeDefined();
  const roleId = response.body.data.createOneRole.id;

  // Ambil metadata ID object SID
  const getObjectMetadataOperation = {
    query: gql`
      query {
        objects(paging: { first: 1000 }) {
          edges {
            node {
              id
              nameSingular
            }
          }
        }
      }
    `,
  };

  const objectMetadataResponse = await makeMetadataAPIRequest(
    getObjectMetadataOperation,
  );
  const objects = objectMetadataResponse.body.data.objects.edges;

  const pendudukObjectId = objects.find(
    (obj: any) => obj.node.nameSingular === 'penduduk',
  )?.node.id;
  const keluargaObjectId = objects.find(
    (obj: any) => obj.node.nameSingular === 'keluarga',
  )?.node.id;
  const programBantuanObjectId = objects.find(
    (obj: any) => obj.node.nameSingular === 'programBantuan',
  )?.node.id;

  const resolvedCanReadPenduduk = options.canReadPenduduk;
  const resolvedCanUpdatePenduduk = options.canUpdatePenduduk;
  const resolvedCanReadKeluarga = options.canReadKeluarga;
  const resolvedCanUpdateKeluarga = options.canUpdateKeluarga;
  const resolvedCanReadProgramBantuan = options.canReadProgramBantuan;
  const resolvedCanUpdateProgramBantuan = options.canUpdateProgramBantuan;

  const objectPermissions: Array<{
    objectMetadataId: string | undefined;
    canReadObjectRecords: boolean | undefined;
    canUpdateObjectRecords: boolean;
    canSoftDeleteObjectRecords: boolean;
    canDestroyObjectRecords: boolean;
  }> = [];

  if (
    resolvedCanReadPenduduk !== undefined ||
    resolvedCanUpdatePenduduk !== undefined
  ) {
    objectPermissions.push({
      objectMetadataId: pendudukObjectId,
      canReadObjectRecords: resolvedCanReadPenduduk,
      canUpdateObjectRecords:
        resolvedCanUpdatePenduduk === undefined
          ? false
          : resolvedCanUpdatePenduduk,
      canSoftDeleteObjectRecords: false,
      canDestroyObjectRecords: false,
    });
  }

  if (
    resolvedCanReadKeluarga !== undefined ||
    resolvedCanUpdateKeluarga !== undefined
  ) {
    objectPermissions.push({
      objectMetadataId: keluargaObjectId,
      canReadObjectRecords: resolvedCanReadKeluarga,
      canUpdateObjectRecords:
        resolvedCanUpdateKeluarga === undefined
          ? false
          : resolvedCanUpdateKeluarga,
      canSoftDeleteObjectRecords: false,
      canDestroyObjectRecords: false,
    });
  }

  if (
    resolvedCanReadProgramBantuan !== undefined ||
    resolvedCanUpdateProgramBantuan !== undefined
  ) {
    objectPermissions.push({
      objectMetadataId: programBantuanObjectId,
      canReadObjectRecords: resolvedCanReadProgramBantuan,
      canUpdateObjectRecords:
        resolvedCanUpdateProgramBantuan === undefined
          ? false
          : resolvedCanUpdateProgramBantuan,
      canSoftDeleteObjectRecords: false,
      canDestroyObjectRecords: false,
    });
  }

  if (objectPermissions.length > 0) {
    const upsertObjectPermissionsOperation = {
      query: gql`
        mutation UpsertObjectPermissions(
          $roleId: UUID!
          $objectPermissions: [ObjectPermissionInput!]!
        ) {
          upsertObjectPermissions(
            upsertObjectPermissionsInput: {
              roleId: $roleId
              objectPermissions: $objectPermissions
            }
          ) {
            objectMetadataId
            canReadObjectRecords
          }
        }
      `,
      variables: {
        roleId,
        objectPermissions,
      },
    };

    await makeMetadataAPIRequest(upsertObjectPermissionsOperation);
  }

  return {
    roleId,
    pendudukObjectId,
    keluargaObjectId,
    programBantuanObjectId,
    // Alias legacy — kembalikan untuk kompatibilitas caller lama
    personObjectId: pendudukObjectId,
    companyObjectId: keluargaObjectId,
    opportunityObjectId: programBantuanObjectId,
  };
};
