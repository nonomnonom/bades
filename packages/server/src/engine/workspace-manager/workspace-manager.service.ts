import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { ApplicationService } from 'src/engine/core-modules/application/application.service';
import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { WorkspaceCacheStorageService } from 'src/engine/workspace-cache-storage/workspace-cache-storage.service';
import { WorkspaceDataSourceService } from 'src/engine/workspace-datasource/workspace-datasource.service';
import { BadesStandardApplicationService } from 'src/engine/workspace-manager/bades-standard-application/services/bades-standard-application.service';
import { SidStandardPermissionInitService } from 'src/engine/workspace-manager/sid-standard-seed/services/sid-standard-permission-init.service';
import { SidStandardSeedService } from 'src/engine/workspace-manager/sid-standard-seed/sid-standard-seed.service';

@Injectable()
export class WorkspaceManagerService {
  private readonly logger = new Logger(WorkspaceManagerService.name);

  constructor(
    private readonly workspaceDataSourceService: WorkspaceDataSourceService,
    private readonly badesStandardApplicationService: BadesStandardApplicationService,
    @InjectRepository(WorkspaceEntity)
    private readonly workspaceRepository: Repository<WorkspaceEntity>,
    private readonly applicationService: ApplicationService,
    private readonly sidStandardSeedService: SidStandardSeedService,
    private readonly sidStandardPermissionInitService: SidStandardPermissionInitService,
    private readonly workspaceCacheStorageService: WorkspaceCacheStorageService,
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

    // Simpan schemaName SESEGERA mungkin setelah schema dibuat agar tidak
    // orphaned jika proses seeding gagal di tengah jalan. Sebelumnya update
    // dilakukan setelah semua seeding selesai — jika crash di antara,
    // schema PostgreSQL sudah ada tapi workspace tidak tahu nama schema-nya.
    await this.workspaceRepository.update(workspaceId, {
      databaseSchema: schemaName,
    });

    const dataSourceMetadataCreationStart = performance.now();

    // synchronize + seeding SID standar dibungkus dalam try/catch agar
    // kegagalan satu langkah tidak silent-fail. Workspace yang partially-
    // seeded masih bisa di-recover lewat command `workspace:reseed:sid-standard`.
    // DDL (schema creation) sudah auto-commit sehingga transaksi penuh tidak
    // memungkinkan, tapi idempotensi tiap method seeding memastikan retry aman.
    try {
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

      // Tanam RELATION fields antar object SID standar.
      // Wajib dijalankan SETELAH seedSidStandardObjects (agar semua object
      // exist) dan SEBELUM seedSidStandardData (agar FK columns seperti
      // pendudukId, wilayahId, programBantuanId sudah ada di tabel fisik
      // sebelum INSERT data seed berjalan). Idempotent — field dengan nama
      // yang sama akan di-skip oleh createManyFields.
      const sidRelationResult =
        await this.sidStandardSeedService.seedSidStandardRelations({
          workspaceId,
        });

      this.logger.log(
        `Seed relation SID untuk workspace ${workspaceId}: ${sidRelationResult.createdRelations} relation, ${sidRelationResult.failedRelations} gagal`,
      );

      // Setelah metadata + table fisik + relasi FK dibuat, tanam sample
      // record contoh agar operator desa tidak melihat tabel kosong saat
      // pertama kali login.
      const sidDataResult =
        await this.sidStandardSeedService.seedSidStandardData({
          workspaceId,
          schemaName,
        });

      this.logger.log(
        `Seed data contoh SID untuk workspace ${workspaceId}: ${sidDataResult.insertedRecords} record`,
      );

      // Tampilan default tiap object SID dirapikan: field non-curated
      // disembunyikan agar tabel awal tidak overwhelming bagi operator desa.
      const sidViewResult =
        await this.sidStandardSeedService.seedSidStandardViewFields({
          workspaceId,
        });

      this.logger.log(
        `Rapikan view bawaan SID untuk workspace ${workspaceId}: ${sidViewResult.visibleFields} field visible, ${sidViewResult.hiddenFields} field tersembunyi`,
      );

      // Tanam MAP view untuk object SID yang punya field ADDRESS agar peta
      // bisa langsung diakses tanpa perlu membuat view manual di UI.
      const sidMapViewResult =
        await this.sidStandardSeedService.seedSidStandardMapViews({
          workspaceId,
        });

      this.logger.log(
        `Seed MAP view SID untuk workspace ${workspaceId}: ${sidMapViewResult.createdMapViews} view`,
      );

      const sidMapNavResult =
        await this.sidStandardSeedService.seedSidStandardMapViewNavigationMenuItems(
          {
            workspaceId,
          },
        );

      this.logger.log(
        `Seed navigasi Peta SID untuk workspace ${workspaceId}: ${sidMapNavResult.createdNavigationItems} item`,
      );

      // Tanam 3 dashboard contoh + 2 workflow contoh agar halaman Dashboard
      // dan Alur Kerja tidak kosong saat operator desa pertama kali login.
      const sidDashboardResult =
        await this.sidStandardSeedService.seedSidStandardDashboards({
          workspaceId,
          schemaName,
        });

      this.logger.log(
        `Seed dashboard SID untuk workspace ${workspaceId}: ${sidDashboardResult.insertedDashboards} dashboard`,
      );

      const sidWorkflowResult =
        await this.sidStandardSeedService.seedSidStandardWorkflows({
          workspaceId,
          schemaName,
        });

      this.logger.log(
        `Seed workflow SID untuk workspace ${workspaceId}: ${sidWorkflowResult.insertedWorkflows} workflow`,
      );
    } catch (error) {
      this.logger.error(
        `GAGAL seeding SID standard untuk workspace ${workspaceId} (schema: ${schemaName}): ${
          error instanceof Error ? error.message : String(error)
        }. Workspace berada dalam state partially-seeded — jalankan workspace:reseed:sid-standard untuk recovery.`,
      );
      throw error;
    }

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

    // Inisialisasi permission SID standard: assign admin ke user pertama,
    // upsert ObjectPermission untuk 9 object SID pada role admin + member,
    // set `defaultRoleId` dan `activationStatus: ACTIVE` di workspace.
    //
    // Sebelumnya logic ini hanya ada di `DevSeederPermissionsService` yang
    // hardcoded ke workspace dev, sehingga workspace production baru tidak
    // punya ACL eksplisit untuk 9 object SID. Service baru ini
    // workspace-agnostic dan aman dipanggil dari production path.
    await this.sidStandardPermissionInitService.initPermissionsForSidWorkspace({
      workspaceId,
      userId,
      workspaceCustomFlatApplication,
    });

    // Flush cache setelah semua seeding selesai agar metadata cache
    // tidak stale. Tanpa ini, operator desa mungkin melihat UI kosong
    // atau data usang saat pertama kali login.
    await this.workspaceCacheStorageService.flush(workspaceId, undefined);
  }
}
