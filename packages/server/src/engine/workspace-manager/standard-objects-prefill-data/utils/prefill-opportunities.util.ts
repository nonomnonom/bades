import { FieldActorSource } from 'shared/types';
import { type EntityManager } from 'typeorm';

import {
  PEMERINTAH_DESA_ID,
  BUMDES_ID,
  PKK_ID,
  POSYANDU_ID,
} from 'src/engine/workspace-manager/standard-objects-prefill-data/utils/prefill-companies.util';
import {
  KEPALA_DESA_ID,
  SEKRETARIS_DESA_ID,
  KETUA_BUMDES_ID,
  KETUA_PKK_ID,
  KADER_POSYANDU_ID,
} from 'src/engine/workspace-manager/standard-objects-prefill-data/utils/prefill-people.util';

export const PROGRAM_JALAN_DESA_ID =
  '822639e5-9bf7-40f1-8882-a11140362339';
export const PROGRAM_BANTUAN_SEMBAKO_ID =
  'fc747edc-cb00-4078-8d6b-1fab2611dae4';
export const PROGRAM_TERNAK_KAMBING_ID =
  '75de302f-1044-4957-8da4-1f67ebefd52b';
export const PROGRAM_PELATIHAN_UMKM_ID =
  '2beb07b0-340c-41d7-be33-5aa91757f329';
export const PROGRAM_MCK_UMUM_ID =
  '9543adcf-ec03-44e2-9233-3c2d3ebae98a';
export const PROGRAM_POSYANDU_ID =
  '9457f8e9-16ae-43b9-92ee-cbd21f3dded5';

export const prefillOpportunities = async (
  entityManager: EntityManager,
  schemaName: string,
) => {
  const workspaceMember = await entityManager
    .createQueryBuilder()
    .select('id')
    .from(`${schemaName}.workspaceMember`, 'workspaceMember')
    .limit(1)
    .getRawOne();

  const ownerId = workspaceMember?.id ?? null;

  await entityManager
    .createQueryBuilder()
    .insert()
    .into(`${schemaName}.opportunity`, [
      'id',
      'name',
      'amountAmountMicros',
      'amountCurrencyCode',
      'closeDate',
      'stage',
      'position',
      'companyId',
      'pointOfContactId',
      'ownerId',
      'createdBySource',
      'createdByWorkspaceMemberId',
      'createdByName',
      'updatedBySource',
      'updatedByWorkspaceMemberId',
      'updatedByName',
    ])
    .orIgnore()
    .values([
      {
        id: PROGRAM_JALAN_DESA_ID,
        name: 'Pembangunan Jalan Dusun Melati',
        amountAmountMicros: 250000000000000,
        amountCurrencyCode: 'IDR',
        closeDate: new Date('2026-04-30T16:25:00.000Z'),
        stage: 'PROPOSAL',
        position: 1,
        companyId: BUMDES_ID,
        pointOfContactId: KETUA_BUMDES_ID,
        ownerId,
        createdBySource: FieldActorSource.SYSTEM,
        createdByWorkspaceMemberId: null,
        createdByName: 'System',
        updatedBySource: FieldActorSource.SYSTEM,
        updatedByWorkspaceMemberId: null,
        updatedByName: 'System',
      },
      {
        id: PROGRAM_BANTUAN_SEMBAKO_ID,
        name: 'Bantuan Langsung Tunai BLT-DD',
        amountAmountMicros: 120000000000000,
        amountCurrencyCode: 'IDR',
        closeDate: new Date('2026-03-15T16:25:00.000Z'),
        stage: 'CUSTOMER',
        position: 2,
        companyId: PEMERINTAH_DESA_ID,
        pointOfContactId: KEPALA_DESA_ID,
        ownerId,
        createdBySource: FieldActorSource.SYSTEM,
        createdByWorkspaceMemberId: null,
        createdByName: 'System',
        updatedBySource: FieldActorSource.SYSTEM,
        updatedByWorkspaceMemberId: null,
        updatedByName: 'System',
      },
      {
        id: PROGRAM_TERNAK_KAMBING_ID,
        name: 'Pengembangan Ternak Kambing',
        amountAmountMicros: 85000000000000,
        amountCurrencyCode: 'IDR',
        closeDate: new Date('2026-05-20T16:26:00.000Z'),
        stage: 'MEETING',
        position: 3,
        companyId: BUMDES_ID,
        pointOfContactId: KETUA_BUMDES_ID,
        ownerId,
        createdBySource: FieldActorSource.SYSTEM,
        createdByWorkspaceMemberId: null,
        createdByName: 'System',
        updatedBySource: FieldActorSource.SYSTEM,
        updatedByWorkspaceMemberId: null,
        updatedByName: 'System',
      },
      {
        id: PROGRAM_PELATIHAN_UMKM_ID,
        name: 'Pelatihan UMKM Digital',
        amountAmountMicros: 35000000000000,
        amountCurrencyCode: 'IDR',
        closeDate: new Date('2026-02-25T16:26:00.000Z'),
        stage: 'SCREENING',
        position: 4,
        companyId: PEMERINTAH_DESA_ID,
        pointOfContactId: SEKRETARIS_DESA_ID,
        ownerId,
        createdBySource: FieldActorSource.SYSTEM,
        createdByWorkspaceMemberId: null,
        createdByName: 'System',
        updatedBySource: FieldActorSource.SYSTEM,
        updatedByWorkspaceMemberId: null,
        updatedByName: 'System',
      },
      {
        id: PROGRAM_MCK_UMUM_ID,
        name: 'Pembangunan MCK Umum',
        amountAmountMicros: 75000000000000,
        amountCurrencyCode: 'IDR',
        closeDate: new Date('2026-06-10T16:26:00.000Z'),
        stage: 'NEW',
        position: 5,
        companyId: PEMERINTAH_DESA_ID,
        pointOfContactId: KEPALA_DESA_ID,
        ownerId,
        createdBySource: FieldActorSource.SYSTEM,
        createdByWorkspaceMemberId: null,
        createdByName: 'System',
        updatedBySource: FieldActorSource.SYSTEM,
        updatedByWorkspaceMemberId: null,
        updatedByName: 'System',
      },
      {
        id: PROGRAM_POSYANDU_ID,
        name: 'Posyandu Balita & Lansia',
        amountAmountMicros: 15000000000000,
        amountCurrencyCode: 'IDR',
        closeDate: new Date('2026-03-30T16:27:00.000Z'),
        stage: 'NEW',
        position: 6,
        companyId: POSYANDU_ID,
        pointOfContactId: KADER_POSYANDU_ID,
        ownerId,
        createdBySource: FieldActorSource.SYSTEM,
        createdByWorkspaceMemberId: null,
        createdByName: 'System',
        updatedBySource: FieldActorSource.SYSTEM,
        updatedByWorkspaceMemberId: null,
        updatedByName: 'System',
      },
    ])
    .returning('*')
    .execute();
};
