import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { ApplicationService } from 'src/engine/core-modules/application/application.service';
import { FlatApplication } from 'src/engine/core-modules/application/types/flat-application.type';
import { UserWorkspaceEntity } from 'src/engine/core-modules/user-workspace/user-workspace.entity';
import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { RoleEntity } from 'src/engine/metadata-modules/role/role.entity';
import { RoleService } from 'src/engine/metadata-modules/role/role.service';
import { UserRoleService } from 'src/engine/metadata-modules/user-role/user-role.service';
import { WorkspaceDataSourceService } from 'src/engine/workspace-datasource/workspace-datasource.service';
import { STANDARD_ROLE } from 'src/engine/workspace-manager/bades-standard-application/constants/standard-role.constant';
import { BadesStandardApplicationService } from 'src/engine/workspace-manager/bades-standard-application/services/bades-standard-application.service';
import { SidStandardSeedService } from 'src/engine/workspace-manager/sid-standard-seed/sid-standard-seed.service';

@Injectable()
export class WorkspaceManagerService {
  private readonly logger = new Logger(WorkspaceManagerService.name);

  constructor(
    private readonly workspaceDataSourceService: WorkspaceDataSourceService,
    @InjectRepository(UserWorkspaceEntity)
    private readonly userWorkspaceRepository: Repository<UserWorkspaceEntity>,
    private readonly roleService: RoleService,
    private readonly userRoleService: UserRoleService,
    private readonly badesStandardApplicationService: BadesStandardApplicationService,
    @InjectRepository(WorkspaceEntity)
    private readonly workspaceRepository: Repository<WorkspaceEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    private readonly applicationService: ApplicationService,
    private readonly sidStandardSeedService: SidStandardSeedService,
  ) {}

  public async init({
    workspace,
    userId,
  }: {
    workspace: WorkspaceEntity;
    userId: string;
  }): Promise<void> {
    const workspaceId = workspace.id;
    const schemaCreationStart = performance.now();
    const schemaName =
      await this.workspaceDataSourceService.createWorkspaceDBSchema(
        workspaceId,
      );

    const schemaCreationEnd = performance.now();

    this.logger.log(
      `Schema creation took ${schemaCreationEnd - schemaCreationStart}ms`,
    );

    const dataSourceMetadataCreationStart = performance.now();

    await this.workspaceRepository.update(workspaceId, {
      databaseSchema: schemaName,
    });

    await this.applicationService.createBadesStandardApplication({
      workspaceId,
    });

    await this.badesStandardApplicationService.synchronizeBadesStandardApplicationOrThrow(
      {
        workspaceId,
      },
    );

    // Bades SID standard seed: 9 objek desa (Penduduk, Keluarga, Wilayah,
    // Layanan, Surat, Perangkat Desa, Program Bantuan, Penerima Bantuan,
    // Aset Desa) di-tanam ke setiap workspace baru menggantikan defaults
    // CRM. Idempotent — aman kalau dipanggil ulang lewat upgrade command.
    const sidSeedResult =
      await this.sidStandardSeedService.seedSidStandardObjects({
        workspaceId,
      });

    this.logger.log(
      `Seed SID standard untuk workspace ${workspaceId}: ${sidSeedResult.createdObjects} objek, ${sidSeedResult.createdFields} field`,
    );

    // Setelah metadata + table fisik dibuat oleh workspace migration runner
    // (terpicu di dalam createManyFields), tanam sample record contoh agar
    // operator desa tidak melihat tabel kosong saat pertama kali login.
    const sidDataResult =
      await this.sidStandardSeedService.seedSidStandardData({
        workspaceId,
        schemaName,
      });

    this.logger.log(
      `Seed data contoh SID untuk workspace ${workspaceId}: ${sidDataResult.insertedRecords} record`,
    );

    const dataSourceMetadataCreationEnd = performance.now();

    this.logger.log(
      `Metadata creation took ${dataSourceMetadataCreationEnd - dataSourceMetadataCreationStart}ms`,
    );

    const { workspaceCustomFlatApplication } =
      await this.applicationService.findWorkspaceBadesStandardAndCustomApplicationOrThrow(
        {
          workspaceId,
        },
      );

    await this.setupDefaultRoles({
      workspaceId,
      userId,
      workspaceCustomFlatApplication,
    });
  }

  private async setupDefaultRoles({
    userId,
    workspaceId,
    workspaceCustomFlatApplication,
  }: {
    workspaceId: string;
    userId: string;
    workspaceCustomFlatApplication: FlatApplication;
  }): Promise<void> {
    const adminRole = await this.roleRepository.findOne({
      where: {
        universalIdentifier: STANDARD_ROLE.admin.universalIdentifier,
        workspaceId,
      },
    });

    if (adminRole) {
      const userWorkspace = await this.userWorkspaceRepository.findOneOrFail({
        where: { workspaceId, userId },
      });

      await this.userRoleService.assignRoleToManyUserWorkspace({
        workspaceId,
        userWorkspaceIds: [userWorkspace.id],
        roleId: adminRole.id,
      });
    }

    const memberRole = await this.roleService.createMemberRole({
      workspaceId,
      ownerFlatApplication: workspaceCustomFlatApplication,
    });

    await this.workspaceRepository.update(workspaceId, {
      defaultRoleId: memberRole.id,
    });
  }
}
