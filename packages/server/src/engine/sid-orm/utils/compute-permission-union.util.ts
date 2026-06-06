import {
  type ObjectsPermissions,
  type RestrictedFieldsPermissions,
} from 'shared/types';

/**
 * Menggabungkan permissions dari beberapa role dengan logika UNION (OR).
 *
 * Berbeda dengan computePermissionIntersection (AND), union memberikan akses
 * jika **salah satu** role memiliki akses. Digunakan saat user memiliki multiple
 * role dan cukup salah satu role yang mengizinkan.
 */
export const computePermissionUnion = (
  permissionsArray: ObjectsPermissions[],
): ObjectsPermissions => {
  if (permissionsArray.length === 0) {
    return {};
  }

  if (permissionsArray.length === 1) {
    return permissionsArray[0];
  }

  const result: ObjectsPermissions = {};

  // Kumpulkan semua object metadata dari seluruh role
  const allObjectMetadataIds = new Set<string>();

  for (const permissions of permissionsArray) {
    for (const id of Object.keys(permissions)) {
      allObjectMetadataIds.add(id);
    }
  }

  for (const objectMetadataId of allObjectMetadataIds) {
    let canReadObjectRecords = false;
    let canUpdateObjectRecords = false;
    let canSoftDeleteObjectRecords = false;
    let canDestroyObjectRecords = false;

    // Two-pass untuk restricted fields: collect dulu semua field dari semua role
    const fieldStats: Record<
      string,
      {
        canReadFalseCount: number;
        canUpdateFalseCount: number;
        roleCount: number;
      }
    > = {};

    for (const permissions of permissionsArray) {
      const objPerm = permissions[objectMetadataId];

      if (!objPerm) {
        continue;
      }

      // OR logic — jika salah satu role mengizinkan, maka diizinkan
      canReadObjectRecords =
        canReadObjectRecords || objPerm.canReadObjectRecords === true;
      canUpdateObjectRecords =
        canUpdateObjectRecords || objPerm.canUpdateObjectRecords === true;
      canSoftDeleteObjectRecords =
        canSoftDeleteObjectRecords ||
        objPerm.canSoftDeleteObjectRecords === true;
      canDestroyObjectRecords =
        canDestroyObjectRecords || objPerm.canDestroyObjectRecords === true;

      // Collect restricted field stats
      if (objPerm.restrictedFields) {
        for (const [fieldName, fieldPerm] of Object.entries(
          objPerm.restrictedFields,
        )) {
          if (!fieldStats[fieldName]) {
            fieldStats[fieldName] = {
              canReadFalseCount: 0,
              canUpdateFalseCount: 0,
              roleCount: 0,
            };
          }

          fieldStats[fieldName].roleCount++;

          if (fieldPerm.canRead === false) {
            fieldStats[fieldName].canReadFalseCount++;
          }

          if (fieldPerm.canUpdate === false) {
            fieldStats[fieldName].canUpdateFalseCount++;
          }
        }
      }
    }

    // Union untuk restricted fields: hanya blokir jika SEMUA role yang punya field ini memblokirnya
    const restrictedFields: RestrictedFieldsPermissions = {};

    for (const [fieldName, stats] of Object.entries(fieldStats)) {
      restrictedFields[fieldName] = {
        canRead: stats.canReadFalseCount === stats.roleCount ? false : null,
        canUpdate: stats.canUpdateFalseCount === stats.roleCount ? false : null,
      };
    }

    result[objectMetadataId] = {
      canReadObjectRecords,
      canUpdateObjectRecords,
      canSoftDeleteObjectRecords,
      canDestroyObjectRecords,
      restrictedFields,
      rowLevelPermissionPredicates: [],
      rowLevelPermissionPredicateGroups: [],
    };
  }

  return result;
};
