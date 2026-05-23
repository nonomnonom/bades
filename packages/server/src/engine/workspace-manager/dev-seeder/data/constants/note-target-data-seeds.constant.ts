import { NOTE_DATA_SEED_IDS } from 'src/engine/workspace-manager/dev-seeder/data/constants/note-data-seeds.constant';
import { PENDUDUK_DATA_SEED_IDS } from 'src/engine/workspace-manager/dev-seeder/data/constants/penduduk-data-seeds.constant';

// Kolom `targetPendudukId` dibuat otomatis oleh engine saat custom object
// `penduduk` diregistrasi. Engine memanggil
// `buildDefaultRelationFlatFieldMetadatasForCustomObject` yang mengiterasi
// `DEFAULT_RELATIONS_OBJECTS_STANDARD_IDS` (termasuk `noteTarget`) dan
// membuat kolom morph `target${capitalize(nameSingular)}` untuk setiap
// custom object. Kolom ini AMAN dipakai di seed ini.
type NoteTargetDataSeed = {
  id: string;
  noteId: string | null;
  targetPendudukId: string | null;
};

export const NOTE_TARGET_DATA_SEED_COLUMNS: (keyof NoteTargetDataSeed)[] = [
  'id',
  'noteId',
  'targetPendudukId',
];

const GENERATE_NOTE_TARGET_IDS = (): Record<string, string> => {
  const NOTE_TARGET_IDS: Record<string, string> = {};

  for (let INDEX = 1; INDEX <= 1800; INDEX++) {
    const HEX_INDEX = INDEX.toString(16).padStart(4, '0');

    NOTE_TARGET_IDS[`ID_${INDEX}`] =
      `20202020-${HEX_INDEX}-4e7c-8001-123456789def`;
  }

  return NOTE_TARGET_IDS;
};

const NOTE_TARGET_DATA_SEED_IDS = GENERATE_NOTE_TARGET_IDS();

const PENDUDUK_ID_LIST = Object.values(PENDUDUK_DATA_SEED_IDS);

const GENERATE_NOTE_TARGET_SEEDS = (): NoteTargetDataSeed[] => {
  const NOTE_TARGET_SEEDS: NoteTargetDataSeed[] = [];

  for (let INDEX = 1; INDEX <= 1800; INDEX++) {
    NOTE_TARGET_SEEDS.push({
      id: NOTE_TARGET_DATA_SEED_IDS[`ID_${INDEX}`],
      noteId: NOTE_DATA_SEED_IDS[`ID_${INDEX}`],
      targetPendudukId: PENDUDUK_ID_LIST[(INDEX - 1) % PENDUDUK_ID_LIST.length],
    });
  }

  return NOTE_TARGET_SEEDS;
};

export const NOTE_TARGET_DATA_SEEDS = GENERATE_NOTE_TARGET_SEEDS();

// Map for O(1) lookups by note ID
export const NOTE_TARGET_DATA_SEEDS_MAP = new Map<string, NoteTargetDataSeed>(
  NOTE_TARGET_DATA_SEEDS.filter((target) => target.noteId !== null).map(
    (target) => [target.noteId!, target],
  ),
);
