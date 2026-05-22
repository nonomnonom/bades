import { FieldActorSource } from 'shared/types';

import { NOTE_DATA_SEED_IDS } from 'src/engine/workspace-manager/dev-seeder/data/constants/note-data-seeds.constant';
import { PENDUDUK_DATA_SEED_IDS } from 'src/engine/workspace-manager/dev-seeder/data/constants/penduduk-data-seeds.constant';
import { TASK_DATA_SEED_IDS } from 'src/engine/workspace-manager/dev-seeder/data/constants/task-data-seeds.constant';
import { WORKSPACE_MEMBER_DATA_SEED_IDS } from 'src/engine/workspace-manager/dev-seeder/data/constants/workspace-member-data-seeds.constant';

type AttachmentDataSeed = {
  id: string;
  name: string;
  file: string;
  createdBySource: string;
  createdByWorkspaceMemberId: string;
  createdByName: string;
  updatedBySource: string;
  updatedByWorkspaceMemberId: string;
  updatedByName: string;
  targetNoteId: string | null;
  targetTaskId: string | null;
};

export const ATTACHMENT_DATA_SEED_COLUMNS: (keyof AttachmentDataSeed)[] = [
  'id',
  'name',
  'file',
  'createdBySource',
  'createdByWorkspaceMemberId',
  'createdByName',
  'updatedBySource',
  'updatedByWorkspaceMemberId',
  'updatedByName',
  'targetNoteId',
  'targetTaskId',
];

const GENERATE_ATTACHMENT_IDS = (): Record<string, string> => {
  const ATTACHMENT_IDS: Record<string, string> = {};

  for (let INDEX = 1; INDEX <= 400; INDEX++) {
    const HEX_INDEX = INDEX.toString(16).padStart(4, '0');

    ATTACHMENT_IDS[`ID_${INDEX}`] =
      `20202020-${HEX_INDEX}-4a7c-8001-123456789aba`;
  }

  return ATTACHMENT_IDS;
};

export const ATTACHMENT_DATA_SEED_IDS = GENERATE_ATTACHMENT_IDS();

// FileIds must be unique per workspace since core.file is a shared table.
// We use the first 12 hex chars of the workspaceId as a namespace suffix.
const deriveFileId = (attachmentIndex: number, workspaceId: string): string => {
  const workspaceHex = workspaceId.replace(/-/g, '').slice(0, 12);
  const hexIndex = attachmentIndex.toString(16).padStart(4, '0');

  return `f11e0000-${hexIndex}-4a7c-8001-${workspaceHex}`;
};

export const ATTACHMENT_SAMPLE_FILES = [
  {
    filename: 'sample-contract.pdf',
    mimeType: 'application/pdf',
    extension: 'pdf',
  },
  {
    filename: 'budget-2024.xlsx',
    mimeType:
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    extension: 'xlsx',
  },
  {
    filename: 'presentation.pptx',
    mimeType:
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    extension: 'pptx',
  },
  {
    filename: 'screenshot.png',
    mimeType: 'image/png',
    extension: 'png',
  },
  {
    filename: 'archive.zip',
    mimeType: 'application/zip',
    extension: 'zip',
  },
];

// Nama file lampiran sesuai konteks administrasi desa Indonesia
const FILE_NAME_VARIATIONS = [
  // Dokumen administrasi
  { name: 'Surat Keterangan Domisili.pdf', sampleFileIndex: 0 },
  { name: 'Akta Kelahiran.pdf', sampleFileIndex: 0 },
  { name: 'Surat Pengantar SKCK.pdf', sampleFileIndex: 0 },
  { name: 'Permohonan Layanan Warga.pdf', sampleFileIndex: 0 },
  { name: 'Surat Keterangan Usaha.pdf', sampleFileIndex: 0 },
  { name: 'Berita Acara Musyawarah.pdf', sampleFileIndex: 0 },
  { name: 'SK Kepala Desa.pdf', sampleFileIndex: 0 },
  // Data keuangan desa
  { name: 'APBDes 2024.xlsx', sampleFileIndex: 1 },
  { name: 'Realisasi Anggaran Q1.xlsx', sampleFileIndex: 1 },
  { name: 'Daftar Penerima Bantuan.xlsx', sampleFileIndex: 1 },
  { name: 'Laporan Keuangan Desa.xlsx', sampleFileIndex: 1 },
  { name: 'Data Penduduk Desa.xlsx', sampleFileIndex: 1 },
  { name: 'Rekap Kartu Keluarga.xlsx', sampleFileIndex: 1 },
  // Presentasi dan laporan
  { name: 'Profil Desa 2024.pptx', sampleFileIndex: 2 },
  { name: 'Laporan Tahunan Desa.pptx', sampleFileIndex: 2 },
  { name: 'Program Kerja Desa.pptx', sampleFileIndex: 2 },
  { name: 'Rencana Pembangunan Desa.pptx', sampleFileIndex: 2 },
  { name: 'Sosialisasi Program Bantuan.pptx', sampleFileIndex: 2 },
  // Foto dan dokumen pendukung
  { name: 'Foto Balai Desa.png', sampleFileIndex: 3 },
  { name: 'Peta Wilayah Desa.png', sampleFileIndex: 3 },
  { name: 'Denah Kantor Desa.png', sampleFileIndex: 3 },
  { name: 'Dokumentasi Kegiatan.png', sampleFileIndex: 3 },
  { name: 'Foto Kondisi Infrastruktur.png', sampleFileIndex: 3 },
  { name: 'KTP Warga Scan.jpg', sampleFileIndex: 3 },
  // Arsip
  { name: 'Arsip Surat 2023.zip', sampleFileIndex: 4 },
  { name: 'Backup Data Penduduk.zip', sampleFileIndex: 4 },
  { name: 'Dokumen APBDes Lama.zip', sampleFileIndex: 4 },
];

export type AttachmentFileSeedMetadata = {
  fileId: string;
  label: string;
  sampleFileIndex: number;
  mimeType: string;
  extension: string;
};

export const generateAttachmentSeedsForWorkspace = (
  workspaceId: string,
): {
  seeds: AttachmentDataSeed[];
  fileSeedMetadata: AttachmentFileSeedMetadata[];
} => {
  const seeds: AttachmentDataSeed[] = [];
  const fileSeedMetadata: AttachmentFileSeedMetadata[] = [];

  const NOTE_IDS = Object.values(NOTE_DATA_SEED_IDS).slice(0, 120);
  const TASK_IDS = Object.values(TASK_DATA_SEED_IDS).slice(0, 120);

  let entityIndex = 0;

  for (let index = 1; index <= 400; index++) {
    const nameVariationIndex = index % FILE_NAME_VARIATIONS.length;
    const nameVariation = FILE_NAME_VARIATIONS[nameVariationIndex];
    const sampleFile = ATTACHMENT_SAMPLE_FILES[nameVariation.sampleFileIndex];

    const attachmentId = ATTACHMENT_DATA_SEED_IDS[`ID_${index}`];
    const fileId = deriveFileId(index, workspaceId);

    let targetNoteId: string | null = null;
    let targetTaskId: string | null = null;

    const distributionValue = index % 100;

    if (distributionValue < 50) {
      // 50% lampiran ke catatan warga
      targetNoteId = NOTE_IDS[entityIndex % NOTE_IDS.length];
      entityIndex++;
    } else if (distributionValue < 100) {
      // 50% lampiran ke tugas perangkat desa
      targetTaskId = TASK_IDS[entityIndex % TASK_IDS.length];
      entityIndex++;
    }

    fileSeedMetadata.push({
      fileId,
      label: nameVariation.name,
      sampleFileIndex: nameVariation.sampleFileIndex,
      mimeType: sampleFile.mimeType,
      extension: sampleFile.extension,
    });

    seeds.push({
      id: attachmentId,
      name: nameVariation.name,
      file: JSON.stringify([
        { fileId, label: nameVariation.name, extension: sampleFile.extension },
      ]),
      createdBySource: FieldActorSource.MANUAL,
      createdByWorkspaceMemberId: WORKSPACE_MEMBER_DATA_SEED_IDS.KADES,
      createdByName: 'Drs. H. Abdullah',
      updatedBySource: FieldActorSource.MANUAL,
      updatedByWorkspaceMemberId: WORKSPACE_MEMBER_DATA_SEED_IDS.KADES,
      updatedByName: 'Drs. H. Abdullah',
      targetNoteId,
      targetTaskId,
    });
  }

  return { seeds, fileSeedMetadata };
};
