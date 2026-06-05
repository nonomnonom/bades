import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApplicationModule } from 'src/engine/core-modules/application/application.module';
import { FeatureFlagModule } from 'src/engine/core-modules/feature-flag/feature-flag.module';
import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { AiAgentModule } from 'src/engine/metadata-modules/ai/ai-agent/ai-agent.module';
import { FieldMetadataEntity } from 'src/engine/metadata-modules/field-metadata/field-metadata.entity';
import { WorkspaceManyOrAllFlatEntityMapsCacheModule } from 'src/engine/metadata-modules/flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.module';
import { LogicFunctionEntity } from 'src/engine/metadata-modules/logic-function/logic-function.entity';
import { ObjectMetadataModule } from 'src/engine/metadata-modules/object-metadata/object-metadata.module';
import { PermissionsModule } from 'src/engine/metadata-modules/permissions/permissions.module';
import { RoleTargetEntity } from 'src/engine/metadata-modules/role-target/role-target.entity';
import { RoleEntity } from 'src/engine/metadata-modules/role/role.entity';
import { RoleModule } from 'src/engine/metadata-modules/role/role.module';
import { UserRoleModule } from 'src/engine/metadata-modules/user-role/user-role.module';
import { WorkspaceDataSourceModule } from 'src/engine/workspace-datasource/workspace-datasource.module';
import { WorkspaceCacheStorageModule } from 'src/engine/workspace-cache-storage/workspace-cache-storage.module';
import { DevSeederModule } from 'src/engine/workspace-manager/dev-seeder/dev-seeder.module';
import { BadesStandardApplicationModule } from 'src/engine/workspace-manager/bades-standard-application/bades-standard-application.module';
import { SidStandardSeedModule } from 'src/engine/workspace-manager/sid-standard-seed/sid-standard-seed.module';
import { WorkspaceMigrationModule } from 'src/engine/workspace-manager/workspace-migration/workspace-migration.module';

import { WorkspaceManagerService } from './workspace-manager.service';

@Module({
  imports: [
    WorkspaceDataSourceModule,
    WorkspaceMigrationModule,
    ObjectMetadataModule,
    DevSeederModule,
    FeatureFlagModule,
    PermissionsModule,
    AiAgentModule,
    BadesStandardApplicationModule,
    // SidStandardSeedModule sekarang mengekspor SidStandardPermissionInitService
    // yang dipakai oleh WorkspaceManagerService.init() untuk inisialisasi
    // permission SID standard (admin + member role + ObjectPermission untuk
    // 9 object SID + activationStatus: ACTIVE).
    SidStandardSeedModule,
    WorkspaceManyOrAllFlatEntityMapsCacheModule,
    WorkspaceCacheStorageModule,
    // Repository untuk WorkspaceEntity dipakai di init() (simpan schemaName
    // segera setelah schema dibuat) dan sebelumnya juga untuk activationStatus
    // (logika activationStatus sekarang pindah ke SidStandardPermissionInitService
    // tapi repository tetap dipakai).
    TypeOrmModule.forFeature([WorkspaceEntity]),
    RoleModule,
    UserRoleModule,
    ApplicationModule,
    TypeOrmModule.forFeature([
      FieldMetadataEntity,
      RoleTargetEntity,
      RoleEntity,
      LogicFunctionEntity,
    ]),
  ],
  exports: [WorkspaceManagerService],
  providers: [WorkspaceManagerService],
})
export class WorkspaceManagerModule {}
