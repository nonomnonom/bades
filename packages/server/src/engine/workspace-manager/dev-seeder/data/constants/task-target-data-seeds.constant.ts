import { PENDUDUK_DATA_SEED_IDS } from 'src/engine/workspace-manager/dev-seeder/data/constants/penduduk-data-seeds.constant';
import { TASK_DATA_SEED_IDS } from 'src/engine/workspace-manager/dev-seeder/data/constants/task-data-seeds.constant';

// Kolom `targetPendudukId` dibuat otomatis oleh engine saat custom object
// `penduduk` diregistrasi. Engine memanggil
// `buildDefaultRelationFlatFieldMetadatasForCustomObject` yang mengiterasi
// `DEFAULT_RELATIONS_OBJECTS_STANDARD_IDS` (termasuk `taskTarget`) dan
// membuat kolom morph `target${capitalize(nameSingular)}` untuk setiap
// custom object. Kolom ini AMAN dipakai di seed ini.
type TaskTargetDataSeed = {
  id: string;
  taskId: string | null;
  targetPendudukId: string | null;
};

export const TASK_TARGET_DATA_SEED_COLUMNS: (keyof TaskTargetDataSeed)[] = [
  'id',
  'taskId',
  'targetPendudukId',
];

const GENERATE_TASK_TARGET_IDS = (): Record<string, string> => {
  const TASK_TARGET_IDS: Record<string, string> = {};

  for (let INDEX = 1; INDEX <= 1800; INDEX++) {
    const HEX_INDEX = INDEX.toString(16).padStart(4, '0');

    TASK_TARGET_IDS[`ID_${INDEX}`] =
      `60606060-${HEX_INDEX}-4e7c-8001-123456789def`;
  }

  return TASK_TARGET_IDS;
};

const TASK_TARGET_DATA_SEED_IDS = GENERATE_TASK_TARGET_IDS();

const PENDUDUK_ID_LIST = Object.values(PENDUDUK_DATA_SEED_IDS);

const GENERATE_TASK_TARGET_SEEDS = (): TaskTargetDataSeed[] => {
  const TASK_TARGET_SEEDS: TaskTargetDataSeed[] = [];

  for (let INDEX = 1; INDEX <= 1800; INDEX++) {
    TASK_TARGET_SEEDS.push({
      id: TASK_TARGET_DATA_SEED_IDS[`ID_${INDEX}`],
      taskId: TASK_DATA_SEED_IDS[`ID_${INDEX}`],
      targetPendudukId:
        PENDUDUK_ID_LIST[(INDEX - 1) % PENDUDUK_ID_LIST.length],
    });
  }

  return TASK_TARGET_SEEDS;
};

export const TASK_TARGET_DATA_SEEDS = GENERATE_TASK_TARGET_SEEDS();

// Map for O(1) lookups by task ID
export const TASK_TARGET_DATA_SEEDS_MAP = new Map<string, TaskTargetDataSeed>(
  TASK_TARGET_DATA_SEEDS.filter((target) => target.taskId !== null).map(
    (target) => [target.taskId!, target],
  ),
);
