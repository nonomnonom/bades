import { type ObjectsPermissions } from 'shared/types';

import { computePermissionUnion } from 'src/engine/sid-orm/utils/compute-permission-union.util';

describe('computePermissionUnion', () => {
  const objectMetadataId1 = 'object-1';
  const objectMetadataId2 = 'object-2';

  describe('edge cases', () => {
    it('should return empty object for empty array', () => {
      const result = computePermissionUnion([]);

      expect(result).toEqual({});
    });

    it('should return same permissions for single role', () => {
      const permissions: ObjectsPermissions = {
        [objectMetadataId1]: {
          canReadObjectRecords: true,
          canUpdateObjectRecords: true,
          canSoftDeleteObjectRecords: false,
          canDestroyObjectRecords: false,
          restrictedFields: {},
          rowLevelPermissionPredicates: [],
          rowLevelPermissionPredicateGroups: [],
        },
      };

      const result = computePermissionUnion([permissions]);

      expect(result).toEqual(permissions);
    });
  });

  describe('union logic (OR)', () => {
    it('should grant if ANY role has permission (true OR false = true)', () => {
      const role1Permissions: ObjectsPermissions = {
        [objectMetadataId1]: {
          canReadObjectRecords: true,
          canUpdateObjectRecords: false,
          canSoftDeleteObjectRecords: false,
          canDestroyObjectRecords: false,
          restrictedFields: {},
          rowLevelPermissionPredicates: [],
          rowLevelPermissionPredicateGroups: [],
        },
      };

      const role2Permissions: ObjectsPermissions = {
        [objectMetadataId1]: {
          canReadObjectRecords: false,
          canUpdateObjectRecords: true,
          canSoftDeleteObjectRecords: true,
          canDestroyObjectRecords: true,
          restrictedFields: {},
          rowLevelPermissionPredicates: [],
          rowLevelPermissionPredicateGroups: [],
        },
      };

      const result = computePermissionUnion([
        role1Permissions,
        role2Permissions,
      ]);

      expect(result[objectMetadataId1]).toEqual({
        canReadObjectRecords: true,
        canUpdateObjectRecords: true,
        canSoftDeleteObjectRecords: true,
        canDestroyObjectRecords: true,
        restrictedFields: {},
        rowLevelPermissionPredicates: [],
        rowLevelPermissionPredicateGroups: [],
      });
    });

    it('should deny only if ALL roles lack permission (false OR false = false)', () => {
      const role1Permissions: ObjectsPermissions = {
        [objectMetadataId1]: {
          canReadObjectRecords: false,
          canUpdateObjectRecords: false,
          canSoftDeleteObjectRecords: false,
          canDestroyObjectRecords: false,
          restrictedFields: {},
          rowLevelPermissionPredicates: [],
          rowLevelPermissionPredicateGroups: [],
        },
      };

      const role2Permissions: ObjectsPermissions = {
        [objectMetadataId1]: {
          canReadObjectRecords: false,
          canUpdateObjectRecords: false,
          canSoftDeleteObjectRecords: false,
          canDestroyObjectRecords: false,
          restrictedFields: {},
          rowLevelPermissionPredicates: [],
          rowLevelPermissionPredicateGroups: [],
        },
      };

      const result = computePermissionUnion([
        role1Permissions,
        role2Permissions,
      ]);

      expect(result[objectMetadataId1]).toEqual({
        canReadObjectRecords: false,
        canUpdateObjectRecords: false,
        canSoftDeleteObjectRecords: false,
        canDestroyObjectRecords: false,
        restrictedFields: {},
        rowLevelPermissionPredicates: [],
        rowLevelPermissionPredicateGroups: [],
      });
    });

    it('should still grant if one role has no access to object (should not block)', () => {
      const role1Permissions: ObjectsPermissions = {
        [objectMetadataId1]: {
          canReadObjectRecords: true,
          canUpdateObjectRecords: true,
          canSoftDeleteObjectRecords: true,
          canDestroyObjectRecords: true,
          restrictedFields: {},
          rowLevelPermissionPredicates: [],
          rowLevelPermissionPredicateGroups: [],
        },
      };

      const role2Permissions: ObjectsPermissions = {};

      const result = computePermissionUnion([
        role1Permissions,
        role2Permissions,
      ]);

      // Union: kalau salah satu role punya akses, tetap diizinkan
      expect(result[objectMetadataId1]).toEqual({
        canReadObjectRecords: true,
        canUpdateObjectRecords: true,
        canSoftDeleteObjectRecords: true,
        canDestroyObjectRecords: true,
        restrictedFields: {},
        rowLevelPermissionPredicates: [],
        rowLevelPermissionPredicateGroups: [],
      });
    });
  });

  describe('multiple objects', () => {
    it('should compute union independently for each object', () => {
      const role1Permissions: ObjectsPermissions = {
        [objectMetadataId1]: {
          canReadObjectRecords: true,
          canUpdateObjectRecords: false,
          canSoftDeleteObjectRecords: false,
          canDestroyObjectRecords: false,
          restrictedFields: {},
          rowLevelPermissionPredicates: [],
          rowLevelPermissionPredicateGroups: [],
        },
        [objectMetadataId2]: {
          canReadObjectRecords: true,
          canUpdateObjectRecords: false,
          canSoftDeleteObjectRecords: false,
          canDestroyObjectRecords: false,
          restrictedFields: {},
          rowLevelPermissionPredicates: [],
          rowLevelPermissionPredicateGroups: [],
        },
      };

      const role2Permissions: ObjectsPermissions = {
        [objectMetadataId1]: {
          canReadObjectRecords: false,
          canUpdateObjectRecords: true,
          canSoftDeleteObjectRecords: true,
          canDestroyObjectRecords: true,
          restrictedFields: {},
          rowLevelPermissionPredicates: [],
          rowLevelPermissionPredicateGroups: [],
        },
        [objectMetadataId2]: {
          canReadObjectRecords: false,
          canUpdateObjectRecords: true,
          canSoftDeleteObjectRecords: false,
          canDestroyObjectRecords: false,
          restrictedFields: {},
          rowLevelPermissionPredicates: [],
          rowLevelPermissionPredicateGroups: [],
        },
      };

      const result = computePermissionUnion([
        role1Permissions,
        role2Permissions,
      ]);

      expect(result[objectMetadataId1]).toEqual({
        canReadObjectRecords: true,
        canUpdateObjectRecords: true,
        canSoftDeleteObjectRecords: true,
        canDestroyObjectRecords: true,
        restrictedFields: {},
        rowLevelPermissionPredicates: [],
        rowLevelPermissionPredicateGroups: [],
      });

      expect(result[objectMetadataId2]).toEqual({
        canReadObjectRecords: true,
        canUpdateObjectRecords: true,
        canSoftDeleteObjectRecords: false,
        canDestroyObjectRecords: false,
        restrictedFields: {},
        rowLevelPermissionPredicates: [],
        rowLevelPermissionPredicateGroups: [],
      });
    });
  });

  describe('restricted fields', () => {
    it('should compute union for restricted fields (least restrictive)', () => {
      const role1Permissions: ObjectsPermissions = {
        [objectMetadataId1]: {
          canReadObjectRecords: true,
          canUpdateObjectRecords: true,
          canSoftDeleteObjectRecords: true,
          canDestroyObjectRecords: true,
          restrictedFields: {
            email: {
              canRead: false,
              canUpdate: false,
            },
            salary: {
              canRead: false,
              canUpdate: null,
            },
          },
          rowLevelPermissionPredicates: [],
          rowLevelPermissionPredicateGroups: [],
        },
      };

      const role2Permissions: ObjectsPermissions = {
        [objectMetadataId1]: {
          canReadObjectRecords: true,
          canUpdateObjectRecords: true,
          canSoftDeleteObjectRecords: true,
          canDestroyObjectRecords: true,
          restrictedFields: {
            email: {
              canRead: null,
              canUpdate: null,
            },
            salary: {
              canRead: null,
              canUpdate: false,
            },
          },
          rowLevelPermissionPredicates: [],
          rowLevelPermissionPredicateGroups: [],
        },
      };

      const result = computePermissionUnion([
        role1Permissions,
        role2Permissions,
      ]);

      expect(result[objectMetadataId1].restrictedFields).toEqual({
        email: {
          canRead: null,
          canUpdate: null,
        },
        salary: {
          canRead: null,
          canUpdate: null,
        },
      });
    });

    it('should block field only if ALL roles block it', () => {
      const role1Permissions: ObjectsPermissions = {
        [objectMetadataId1]: {
          canReadObjectRecords: true,
          canUpdateObjectRecords: true,
          canSoftDeleteObjectRecords: true,
          canDestroyObjectRecords: true,
          restrictedFields: {
            email: {
              canRead: false,
              canUpdate: false,
            },
          },
          rowLevelPermissionPredicates: [],
          rowLevelPermissionPredicateGroups: [],
        },
      };

      const role2Permissions: ObjectsPermissions = {
        [objectMetadataId1]: {
          canReadObjectRecords: true,
          canUpdateObjectRecords: true,
          canSoftDeleteObjectRecords: true,
          canDestroyObjectRecords: true,
          restrictedFields: {
            email: {
              canRead: false,
              canUpdate: false,
            },
          },
          rowLevelPermissionPredicates: [],
          rowLevelPermissionPredicateGroups: [],
        },
      };

      const result = computePermissionUnion([
        role1Permissions,
        role2Permissions,
      ]);

      expect(result[objectMetadataId1].restrictedFields).toEqual({
        email: {
          canRead: false,
          canUpdate: false,
        },
      });
    });

    it('should handle fields that only exist in some roles (union = permissive)', () => {
      const role1Permissions: ObjectsPermissions = {
        [objectMetadataId1]: {
          canReadObjectRecords: true,
          canUpdateObjectRecords: true,
          canSoftDeleteObjectRecords: true,
          canDestroyObjectRecords: true,
          restrictedFields: {
            email: {
              canRead: false,
              canUpdate: false,
            },
          },
          rowLevelPermissionPredicates: [],
          rowLevelPermissionPredicateGroups: [],
        },
      };

      const role2Permissions: ObjectsPermissions = {
        [objectMetadataId1]: {
          canReadObjectRecords: true,
          canUpdateObjectRecords: true,
          canSoftDeleteObjectRecords: true,
          canDestroyObjectRecords: true,
          restrictedFields: {
            salary: {
              canRead: false,
              canUpdate: false,
            },
          },
          rowLevelPermissionPredicates: [],
          rowLevelPermissionPredicateGroups: [],
        },
      };

      const result = computePermissionUnion([
        role1Permissions,
        role2Permissions,
      ]);

      // Union: fields only restricted in one role — only blocked if BOTH restrict.
      // Since each field is only in one role, union should let them pass (null).
      expect(result[objectMetadataId1].restrictedFields).toEqual({
        email: {
          canRead: null,
          canUpdate: null,
        },
        salary: {
          canRead: null,
          canUpdate: null,
        },
      });
    });
  });

  describe('three or more roles', () => {
    it('should compute union across all roles', () => {
      const role1: ObjectsPermissions = {
        [objectMetadataId1]: {
          canReadObjectRecords: true,
          canUpdateObjectRecords: false,
          canSoftDeleteObjectRecords: false,
          canDestroyObjectRecords: false,
          restrictedFields: {},
          rowLevelPermissionPredicates: [],
          rowLevelPermissionPredicateGroups: [],
        },
      };

      const role2: ObjectsPermissions = {
        [objectMetadataId1]: {
          canReadObjectRecords: false,
          canUpdateObjectRecords: true,
          canSoftDeleteObjectRecords: false,
          canDestroyObjectRecords: false,
          restrictedFields: {},
          rowLevelPermissionPredicates: [],
          rowLevelPermissionPredicateGroups: [],
        },
      };

      const role3: ObjectsPermissions = {
        [objectMetadataId1]: {
          canReadObjectRecords: false,
          canUpdateObjectRecords: false,
          canSoftDeleteObjectRecords: true,
          canDestroyObjectRecords: true,
          restrictedFields: {},
          rowLevelPermissionPredicates: [],
          rowLevelPermissionPredicateGroups: [],
        },
      };

      const result = computePermissionUnion([role1, role2, role3]);

      expect(result[objectMetadataId1]).toEqual({
        canReadObjectRecords: true,
        canUpdateObjectRecords: true,
        canSoftDeleteObjectRecords: true,
        canDestroyObjectRecords: true,
        restrictedFields: {},
        rowLevelPermissionPredicates: [],
        rowLevelPermissionPredicateGroups: [],
      });
    });
  });
});
