import { ATTACHMENT_FLAT_OBJECT_MOCK } from 'src/engine/metadata-modules/flat-object-metadata/__mocks__/attachment-flat-object.mock';
import { KELUARGA_FLAT_OBJECT_MOCK } from 'src/engine/metadata-modules/flat-object-metadata/__mocks__/keluarga-flat-object.mock';
import { NOTE_FLAT_OBJECT_MOCK } from 'src/engine/metadata-modules/flat-object-metadata/__mocks__/note-flat-object.mock';
import { NOTE_TARGET_FLAT_OBJECT_MOCK } from 'src/engine/metadata-modules/flat-object-metadata/__mocks__/note-target-flat-object.mock';
import { PROGRAM_BANTUAN_FLAT_OBJECT_MOCK } from 'src/engine/metadata-modules/flat-object-metadata/__mocks__/program-bantuan-flat-object.mock';
import { PENDUDUK_FLAT_OBJECT_MOCK } from 'src/engine/metadata-modules/flat-object-metadata/__mocks__/penduduk-flat-object.mock';
import { PET_FLAT_OBJECT_MOCK } from 'src/engine/metadata-modules/flat-object-metadata/__mocks__/pet-flat-object.mock';
import { ROCKET_FLAT_OBJECT_MOCK } from 'src/engine/metadata-modules/flat-object-metadata/__mocks__/rocket-flat-object.mock';
import { TASK_FLAT_OBJECT_MOCK } from 'src/engine/metadata-modules/flat-object-metadata/__mocks__/task-flat-object.mock';
import { TASK_TARGET_FLAT_OBJECT_MOCK } from 'src/engine/metadata-modules/flat-object-metadata/__mocks__/task-target-flat-object.mock';
import { TIMELINE_ACTIVITY_FLAT_OBJECT_MOCK } from 'src/engine/metadata-modules/flat-object-metadata/__mocks__/timeline-activity-flat-object.mock';

export const ALL_FLAT_OBJECT_METADATA_MOCKS = [
  TIMELINE_ACTIVITY_FLAT_OBJECT_MOCK,
  NOTE_TARGET_FLAT_OBJECT_MOCK,
  PROGRAM_BANTUAN_FLAT_OBJECT_MOCK,
  PENDUDUK_FLAT_OBJECT_MOCK,
  TASK_FLAT_OBJECT_MOCK,
  TASK_TARGET_FLAT_OBJECT_MOCK,
  PET_FLAT_OBJECT_MOCK,
  ROCKET_FLAT_OBJECT_MOCK,
  NOTE_FLAT_OBJECT_MOCK,
  KELUARGA_FLAT_OBJECT_MOCK,
  ATTACHMENT_FLAT_OBJECT_MOCK,
] as const;
