import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';

import { WorkspaceActivationStatus } from 'shared/workspace';
import { DataSource, In, type Repository } from 'typeorm';

import { type FlatApplication } from 'src/engine/core-modules/application/types/flat-application.type';
import { UserWorkspaceEntity } from 'src/engine/core-modules/user-workspace/user-workspace.entity';
import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { ObjectMetadataEntity } from 'src/engine/metadata-modules/object-metadata/object-metadata.entity';
import { ObjectPermissionService } from 'src/engine/metadata-modules/object-permission/object-permission.service';
import { type RoleDTO } from 'src/engine/metadata-modules/role/dtos/role.dto';
import { RoleEntity } from 'src/engine/metadata-modules/role/role.entity';
import { RoleService } from 'src/engine/metadata-modules/role/role.service';
import { UserRoleService } from 'src/engine/metadata-modules/user-role/user-role.service';
import { STANDARD_ROLE } from 'src/engine/workspace-manager/bades-standard-application/constants/standard-role.constant';
import { SID_STANDARD_OBJECT_SEEDS } from 'src/engine/workspace-manager/sid-standard-seed/sid-standard-seed.config';

// Service workspace-agnostic untuk inisialisasi permission SID standard.
//
// Sebelumnya logic ini hanya ada di `DevSeederPermissionsService.initPermissions()`
// yang hardcoded ke workspace ID dev (`SEED_SUKAMAJU_WORKSPACE_ID` /
// `SEED_MEKARSARI_WORKSPACE_ID`). Akibatnya workspace production baru yang
// di-create lewat `activateWorkspace` mutation TIDAK punya:
//   - row `ObjectPermission` eksplisit untuk 9 object SID
//   - `activationStatus: ACTIVE` di workspace entity
//
// Service ini dipanggil dari `WorkspaceManagerService.init()` setelah
// `seedSidStandardWorkflows` selesai. Tidak mengubah `DevSeederPermissionsService`
// (dev seeder tetap punya logic khusus untuk Sukamaju non-light: guest role,
// limited role dengan penduduk/keluarga restrictions).
@Injectable()
export class SidStandardPermissionInitService {
  private readonly logger = new Logger(SidStandardPermissionInitService.name);

  // 9 nameSingular object SID standard yang harus dapat ObjectPermission row.
  // Sumber kebenaran: SID_STANDARD_OBJECT_SEEDS di sid-standard-seed.config.ts
  // (di-derive sekali di constructor untuk menghindari import cyclic).
  private readonly SID_OBJECT_NAME_SINGULAR: readonly string[];

  constructor(
    private readonly roleService: RoleService,
    private readonly userRoleService: UserRoleService,
    private readonly objectPermissionService: ObjectPermissionService,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    @InjectRepository(ObjectMetadataEntity)
    private readonly objectMetadataRepository: Repository<ObjectMetadataEntity>,
    @InjectRepository(UserWorkspaceEntity)
    private readonly userWorkspaceRepository: Repository<UserWorkspaceEntity>,
    @InjectDataSource()
    private readonly coreDataSource: DataSource,
  ) {
    this.SID_OBJECT_NAME_SINGULAR = SID_STANDARD_OBJECT_SEEDS.map(
      (seed) => seed.object.nameSingular,
    );
  }

  public async initPermissionsForSidWorkspace({
    workspaceId,
    userId,
    workspaceCustomFlatApplication,
  }: {
    workspaceId: string;
    userId: string;
    workspaceCustomFlatApplication: FlatApplication;
  }): Promise<{ memberRole: RoleDTO }> {
    // 1. Lookup admin role. Admin role dibuat oleh
    // `BadesStandardApplicationService.synchronizeBadesStandardApplicationOrThrow`
    // yang dipanggil sebelum service ini di `WorkspaceManagerService.init()`.
    const adminRole = await this.roleRepository.findOne({
      where: {
        universalIdentifier: STANDARD_ROLE.admin.universalIdentifier,
        workspaceId,
      },
    });

    if (!adminRole) {
      throw new Error(
        'Admin role tidak ditemukan untuk workspace SID standard. ' +
          'Pastikan BadesStandardApplicationService.synchronizeBadesStandardApplicationOrThrow sudah jalan.',
      );
    }

    // 2. Resolve 9 SID object metadata IDs. Pengecekan ketat: kalau ada
    // object yang hilang, seed dianggap tidak lengkap dan harus di-recover
    // lewat command `workspace:reseed:sid-standard` sebelum permission init.
    const sidObjects = await this.objectMetadataRepository.find({
      where: {
        workspaceId,
        nameSingular: In([...this.SID_OBJECT_NAME_SINGULAR]),
      },
    });

    if (sidObjects.length !== this.SID_OBJECT_NAME_SINGULAR.length) {
      const found = new Set(sidObjects.map((obj) => obj.nameSingular));
      const missing = this.SID_OBJECT_NAME_SINGULAR.filter(
        (n) => !found.has(n),
      );

      throw new Error(
        `SID object metadata tidak lengkap: ${missing.join(', ')}. ` +
          'Jalankan workspace:reseed:sid-standard untuk recovery.',
      );
    }

    // 3. Assign admin role ke userWorkspace pertama (user yang aktivasi).
    // Sama seperti logika di `setupDefaultRoles` lama.
    const userWorkspace = await this.userWorkspaceRepository.findOneOrFail({
      where: { workspaceId, userId },
    });

    await this.userRoleService.assignRoleToManyUserWorkspace({
      workspaceId,
      userWorkspaceIds: [userWorkspace.id],
      roleId: adminRole.id,
    });

    // 4. Upsert ObjectPermission untuk admin role di 9 SID objects (full CRUD).
    // Idempotent: kalau ObjectPermissionService sudah handle konsistensi
    // (validate read-before-write), dan workspaceMigrationValidateBuildAndRunService
    // skip kalau tidak ada diff.
    await this.objectPermissionService.upsertObjectPermissions({
      workspaceId,
      input: {
        roleId: adminRole.id,
        objectPermissions: sidObjects.map((obj) => ({
          objectMetadataId: obj.id,
          canReadObjectRecords: true,
          canUpdateObjectRecords: true,
          canSoftDeleteObjectRecords: true,
          canDestroyObjectRecords: true,
        })),
      },
    });

    // 5. Create member role via existing service. createMemberRole sudah
    // set `canReadAllObjectRecords: true, canUpdateAllObjectRecords: true,
    // canSoftDeleteAllObjectRecords: true, canDestroyAllObjectRecords: true`
    // di role-level flag (lihat role.service.ts:355-380). Upsert
    // ObjectPermission di langkah 6 hanya untuk defensive — kalau sistem
    // ACL Bades berubah, row eksplisit menangkap role yang hilang akses.
    const memberRole = await this.roleService.createMemberRole({
      workspaceId,
      ownerFlatApplication: workspaceCustomFlatApplication,
    });

    // 6. Upsert ObjectPermission untuk member role di 9 SID objects (full CRUD).
    await this.objectPermissionService.upsertObjectPermissions({
      workspaceId,
      input: {
        roleId: memberRole.id,
        objectPermissions: sidObjects.map((obj) => ({
          objectMetadataId: obj.id,
          canReadObjectRecords: true,
          canUpdateObjectRecords: true,
          canSoftDeleteObjectRecords: true,
          canDestroyObjectRecords: true,
        })),
      },
    });

    // 7. Set `defaultRoleId` + `activationStatus: ACTIVE` di workspace.
    // Sebelumnya `setupDefaultRoles` di `WorkspaceManagerService` TIDAK set
    // activationStatus — dianggap diurus di tempat lain (workspace.service.ts
    // activateAndInitializeUpgradeState). Disini kita set eksplisit sebagai
    // safety net biar workspace benar-benar aktif setelah permission init.
    await this.coreDataSource
      .getRepository(WorkspaceEntity)
      .update(workspaceId, {
        defaultRoleId: memberRole.id,
        activationStatus: WorkspaceActivationStatus.ACTIVE,
      });

    this.logger.log(
      `Permission SID standard initialized untuk workspace ${workspaceId}: ` +
        `9 objek, admin role + member role siap.`,
    );

    return { memberRole };
  }
}
