import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

import { DataSource } from 'typeorm';

import { isDefined } from 'shared/utils';

import { ApplicationService } from 'src/engine/core-modules/application/application.service';
import { FieldMetadataService } from 'src/engine/metadata-modules/field-metadata/services/field-metadata.service';
import { ObjectMetadataService } from 'src/engine/metadata-modules/object-metadata/object-metadata.service';
import { SID_STANDARD_DATA_SEEDS } from 'src/engine/workspace-manager/sid-standard-seed/sid-standard-seed-data.constant';
import { SID_STANDARD_VIEW_CONFIGS } from 'src/engine/workspace-manager/sid-standard-seed/sid-standard-seed-view.constant';
import { SID_STANDARD_OBJECT_SEEDS } from 'src/engine/workspace-manager/sid-standard-seed/sid-standard-seed.config';

// Seed 9 objek SID standar Bades (Penduduk, Keluarga, Wilayah, Layanan,
// Surat, Perangkat Desa, Program Bantuan, Penerima Bantuan, Aset Desa) +
// sample record minimal ke setiap workspace baru.
//
// Berbeda dari `DevSeederMetadataService` yang dipakai untuk workspace dev
// `sukamaju`/`mekarsari`, service ini:
//   - tidak hardcode workspace ID,
//   - idempotent (skip object/field/record yang sudah ada),
//   - aman dipanggil dari workspace creation flow dan upgrade command.
@Injectable()
export class SidStandardSeedService {
  private readonly logger = new Logger(SidStandardSeedService.name);

  constructor(
    private readonly objectMetadataService: ObjectMetadataService,
    private readonly fieldMetadataService: FieldMetadataService,
    private readonly applicationService: ApplicationService,
    @InjectDataSource()
    private readonly coreDataSource: DataSource,
  ) {}

  async seedSidStandardObjects({
    workspaceId,
  }: {
    workspaceId: string;
  }): Promise<{ createdObjects: number; createdFields: number }> {
    let createdObjects = 0;
    let createdFields = 0;

    // Resolve Bades Standard Application sekali di awal supaya semua objek
    // SID yang dibuat di-tag sebagai bagian dari aplikasi STANDAR (bukan
    // custom application workspace). Tanpa ini, objek muncul sebagai
    // "Kustom" di UI Settings → Objek.
    const { badesStandardFlatApplication } =
      await this.applicationService.findWorkspaceBadesStandardAndCustomApplicationOrThrow(
        { workspaceId },
      );

    for (const { object, fields } of SID_STANDARD_OBJECT_SEEDS) {
      const existing = await this.objectMetadataService.findOneWithinWorkspace(
        workspaceId,
        {
          where: { nameSingular: object.nameSingular },
        },
      );

      let objectMetadataId: string;

      if (isDefined(existing)) {
        this.logger.log(
          `Objek SID '${object.nameSingular}' sudah ada di workspace ${workspaceId} — skip create`,
        );
        objectMetadataId = existing.id;
      } else {
        const created = await this.objectMetadataService.createOneObject({
          createObjectInput: object,
          workspaceId,
          ownerFlatApplication: badesStandardFlatApplication,
        });
        objectMetadataId = created.id;
        createdObjects += 1;
        this.logger.log(
          `Objek SID '${object.nameSingular}' dibuat di workspace ${workspaceId} (standard application)`,
        );
      }

      // Field metadata: createMany sudah idempotent untuk nama field yang
      // sama via unique constraint. Tapi kita tetap filter manual supaya
      // tidak spam error log.
      const existingFieldNames = new Set(
        existing?.fields?.map((field) => field.name) ?? [],
      );
      const fieldsToCreate = fields
        .filter((field) => !existingFieldNames.has(field.name))
        .map((field) => ({
          ...field,
          objectMetadataId,
        }));

      if (fieldsToCreate.length > 0) {
        try {
          await this.fieldMetadataService.createManyFields({
            createFieldInputs: fieldsToCreate,
            workspaceId,
          });
          createdFields += fieldsToCreate.length;
          this.logger.log(
            `${fieldsToCreate.length} field SID ditambahkan ke '${object.nameSingular}' (workspace ${workspaceId})`,
          );

          // Backfill viewField ke default list view (key = INDEX) untuk
          // custom fields yang baru ditambah. Engine hanya membuat viewField
          // berdasarkan fields yang ADA saat createOneObject — custom fields
          // yang ditambah sesudah itu tidak otomatis masuk ke view default.
          await this.backfillViewFieldsForNewFields({
            workspaceId,
            objectNameSingular: object.nameSingular,
            fieldNames: fieldsToCreate.map((f) => f.name),
          });
        } catch (error) {
          // Beberapa field yang sudah ada akan throw — log lalu lanjut ke
          // object berikutnya, jangan rollback object yang sudah berhasil.
          this.logger.warn(
            `Gagal seed sebagian field untuk '${object.nameSingular}' di workspace ${workspaceId}: ${
              error instanceof Error ? error.message : String(error)
            }`,
          );
        }
      }

      // Set label identifier dan image identifier setelah semua field tersedia.
      // Dipanggil baik untuk objek baru maupun existing supaya idempotent —
      // updateOneObject sudah idempotent jika nilai tidak berubah.
      if (isDefined(object.labelIdentifierFieldName)) {
        await this.applyLabelIdentifier({
          workspaceId,
          objectMetadataNameSingular: object.nameSingular,
          labelIdentifierFieldName: object.labelIdentifierFieldName,
        });
      }

      if (isDefined(object.imageIdentifierFieldName)) {
        await this.applyImageIdentifier({
          workspaceId,
          objectMetadataNameSingular: object.nameSingular,
          imageIdentifierFieldName: object.imageIdentifierFieldName,
        });
      }
    }

    return { createdObjects, createdFields };
  }

  // Set labelIdentifierFieldMetadataId ke field dengan nama yang ditentukan.
  // Setelah update ini, engine secara otomatis recompute searchVector untuk
  // object tersebut (via recomputeSearchVectorFieldAfterLabelIdentifierUpdate).
  private async applyLabelIdentifier({
    workspaceId,
    objectMetadataNameSingular,
    labelIdentifierFieldName,
  }: {
    workspaceId: string;
    objectMetadataNameSingular: string;
    labelIdentifierFieldName: string;
  }): Promise<void> {
    const objectMetadata =
      await this.objectMetadataService.findOneWithinWorkspace(workspaceId, {
        where: { nameSingular: objectMetadataNameSingular },
        relations: ['fields'],
      });

    if (!isDefined(objectMetadata)) {
      this.logger.warn(
        `applyLabelIdentifier: object tidak ditemukan: ${objectMetadataNameSingular}`,
      );

      return;
    }

    const targetField = objectMetadata.fields?.find(
      (f) => f.name === labelIdentifierFieldName,
    );

    if (!isDefined(targetField)) {
      this.logger.warn(
        `applyLabelIdentifier: field tidak ditemukan: ${objectMetadataNameSingular}.${labelIdentifierFieldName}`,
      );

      return;
    }

    // Skip jika sudah di-set ke field yang sama
    if (objectMetadata.labelIdentifierFieldMetadataId === targetField.id) {
      return;
    }

    // Bypass sanitizer service: SID object dibuat lewat standard application
    // sehingga engine menolak edit labelIdentifierFieldMetadataId via service.
    // Direct UPDATE konsisten dengan cara engine men-set field ini untuk
    // standard object bawaan.
    try {
      await this.coreDataSource.query(
        `UPDATE core."objectMetadata"
         SET "labelIdentifierFieldMetadataId" = $1
         WHERE id = $2 AND "workspaceId" = $3`,
        [targetField.id, objectMetadata.id, workspaceId],
      );
    } catch (error) {
      this.logger.warn(
        `applyLabelIdentifier: gagal update ${objectMetadataNameSingular}: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }

  // Set imageIdentifierFieldMetadataId ke field dengan nama yang ditentukan.
  // Field harus bertipe LINKS atau FILE supaya engine bisa render avatar.
  private async applyImageIdentifier({
    workspaceId,
    objectMetadataNameSingular,
    imageIdentifierFieldName,
  }: {
    workspaceId: string;
    objectMetadataNameSingular: string;
    imageIdentifierFieldName: string;
  }): Promise<void> {
    const objectMetadata =
      await this.objectMetadataService.findOneWithinWorkspace(workspaceId, {
        where: { nameSingular: objectMetadataNameSingular },
        relations: ['fields'],
      });

    if (!isDefined(objectMetadata)) {
      this.logger.warn(
        `applyImageIdentifier: object tidak ditemukan: ${objectMetadataNameSingular}`,
      );

      return;
    }

    const targetField = objectMetadata.fields?.find(
      (f) => f.name === imageIdentifierFieldName,
    );

    if (!isDefined(targetField)) {
      this.logger.warn(
        `applyImageIdentifier: field tidak ditemukan: ${objectMetadataNameSingular}.${imageIdentifierFieldName}`,
      );

      return;
    }

    // Skip jika sudah di-set ke field yang sama
    if (objectMetadata.imageIdentifierFieldMetadataId === targetField.id) {
      return;
    }

    try {
      await this.coreDataSource.query(
        `UPDATE core."objectMetadata"
         SET "imageIdentifierFieldMetadataId" = $1
         WHERE id = $2 AND "workspaceId" = $3`,
        [targetField.id, objectMetadata.id, workspaceId],
      );
    } catch (error) {
      this.logger.warn(
        `applyImageIdentifier: gagal update ${objectMetadataNameSingular}: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }

  // Tanam sample record minimal ke schema workspace. Idempotent via
  // `ON CONFLICT (id) DO NOTHING` — aman dipanggil ulang.
  //
  // Catatan: dipanggil setelah `seedSidStandardObjects` dan setelah workspace
  // migration runner men-create table fisik di schema (`_penduduk`,
  // `_keluarga`, dst). Kalau dipanggil sebelum tabel ada, blok try/catch akan
  // log warn dan lanjut tanpa break workspace creation.
  async seedSidStandardData({
    workspaceId,
    schemaName,
  }: {
    workspaceId: string;
    schemaName: string;
  }): Promise<{ insertedRecords: number }> {
    let insertedRecords = 0;

    for (const { tableName, columns, rows } of SID_STANDARD_DATA_SEEDS) {
      if (rows.length === 0) {
        continue;
      }

      const quotedColumns = columns.map((c) => `"${c}"`).join(', ');
      const placeholderGroups: string[] = [];
      const params: unknown[] = [];
      let paramIndex = 1;

      for (const row of rows) {
        const rowPlaceholders: string[] = [];

        for (const col of columns) {
          rowPlaceholders.push(`$${paramIndex}`);
          params.push(row[col] ?? null);
          paramIndex += 1;
        }
        placeholderGroups.push(`(${rowPlaceholders.join(', ')})`);
      }

      // RETURNING id supaya `result.length` mencerminkan jumlah row yang
      // benar-benar ter-insert (ON CONFLICT DO NOTHING tidak return row yang
      // konflik). Tanpa RETURNING, TypeORM mengembalikan array kosong.
      const sql = `INSERT INTO "${schemaName}"."${tableName}" (${quotedColumns}) VALUES ${placeholderGroups.join(', ')} ON CONFLICT (id) DO NOTHING RETURNING id`;

      try {
        const result = await this.coreDataSource.query(sql, params);
        const affected = Array.isArray(result) ? result.length : 0;

        insertedRecords += affected;
        this.logger.log(
          `Seed ${affected} record contoh ke '${schemaName}.${tableName}' (workspace ${workspaceId})`,
        );
      } catch (error) {
        this.logger.warn(
          `Gagal seed data contoh ke '${schemaName}.${tableName}' (workspace ${workspaceId}): ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
      }
    }

    return { insertedRecords };
  }

  // Sembunyikan field non-curated dari view default tiap object SID via raw
  // UPDATE ke `core.viewField`. Engine sudah auto-create default view dengan
  // SEMUA field visible saat object dibuat; tujuan method ini hanya
  // memendekkan daftar kolom awal supaya operator desa tidak kewalahan.
  //
  // Workspace baru = belum ada user yang melihat view, jadi raw UPDATE aman
  // tanpa invalidate cache. Operator bisa menampilkan kembali field yang
  // disembunyikan lewat menu kolom di UI.
  async seedSidStandardViewFields({
    workspaceId,
  }: {
    workspaceId: string;
  }): Promise<{ hiddenFields: number }> {
    let hiddenFields = 0;

    for (const {
      objectNameSingular,
      visibleFieldNames,
    } of SID_STANDARD_VIEW_CONFIGS) {
      try {
        const sql = `
          UPDATE core."viewField"
          SET "isVisible" = false
          WHERE "workspaceId" = $1
            AND "viewId" IN (
              SELECT v.id
              FROM core."view" v
              JOIN core."objectMetadata" om ON om.id = v."objectMetadataId"
              WHERE om."workspaceId" = $1
                AND om."nameSingular" = $2
            )
            AND "fieldMetadataId" NOT IN (
              SELECT fm.id
              FROM core."fieldMetadata" fm
              JOIN core."objectMetadata" om ON om.id = fm."objectMetadataId"
              WHERE om."workspaceId" = $1
                AND om."nameSingular" = $2
                AND fm.name = ANY($3::text[])
            )
        `;
        const result = await this.coreDataSource.query(sql, [
          workspaceId,
          objectNameSingular,
          visibleFieldNames,
        ]);
        // result[1] = jumlah row terpengaruh (TypeORM raw result format).
        const affected = Array.isArray(result) && result[1] ? result[1] : 0;

        hiddenFields += affected;
        if (affected > 0) {
          this.logger.log(
            `View bawaan '${objectNameSingular}': sembunyikan ${affected} field non-curated (workspace ${workspaceId})`,
          );
        }
      } catch (error) {
        this.logger.warn(
          `Gagal sembunyikan field view bawaan '${objectNameSingular}' (workspace ${workspaceId}): ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
      }
    }

    return { hiddenFields };
  }

  // Tanam 3 dashboard contoh ke workspace baru. Dashboard menggunakan
  // workspaceMember pertama (berdasarkan createdAt ASC) sebagai actor, dan
  // pageLayoutId di-resolve dari `core."pageLayout"` berdasarkan
  // universalIdentifier standar (`STANDARD_DASHBOARD_PAGE_LAYOUT_CONFIG`).
  //
  // Idempotent: ON CONFLICT (id) DO NOTHING.
  async seedSidStandardDashboards({
    workspaceId,
    schemaName,
  }: {
    workspaceId: string;
    schemaName: string;
  }): Promise<{ insertedDashboards: number }> {
    // Resolve workspaceMember pertama sebagai actor audit.
    // workspaceMember ada di SCHEMA workspace (BUKAN core), dan nama
    // adalah composite FULL_NAME (nameFirstName + nameLastName), bukan
    // kolom `name` flat.
    const memberRows: {
      id: string;
      nameFirstName: string | null;
      nameLastName: string | null;
    }[] = await this.coreDataSource.query(
      `SELECT id, "nameFirstName", "nameLastName" FROM "${schemaName}"."workspaceMember" ORDER BY "createdAt" ASC LIMIT 1`,
    );

    const memberId: string | null =
      memberRows.length > 0 ? memberRows[0].id : null;
    const memberName: string =
      memberRows.length > 0
        ? `${memberRows[0].nameFirstName ?? ''} ${memberRows[0].nameLastName ?? ''}`.trim() ||
          'Sistem'
        : 'Sistem';

    // Resolve pageLayoutId dari universalIdentifier standard dashboard
    // `STANDARD_DASHBOARD_PAGE_LAYOUT_CONFIG.universalIdentifier`
    const standardDashboardUniversalIdentifier =
      '20202020-d001-4d01-8d01-da5ab0a00001';
    const pageLayoutRows: { id: string }[] = await this.coreDataSource.query(
      `SELECT id FROM core."pageLayout" WHERE "workspaceId" = $1 AND "universalIdentifier" = $2 LIMIT 1`,
      [workspaceId, standardDashboardUniversalIdentifier],
    );
    const pageLayoutId: string | null =
      pageLayoutRows.length > 0 ? pageLayoutRows[0].id : null;

    // 3 dashboard seed — prefix namespace `30303030-0009-...`
    const dashboards: Array<{
      id: string;
      title: string;
      position: number;
    }> = [
      {
        id: '30303030-0009-4000-8000-000000000001',
        title: 'Ringkasan Desa',
        position: 0,
      },
      {
        id: '30303030-0009-4000-8000-000000000002',
        title: 'Layanan Surat',
        position: 1,
      },
      {
        id: '30303030-0009-4000-8000-000000000003',
        title: 'Program Bantuan',
        position: 2,
      },
    ];

    let insertedDashboards = 0;

    for (const dash of dashboards) {
      try {
        const sql = `
          INSERT INTO "${schemaName}"."dashboard"
            (id, title, "pageLayoutId", "createdBySource", "createdByWorkspaceMemberId",
             "createdByName", "updatedBySource", "updatedByWorkspaceMemberId",
             "updatedByName", position)
          VALUES ($1, $2, $3, 'MANUAL', $4, $5, 'MANUAL', $4, $5, $6)
          ON CONFLICT (id) DO NOTHING
          RETURNING id
        `;
        const result = await this.coreDataSource.query(sql, [
          dash.id,
          dash.title,
          pageLayoutId,
          memberId,
          memberName,
          dash.position,
        ]);
        const affected = Array.isArray(result) ? result.length : 0;

        insertedDashboards += affected;
        this.logger.log(
          `Dashboard '${dash.title}' disisipkan ke workspace ${workspaceId}`,
        );
      } catch (error) {
        this.logger.warn(
          `Gagal seed dashboard '${dash.title}' (workspace ${workspaceId}): ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
      }
    }

    return { insertedDashboards };
  }

  // Tanam 2 workflow contoh dalam status DRAFT ke workspace baru.
  // Status DRAFT dipilih supaya workflow tidak otomatis aktif dan tidak
  // memicu event saat signup. Operator desa bisa mengaktifkan secara manual
  // dari halaman Alur Kerja jika diperlukan.
  //
  // Tabel target: `schemaName."workflow"` dan `schemaName."workflowVersion"`.
  // Idempotent: ON CONFLICT (id) DO NOTHING.
  async seedSidStandardWorkflows({
    workspaceId,
    schemaName,
  }: {
    workspaceId: string;
    schemaName: string;
  }): Promise<{ insertedWorkflows: number }> {
    // workflow 1: Notifikasi Surat Selesai
    const WORKFLOW_SURAT_ID = '30303030-000a-4000-8000-000000000001';
    const WORKFLOW_SURAT_VERSION_ID = '30303030-000a-4000-8000-000000000011';

    // workflow 2: Cek Status Penerima Bantuan
    const WORKFLOW_BANTUAN_ID = '30303030-000a-4000-8000-000000000002';
    const WORKFLOW_BANTUAN_VERSION_ID = '30303030-000a-4000-8000-000000000012';

    const workflowSql = `
      INSERT INTO "${schemaName}"."workflow"
        (id, name, "lastPublishedVersionId", statuses, position,
         "createdBySource", "createdByWorkspaceMemberId", "createdByName",
         "updatedBySource", "updatedByWorkspaceMemberId", "updatedByName")
      VALUES
        ($1, $2, NULL, $3, $4, 'MANUAL', NULL, 'Sistem', 'MANUAL', NULL, 'Sistem'),
        ($5, $6, NULL, $7, $8, 'MANUAL', NULL, 'Sistem', 'MANUAL', NULL, 'Sistem')
      ON CONFLICT (id) DO NOTHING
    `;

    let insertedWorkflows = 0;

    try {
      await this.coreDataSource.query(workflowSql, [
        WORKFLOW_SURAT_ID,
        'Notifikasi Surat Selesai',
        ['DRAFT'],
        0,
        WORKFLOW_BANTUAN_ID,
        'Cek Status Penerima Bantuan',
        ['DRAFT'],
        1,
      ]);

      this.logger.log(
        `2 workflow contoh disisipkan ke workspace ${workspaceId}`,
      );
      insertedWorkflows += 2;
    } catch (error) {
      this.logger.warn(
        `Gagal seed workflow (workspace ${workspaceId}): ${
          error instanceof Error ? error.message : String(error)
        }`,
      );

      return { insertedWorkflows };
    }

    // Seed workflowVersion — satu version per workflow, status DRAFT,
    // trigger minimal agar UI Alur Kerja tidak menampilkan list kosong.
    // Steps dikosongkan (null) supaya tidak perlu meresolve objectMetadataId
    // dari SID custom object yang mungkin belum tersedia saat seed berjalan.
    const versionSql = `
      INSERT INTO "${schemaName}"."workflowVersion"
        (id, name, trigger, steps, status, position, "workflowId")
      VALUES
        ($1, $2, $3, NULL, 'DRAFT', $4, $5),
        ($6, $7, $8, NULL, 'DRAFT', $9, $10)
      ON CONFLICT (id) DO NOTHING
    `;

    try {
      const triggerSurat = JSON.stringify({
        name: 'Status berubah ke Selesai',
        type: 'DATABASE_EVENT',
        settings: {
          outputSchema: {},
          icon: 'IconMail',
          eventName: 'permohonanSurat.updated',
        },
        nextStepIds: [],
      });

      const triggerBantuan = JSON.stringify({
        name: 'Jalankan manual',
        type: 'MANUAL',
        settings: {
          outputSchema: {},
          icon: 'IconHandClick',
          availability: { type: 'GLOBAL' },
        },
        nextStepIds: [],
      });

      await this.coreDataSource.query(versionSql, [
        WORKFLOW_SURAT_VERSION_ID,
        'v1',
        triggerSurat,
        0,
        WORKFLOW_SURAT_ID,
        WORKFLOW_BANTUAN_VERSION_ID,
        'v1',
        triggerBantuan,
        0,
        WORKFLOW_BANTUAN_ID,
      ]);

      this.logger.log(
        `2 workflowVersion DRAFT disisipkan ke workspace ${workspaceId}`,
      );
    } catch (error) {
      this.logger.warn(
        `Gagal seed workflowVersion (workspace ${workspaceId}): ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }

    return { insertedWorkflows };
  }

  // Backfill viewField ke default list view (key = INDEX) untuk field yang
  // baru ditambah setelah object sudah ada. Engine hanya membuat viewField
  // saat createOneObject — field yang diinsert via createManyFields sesudah
  // itu tidak punya viewField sama sekali, sehingga kolom tidak muncul di UI.
  //
  // Idempotent: INSERT ON CONFLICT DO NOTHING menjaga agar duplikat tidak
  // terjadi bila method ini dipanggil ulang (misalnya dari reseed command).
  private async backfillViewFieldsForNewFields({
    workspaceId,
    objectNameSingular,
    fieldNames,
  }: {
    workspaceId: string;
    objectNameSingular: string;
    fieldNames: string[];
  }): Promise<void> {
    if (fieldNames.length === 0) {
      return;
    }

    // Satu INSERT … SELECT: untuk setiap field yang belum punya viewField di
    // default list view (key = INDEX), buat viewField baru dengan isVisible =
    // true. gen_random_uuid() dari PostgreSQL dipakai untuk id agar tidak
    // perlu mengimpor library uuid di sini.
    //
    // ROW_NUMBER() dalam sub-select memberi posisi relatif dimulai dari
    // posisi terbesar yang sudah ada + 1 supaya kolom baru muncul di akhir.
    // viewField mewarisi SyncableEntity (workspaceId, universalIdentifier,
    // applicationId NOT NULL). universalIdentifier diisi UUID baru via
    // gen_random_uuid(); applicationId diwarisi dari view induk supaya
    // viewField tetap satu application dengan view yang menampungnya.
    const sql = `
      INSERT INTO core."viewField"
        (id, "workspaceId", "universalIdentifier", "applicationId",
         "fieldMetadataId", "isVisible", size, position,
         "viewFieldGroupId", "viewId", "createdAt", "updatedAt")
      SELECT
        gen_random_uuid(),
        $1,
        gen_random_uuid(),
        candidate.v_application_id,
        candidate.fm_id,
        true,
        160,
        COALESCE(
          (SELECT MAX(vf.position)
           FROM core."viewField" vf
           WHERE vf."viewId" = candidate.v_id
             AND vf."deletedAt" IS NULL),
          -1
        ) + ROW_NUMBER() OVER (PARTITION BY candidate.v_id ORDER BY candidate.fm_id),
        NULL,
        candidate.v_id,
        NOW(),
        NOW()
      FROM (
        SELECT v.id AS v_id, v."applicationId" AS v_application_id, fm.id AS fm_id
        FROM core."view" v
        JOIN core."objectMetadata" om ON om.id = v."objectMetadataId"
        JOIN core."fieldMetadata" fm ON fm."objectMetadataId" = om.id
        WHERE om."workspaceId" = $1
          AND om."nameSingular" = $2
          AND v."workspaceId" = $1
          AND v."key" = 'INDEX'
          AND v."deletedAt" IS NULL
          AND fm.name = ANY($3::text[])
      ) candidate
      WHERE NOT EXISTS (
        SELECT 1 FROM core."viewField" existing
        WHERE existing."fieldMetadataId" = candidate.fm_id
          AND existing."viewId" = candidate.v_id
          AND existing."deletedAt" IS NULL
      )
      RETURNING id
    `;

    const result = await this.coreDataSource.query(sql, [
      workspaceId,
      objectNameSingular,
      fieldNames,
    ]);

    const inserted = Array.isArray(result) ? result.length : 0;

    if (inserted > 0) {
      this.logger.log(
        `Backfill ${inserted} viewField ke default view '${objectNameSingular}' (workspace ${workspaceId})`,
      );
    }
  }
}
