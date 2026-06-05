import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserWorkspaceEntity } from 'src/engine/core-modules/user-workspace/user-workspace.entity';
import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { ObjectMetadataEntity } from 'src/engine/metadata-modules/object-metadata/object-metadata.entity';
import { ObjectPermissionModule } from 'src/engine/metadata-modules/object-permission/object-permission.module';
import { RoleEntity } from 'src/engine/metadata-modules/role/role.entity';
import { RoleModule } from 'src/engine/metadata-modules/role/role.module';
import { UserRoleModule } from 'src/engine/metadata-modules/user-role/user-role.module';
import { ApplicationModule } from 'src/engine/core-modules/application/application.module';
import { FieldMetadataModule } from 'src/engine/metadata-modules/field-metadata/field-metadata.module';
import { ObjectMetadataModule } from 'src/engine/metadata-modules/object-metadata/object-metadata.module';
import { SidStandardPermissionInitService } from 'src/engine/workspace-manager/sid-standard-seed/services/sid-standard-permission-init.service';
import { SidStandardSeedService } from 'src/engine/workspace-manager/sid-standard-seed/sid-standard-seed.service';

@Module({
  imports: [
    ObjectMetadataModule,
    FieldMetadataModule,
    ApplicationModule,
    // Modul-modul ini dibutuhkan oleh SidStandardPermissionInitService:
    // - RoleModule: menyediakan RoleService.createMemberRole
    // - UserRoleModule: menyediakan UserRoleService.assignRoleToManyUserWorkspace
    // - ObjectPermissionModule: menyediakan ObjectPermissionService.upsertObjectPermissions
    RoleModule,
    UserRoleModule,
    ObjectPermissionModule,
    // Akses DataSource untuk insert raw sample record ke workspace schema
    // dan untuk update workspace entity (activationStatus) di service init permission.
    // Repository di bawah dipakai untuk lookup role, object metadata, dan
    // userWorkspace saat inisialisasi permission.
    TypeOrmModule.forFeature([
      RoleEntity,
      ObjectMetadataEntity,
      UserWorkspaceEntity,
      WorkspaceEntity,
    ]),
  ],
  providers: [SidStandardSeedService, SidStandardPermissionInitService],
  exports: [SidStandardSeedService, SidStandardPermissionInitService],
})
export class SidStandardSeedModule {}
