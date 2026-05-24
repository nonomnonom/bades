import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';

import { WorkspaceActivationStatus } from 'shared/workspace';
import { DataSource, Repository } from 'typeorm';

import { FlatApplication } from 'src/engine/core-modules/application/types/flat-application.type';
import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { ObjectMetadataEntity } from 'src/engine/metadata-modules/object-metadata/object-metadata.entity';
import { FieldPermissionService } from 'src/engine/metadata-modules/object-permission/field-permission/field-permission.service';
import { ObjectPermissionService } from 'src/engine/metadata-modules/object-permission/object-permission.service';
import { RoleTargetService } from 'src/engine/metadata-modules/role-target/services/role-target.service';
import { RoleDTO } from 'src/engine/metadata-modules/role/dtos/role.dto';
import { RoleEntity } from 'src/engine/metadata-modules/role/role.entity';
import { RoleService } from 'src/engine/metadata-modules/role/role.service';
import { UserRoleService } from 'src/engine/metadata-modules/user-role/user-role.service';
import {
  SEED_SUKAMAJU_WORKSPACE_ID,
  SEED_MEKARSARI_WORKSPACE_ID,
} from 'src/engine/workspace-manager/dev-seeder/core/constants/seeder-workspaces.constant';
import {
  RANDOM_USER_WORKSPACE_IDS,
  USER_WORKSPACE_DATA_SEED_IDS,
} from 'src/engine/workspace-manager/dev-seeder/core/utils/seed-user-workspaces.util';
import { API_KEY_DATA_SEED_IDS } from 'src/engine/workspace-manager/dev-seeder/data/constants/api-key-data-seeds.constant';
import { STANDARD_ROLE } from 'src/engine/workspace-manager/bades-standard-application/constants/standard-role.constant';

@Injectable()
export class DevSeederPermissionsService {
  private readonly logger = new Logger(DevSeederPermissionsService.name);

  constructor(
    private readonly roleService: RoleService,
    private readonly userRoleService: UserRoleService,
    private readonly objectPermissionService: ObjectPermissionService,
    @InjectRepository(ObjectMetadataEntity)
    private readonly objectMetadataRepository: Repository<ObjectMetadataEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    private readonly fieldPermissionService: FieldPermissionService,
    private readonly roleTargetService: RoleTargetService,
    @InjectDataSource()
    private readonly coreDataSource: DataSource,
  ) {}

  public async initPermissions({
    badesStandardFlatApplication,
    workspaceCustomFlatApplication,
    workspaceId,
    light = false,
  }: {
    workspaceId: string;
    badesStandardFlatApplication: FlatApplication;
    workspaceCustomFlatApplication: FlatApplication;
    light?: boolean;
  }) {
    const adminRole = await this.roleRepository.findOne({
      where: {
        universalIdentifier: STANDARD_ROLE.admin.universalIdentifier,
        workspaceId,
      },
    });

    if (!adminRole) {
      throw new Error(
        'Required roles not found. Make sure the permission sync has run.',
      );
    }

    await this.roleTargetService.create({
      createRoleTargetInput: {
        roleId: adminRole.id,
        targetId: API_KEY_DATA_SEED_IDS.ID_1,
        targetMetadataForeignKey: 'apiKeyId',
        applicationId: badesStandardFlatApplication.id,
      },
      workspaceId,
    });

    let adminUserWorkspaceId: string | undefined;
    let memberUserWorkspaceIds: string[] = [];
    let limitedUserWorkspaceId: string | undefined;
    let guestUserWorkspaceId: string | undefined;

    if (workspaceId === SEED_SUKAMAJU_WORKSPACE_ID) {
      if (light) {
        // In light mode, Tim is admin (prefilled login user needs full
        // access for SDK development). No demo permission roles needed.
        adminUserWorkspaceId = USER_WORKSPACE_DATA_SEED_IDS.KADES;
        memberUserWorkspaceIds = [
          USER_WORKSPACE_DATA_SEED_IDS.KASI,
          USER_WORKSPACE_DATA_SEED_IDS.SEKDES,
          USER_WORKSPACE_DATA_SEED_IDS.KAUR,
          ...Object.values(RANDOM_USER_WORKSPACE_IDS),
        ];
      } else {
        adminUserWorkspaceId = USER_WORKSPACE_DATA_SEED_IDS.KASI;
        limitedUserWorkspaceId = USER_WORKSPACE_DATA_SEED_IDS.KADES;
        guestUserWorkspaceId = USER_WORKSPACE_DATA_SEED_IDS.KAUR;
        memberUserWorkspaceIds = [
          USER_WORKSPACE_DATA_SEED_IDS.SEKDES,
          ...Object.values(RANDOM_USER_WORKSPACE_IDS),
        ];

        const guestRole = await this.roleService.createGuestRole({
          workspaceId,
          ownerFlatApplication: workspaceCustomFlatApplication,
        });

        await this.userRoleService.assignRoleToManyUserWorkspace({
          workspaceId,
          userWorkspaceIds: [guestUserWorkspaceId],
          roleId: guestRole.id,
        });

        // The limited role restricts access to Pet and Rocket objects,
        // which are only created in full (non-light) mode
        const limitedRole = await this.createLimitedRoleForSeedWorkspace({
          workspaceId,
          ownerFlatApplication: workspaceCustomFlatApplication,
        });

        await this.userRoleService.assignRoleToManyUserWorkspace({
          workspaceId,
          userWorkspaceIds: [limitedUserWorkspaceId],
          roleId: limitedRole.id,
        });
      }
    } else if (workspaceId === SEED_MEKARSARI_WORKSPACE_ID) {
      adminUserWorkspaceId = USER_WORKSPACE_DATA_SEED_IDS.KADES_ACME;
      memberUserWorkspaceIds = [
        USER_WORKSPACE_DATA_SEED_IDS.SEKDES_ACME,
        USER_WORKSPACE_DATA_SEED_IDS.KASI_ACME,
        USER_WORKSPACE_DATA_SEED_IDS.KAUR_ACME,
      ];
    }

    if (!adminUserWorkspaceId) {
      throw new Error(
        'Should never occur, no eligible user workspace for admin has been found',
      );
    }

    await this.userRoleService.assignRoleToManyUserWorkspace({
      workspaceId,
      userWorkspaceIds: [adminUserWorkspaceId],
      roleId: adminRole.id,
    });

    const memberRole = await this.initMinimalPermissionsAndActivateWorkspace({
      workspaceId,
      workspaceCustomFlatApplication,
    });

    if (memberUserWorkspaceIds.length > 0) {
      await this.userRoleService.assignRoleToManyUserWorkspace({
        workspaceId,
        userWorkspaceIds: memberUserWorkspaceIds,
        roleId: memberRole.id,
      });
    }
  }

  public async initMinimalPermissionsAndActivateWorkspace({
    workspaceId,
    workspaceCustomFlatApplication,
  }: {
    workspaceId: string;
    workspaceCustomFlatApplication: FlatApplication;
  }): Promise<RoleDTO> {
    const memberRole = await this.roleService.createMemberRole({
      workspaceId,
      ownerFlatApplication: workspaceCustomFlatApplication,
    });

    await this.coreDataSource
      .getRepository(WorkspaceEntity)
      .update(workspaceId, {
        defaultRoleId: memberRole.id,
        activationStatus: WorkspaceActivationStatus.ACTIVE,
      });

    return memberRole;
  }

  private async createLimitedRoleForSeedWorkspace({
    ownerFlatApplication,
    workspaceId,
  }: {
    workspaceId: string;
    ownerFlatApplication: FlatApplication;
  }) {
    const customRole = await this.roleService.createRole({
      ownerFlatApplication,
      workspaceId,
      input: {
        label: 'Dibatasi-Objek',
        description: 'Semua izin kecuali baca Keluarga dan ubah Penduduk',
        icon: 'custom',
        canUpdateAllSettings: true,
        canAccessAllTools: true,
        canReadAllObjectRecords: true,
        canUpdateAllObjectRecords: true,
        canSoftDeleteAllObjectRecords: true,
        canDestroyAllObjectRecords: true,
      },
    });

    const pendudukObjectMetadata =
      await this.objectMetadataRepository.findOneOrFail({
        where: {
          nameSingular: 'penduduk',
          workspaceId,
        },
      });

    const keluargaObjectMetadata =
      await this.objectMetadataRepository.findOneOrFail({
        where: {
          nameSingular: 'keluarga',
          workspaceId,
        },
      });

    const personObjectMetadata =
      await this.objectMetadataRepository.findOneOrFail({
        where: {
          nameSingular: 'person',
          workspaceId,
        },
        relations: {
          fields: true,
        },
      });

    const companyObjectMetadata =
      await this.objectMetadataRepository.findOneOrFail({
        where: {
          nameSingular: 'company',
          workspaceId,
        },
        relations: {
          fields: true,
        },
      });

    await this.objectPermissionService.upsertObjectPermissions({
      workspaceId,
      input: {
        roleId: customRole.id,
        objectPermissions: [
          {
            objectMetadataId: pendudukObjectMetadata.id,
            canReadObjectRecords: true,
            canUpdateObjectRecords: false,
            canSoftDeleteObjectRecords: false,
            canDestroyObjectRecords: false,
          },
          {
            objectMetadataId: keluargaObjectMetadata.id,
            canReadObjectRecords: false,
            canUpdateObjectRecords: false,
            canSoftDeleteObjectRecords: false,
            canDestroyObjectRecords: false,
          },
        ],
      },
    });

    const personCityFieldMetadata = personObjectMetadata.fields.find(
      (field) => field.name === 'city',
    );

    if (!personCityFieldMetadata) {
      throw new Error('Metadata kolom kota شخص tidak ditemukan');
    }

    const companyLinkedinLinkFieldMetadata = companyObjectMetadata.fields.find(
      (field) => field.name === 'linkedinLink',
    );

    if (!companyLinkedinLinkFieldMetadata) {
      throw new Error('Metadata kolom link linkedin perusahaan tidak ditemukan');
    }

    const readOnlyOnPersonCityFieldPermission = {
      objectMetadataId: personObjectMetadata.id,
      fieldMetadataId: personCityFieldMetadata.id,
      canReadFieldValue: null,
      canUpdateFieldValue: false,
    };

    const noReadOnCompanyLinkedinLinkFieldPermission = {
      objectMetadataId: companyObjectMetadata.id,
      fieldMetadataId: companyLinkedinLinkFieldMetadata.id,
      canReadFieldValue: false,
      canUpdateFieldValue: false,
    };

    await this.fieldPermissionService.upsertFieldPermissions({
      workspaceId,
      input: {
        roleId: customRole.id,
        fieldPermissions: [
          readOnlyOnPersonCityFieldPermission,
          noReadOnCompanyLinkedinLinkFieldPermission,
        ],
      },
    });

    return customRole;
  }
}
