import { Test, type TestingModule } from '@nestjs/testing';
import { getDataSourceToken, getRepositoryToken } from '@nestjs/typeorm';

import { WorkspaceActivationStatus } from 'shared/workspace';

import { UserWorkspaceEntity } from 'src/engine/core-modules/user-workspace/user-workspace.entity';
import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { ObjectMetadataEntity } from 'src/engine/metadata-modules/object-metadata/object-metadata.entity';
import { ObjectPermissionService } from 'src/engine/metadata-modules/object-permission/object-permission.service';
import { RoleEntity } from 'src/engine/metadata-modules/role/role.entity';
import { RoleService } from 'src/engine/metadata-modules/role/role.service';
import { UserRoleService } from 'src/engine/metadata-modules/user-role/user-role.service';
import { STANDARD_ROLE } from 'src/engine/workspace-manager/bades-standard-application/constants/standard-role.constant';
import { SID_STANDARD_OBJECT_SEEDS } from 'src/engine/workspace-manager/sid-standard-seed/sid-standard-seed.config';
import { SidStandardPermissionInitService } from 'src/engine/workspace-manager/sid-standard-seed/services/sid-standard-permission-init.service';

// Mock SID_STANDARD_OBJECT_SEEDS secara implisit lewat resolve di constructor
// service. Test ini verifikasi perilaku end-to-end tanpa query DB sungguhan.
//
// Strategi: mock semua dependency dengan `useValue: { ... }` di Test module,
// panggil method `initPermissionsForSidWorkspace`, dan verifikasi side effect
// yang diharapkan (assignRoleToManyUserWorkspace dipanggil, upsertObjectPermissions
// dipanggil dengan input benar, dll).
describe('SidStandardPermissionInitService', () => {
  let service: SidStandardPermissionInitService;
  let roleService: jest.Mocked<RoleService>;
  let userRoleService: jest.Mocked<UserRoleService>;
  let objectPermissionService: jest.Mocked<ObjectPermissionService>;
  let roleRepository: jest.Mocked<Repository<RoleEntity>>;
  let objectMetadataRepository: jest.Mocked<Repository<ObjectMetadataEntity>>;
  let userWorkspaceRepository: jest.Mocked<Repository<UserWorkspaceEntity>>;
  let coreDataSource: { getRepository: jest.Mock };

  // Test fixtures
  const workspaceId = 'workspace-test-id';
  const userId = 'user-test-id';
  const adminRoleId = 'admin-role-id';
  const memberRoleId = 'member-role-id';
  const userWorkspaceId = 'user-workspace-id';
  const workspaceCustomFlatApplication = {
    id: 'app-id',
    universalIdentifier: 'app-universal-identifier',
  } as any;

  // Bangun 9 object metadata mock untuk SID objects
  const sidObjectMocks = SID_STANDARD_OBJECT_SEEDS.map((seed, index) => ({
    id: `${seed.object.nameSingular}-id-${index}`,
    nameSingular: seed.object.nameSingular,
    namePlural: seed.object.namePlural,
    workspaceId,
  }));

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SidStandardPermissionInitService,
        {
          provide: RoleService,
          useValue: {
            createMemberRole: jest.fn(),
          },
        },
        {
          provide: UserRoleService,
          useValue: {
            assignRoleToManyUserWorkspace: jest.fn(),
          },
        },
        {
          provide: ObjectPermissionService,
          useValue: {
            upsertObjectPermissions: jest.fn().mockResolvedValue([]),
          },
        },
        {
          provide: getRepositoryToken(RoleEntity),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(ObjectMetadataEntity),
          useValue: {
            find: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(UserWorkspaceEntity),
          useValue: {
            findOneOrFail: jest.fn(),
          },
        },
        {
          provide: getDataSourceToken(),
          useValue: {
            getRepository: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SidStandardPermissionInitService>(
      SidStandardPermissionInitService,
    );
    roleService = module.get(RoleService);
    userRoleService = module.get(UserRoleService);
    objectPermissionService = module.get(ObjectPermissionService);
    roleRepository = module.get(getRepositoryToken(RoleEntity));
    objectMetadataRepository = module.get(
      getRepositoryToken(ObjectMetadataEntity),
    );
    userWorkspaceRepository = module.get(
      getRepositoryToken(UserWorkspaceEntity),
    );
    coreDataSource = module.get(getDataSourceToken());
  });

  describe('initPermissionsForSidWorkspace', () => {
    it('should throw when admin role not found for workspace', async () => {
      roleRepository.findOne.mockResolvedValue(null);

      await expect(
        service.initPermissionsForSidWorkspace({
          workspaceId,
          userId,
          workspaceCustomFlatApplication,
        }),
      ).rejects.toThrow(/Admin role tidak ditemukan/);

      expect(roleRepository.findOne).toHaveBeenCalledWith({
        where: {
          universalIdentifier: STANDARD_ROLE.admin.universalIdentifier,
          workspaceId,
        },
      });
    });

    it('should throw when SID object metadata is incomplete', async () => {
      roleRepository.findOne.mockResolvedValue({
        id: adminRoleId,
        universalIdentifier: STANDARD_ROLE.admin.universalIdentifier,
        workspaceId,
      } as RoleEntity);

      // Return hanya 8 dari 9 object — satu hilang
      objectMetadataRepository.find.mockResolvedValue(
        sidObjectMocks.slice(0, 8) as ObjectMetadataEntity[],
      );

      await expect(
        service.initPermissionsForSidWorkspace({
          workspaceId,
          userId,
          workspaceCustomFlatApplication,
        }),
      ).rejects.toThrow(/SID object metadata tidak lengkap/);
    });

    it('should list missing object namesSingular in error message', async () => {
      roleRepository.findOne.mockResolvedValue({
        id: adminRoleId,
        universalIdentifier: STANDARD_ROLE.admin.universalIdentifier,
        workspaceId,
      } as RoleEntity);

      // Return hanya object pertama — 8 object hilang
      objectMetadataRepository.find.mockResolvedValue(
        sidObjectMocks.slice(0, 1) as ObjectMetadataEntity[],
      );

      await expect(
        service.initPermissionsForSidWorkspace({
          workspaceId,
          userId,
          workspaceCustomFlatApplication,
        }),
      ).rejects.toThrow(/penduduk.*keluarga.*asetDesa/);
    });

    it('should assign admin role to first userWorkspace', async () => {
      roleRepository.findOne.mockResolvedValue({
        id: adminRoleId,
        workspaceId,
      } as RoleEntity);
      objectMetadataRepository.find.mockResolvedValue(
        sidObjectMocks as ObjectMetadataEntity[],
      );
      userWorkspaceRepository.findOneOrFail.mockResolvedValue({
        id: userWorkspaceId,
        workspaceId,
        userId,
      } as UserWorkspaceEntity);
      roleService.createMemberRole.mockResolvedValue({
        id: memberRoleId,
      } as any);
      coreDataSource.getRepository.mockReturnValue({
        update: jest.fn().mockResolvedValue({ affected: 1 }),
      });

      await service.initPermissionsForSidWorkspace({
        workspaceId,
        userId,
        workspaceCustomFlatApplication,
      });

      expect(
        userRoleService.assignRoleToManyUserWorkspace,
      ).toHaveBeenCalledWith({
        workspaceId,
        userWorkspaceIds: [userWorkspaceId],
        roleId: adminRoleId,
      });
    });

    it('should not upsert ObjectPermission for admin role (system role is not editable)', async () => {
      roleRepository.findOne.mockResolvedValue({
        id: adminRoleId,
        workspaceId,
      } as RoleEntity);
      objectMetadataRepository.find.mockResolvedValue(
        sidObjectMocks as ObjectMetadataEntity[],
      );
      userWorkspaceRepository.findOneOrFail.mockResolvedValue({
        id: userWorkspaceId,
      } as UserWorkspaceEntity);
      roleService.createMemberRole.mockResolvedValue({
        id: memberRoleId,
      } as any);
      coreDataSource.getRepository.mockReturnValue({
        update: jest.fn().mockResolvedValue({ affected: 1 }),
      });

      await service.initPermissionsForSidWorkspace({
        workspaceId,
        userId,
        workspaceCustomFlatApplication,
      });

      const upsertCalls =
        objectPermissionService.upsertObjectPermissions.mock.calls;
      expect(upsertCalls.every((call) => call[0].input.roleId !== adminRoleId))
        .toBe(true);
    });

    it('should create member role via RoleService.createMemberRole', async () => {
      roleRepository.findOne.mockResolvedValue({
        id: adminRoleId,
        workspaceId,
      } as RoleEntity);
      objectMetadataRepository.find.mockResolvedValue(
        sidObjectMocks as ObjectMetadataEntity[],
      );
      userWorkspaceRepository.findOneOrFail.mockResolvedValue({
        id: userWorkspaceId,
      } as UserWorkspaceEntity);
      roleService.createMemberRole.mockResolvedValue({
        id: memberRoleId,
      } as any);
      coreDataSource.getRepository.mockReturnValue({
        update: jest.fn().mockResolvedValue({ affected: 1 }),
      });

      await service.initPermissionsForSidWorkspace({
        workspaceId,
        userId,
        workspaceCustomFlatApplication,
      });

      expect(roleService.createMemberRole).toHaveBeenCalledWith({
        workspaceId,
        ownerFlatApplication: workspaceCustomFlatApplication,
      });
    });

    it('should upsert ObjectPermission for member role on all 9 SID objects with full CRUD', async () => {
      roleRepository.findOne.mockResolvedValue({
        id: adminRoleId,
        workspaceId,
      } as RoleEntity);
      objectMetadataRepository.find.mockResolvedValue(
        sidObjectMocks as ObjectMetadataEntity[],
      );
      userWorkspaceRepository.findOneOrFail.mockResolvedValue({
        id: userWorkspaceId,
      } as UserWorkspaceEntity);
      roleService.createMemberRole.mockResolvedValue({
        id: memberRoleId,
      } as any);
      coreDataSource.getRepository.mockReturnValue({
        update: jest.fn().mockResolvedValue({ affected: 1 }),
      });

      await service.initPermissionsForSidWorkspace({
        workspaceId,
        userId,
        workspaceCustomFlatApplication,
      });

      expect(
        objectPermissionService.upsertObjectPermissions,
      ).toHaveBeenCalledTimes(1);

      const memberCall =
        objectPermissionService.upsertObjectPermissions.mock.calls[0][0];
      expect(memberCall.workspaceId).toBe(workspaceId);
      expect(memberCall.input.roleId).toBe(memberRoleId);
      expect(memberCall.input.objectPermissions).toHaveLength(9);
      memberCall.input.objectPermissions.forEach((perm: any) => {
        expect(perm.canReadObjectRecords).toBe(true);
        expect(perm.canUpdateObjectRecords).toBe(true);
        expect(perm.canSoftDeleteObjectRecords).toBe(true);
        expect(perm.canDestroyObjectRecords).toBe(true);
      });
    });

    it('should set defaultRoleId + activationStatus ACTIVE on workspace', async () => {
      roleRepository.findOne.mockResolvedValue({
        id: adminRoleId,
        workspaceId,
      } as RoleEntity);
      objectMetadataRepository.find.mockResolvedValue(
        sidObjectMocks as ObjectMetadataEntity[],
      );
      userWorkspaceRepository.findOneOrFail.mockResolvedValue({
        id: userWorkspaceId,
      } as UserWorkspaceEntity);
      roleService.createMemberRole.mockResolvedValue({
        id: memberRoleId,
      } as any);

      const updateMock = jest.fn().mockResolvedValue({ affected: 1 });
      coreDataSource.getRepository.mockReturnValue({
        update: updateMock,
      });

      await service.initPermissionsForSidWorkspace({
        workspaceId,
        userId,
        workspaceCustomFlatApplication,
      });

      expect(coreDataSource.getRepository).toHaveBeenCalledWith(
        WorkspaceEntity,
      );
      expect(updateMock).toHaveBeenCalledWith(workspaceId, {
        defaultRoleId: memberRoleId,
        activationStatus: WorkspaceActivationStatus.ACTIVE,
      });
    });

    it('should return the created member role', async () => {
      roleRepository.findOne.mockResolvedValue({
        id: adminRoleId,
        workspaceId,
      } as RoleEntity);
      objectMetadataRepository.find.mockResolvedValue(
        sidObjectMocks as ObjectMetadataEntity[],
      );
      userWorkspaceRepository.findOneOrFail.mockResolvedValue({
        id: userWorkspaceId,
      } as UserWorkspaceEntity);
      const memberRoleMock = { id: memberRoleId, label: 'Member' } as any;
      roleService.createMemberRole.mockResolvedValue(memberRoleMock);
      coreDataSource.getRepository.mockReturnValue({
        update: jest.fn().mockResolvedValue({ affected: 1 }),
      });

      const result = await service.initPermissionsForSidWorkspace({
        workspaceId,
        userId,
        workspaceCustomFlatApplication,
      });

      expect(result).toEqual({ memberRole: memberRoleMock });
    });
  });
});

// Tipe helper untuk `jest.Mocked<Repository<T>>` (TypeORM)
type Repository<T> = {
  findOne: jest.Mock;
  find: jest.Mock;
  findOneOrFail: jest.Mock;
  update: jest.Mock;
} & T;
