import { MessageParticipantRole } from 'shared/types';

import { MESSAGE_DATA_SEED_IDS } from 'src/engine/workspace-manager/dev-seeder/data/constants/message-data-seeds.constant';
import { PENDUDUK_DATA_SEED_IDS } from 'src/engine/workspace-manager/dev-seeder/data/constants/penduduk-data-seeds.constant';
import {
  WORKSPACE_MEMBER_DATA_SEED_IDS,
  getWorkspaceMemberDataSeeds,
} from 'src/engine/workspace-manager/dev-seeder/data/constants/workspace-member-data-seeds.constant';

export type MessageParticipantDataSeed = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  workspaceMemberId: string;
  personId: string;
  displayName: string;
  handle: string;
  role: MessageParticipantRole;
  messageId: string;
};

export const MESSAGE_PARTICIPANT_DATA_SEED_COLUMNS: (keyof MessageParticipantDataSeed)[] =
  [
    'id',
    'createdAt',
    'updatedAt',
    'deletedAt',
    'workspaceMemberId',
    'personId',
    'displayName',
    'handle',
    'role',
    'messageId',
  ];

const GENERATE_MESSAGE_PARTICIPANT_IDS = (): Record<string, string> => {
  const PARTICIPANT_IDS: Record<string, string> = {};

  for (let INDEX = 1; INDEX <= 1500; INDEX++) {
    const HEX_INDEX = INDEX.toString(16).padStart(4, '0');

    PARTICIPANT_IDS[`ID_${INDEX}`] =
      `20202020-${HEX_INDEX}-4e7c-8001-123456789cde`;
  }

  return PARTICIPANT_IDS;
};

export const MESSAGE_PARTICIPANT_DATA_SEED_IDS =
  GENERATE_MESSAGE_PARTICIPANT_IDS();

const FAKE_EMAIL_PARTICIPANTS = [
  { name: 'Budi Santoso', email: 'budi.santoso@gmail.com' },
  { name: 'Siti Rahmawati', email: 'siti.rahmawati@gmail.com' },
  { name: 'Agus Wijaya', email: 'agus.wijaya@gmail.com' },
  { name: 'Dewi Lestari', email: 'dewi.lestari@gmail.com' },
  { name: 'Eko Prasetyo', email: 'eko.prasetyo@gmail.com' },
  { name: 'Rina Handayani', email: 'rina.handayani@gmail.com' },
  { name: 'Joko Susanto', email: 'joko.susanto@gmail.com' },
  { name: 'Sri Wahyuni', email: 'sri.wahyuni@gmail.com' },
  { name: 'Bambang Hidayat', email: 'bambang.hidayat@gmail.com' },
  { name: 'Nurul Aini', email: 'nurul.aini@gmail.com' },
  { name: 'Hendra Gunawan', email: 'hendra.gunawan@gmail.com' },
  { name: 'Maya Anggraini', email: 'maya.anggraini@gmail.com' },
  { name: 'Rudi Hartono', email: 'rudi.hartono@gmail.com' },
  { name: 'Fitri Yuliana', email: 'fitri.yuliana@gmail.com' },
  { name: 'Wahyu Nugroho', email: 'wahyu.nugroho@gmail.com' },
];

type ParticipantData = {
  workspaceMemberId: string;
  personId: string;
  displayName: string;
  handle: string;
};

const GET_RANDOM_FAKE_PARTICIPANT = () => {
  return FAKE_EMAIL_PARTICIPANTS[
    Math.floor(Math.random() * FAKE_EMAIL_PARTICIPANTS.length)
  ];
};

const FIND_UNUSED_PERSON_ID = (
  personIds: string[],
  usedPersonIds: Set<string>,
): string | null => {
  const AVAILABLE_IDS = personIds.filter((id) => !usedPersonIds.has(id));

  if (AVAILABLE_IDS.length === 0) return null;

  return AVAILABLE_IDS[Math.floor(Math.random() * AVAILABLE_IDS.length)];
};

const FIND_UNUSED_WORKSPACE_MEMBER_ID = (
  workspaceMemberIds: string[],
  usedWorkspaceMemberIds: Set<string>,
): string | null => {
  const AVAILABLE_IDS = workspaceMemberIds.filter(
    (id) => !usedWorkspaceMemberIds.has(id),
  );

  if (AVAILABLE_IDS.length === 0) return null;

  return AVAILABLE_IDS[Math.floor(Math.random() * AVAILABLE_IDS.length)];
};

const CREATE_PERSON_PARTICIPANT = (
  personIds: string[],
  usedPersonIds: Set<string>,
  defaultWorkspaceMemberId: string,
): ParticipantData | null => {
  const PERSON_ID = FIND_UNUSED_PERSON_ID(personIds, usedPersonIds);

  if (!PERSON_ID) return null;

  usedPersonIds.add(PERSON_ID);
  const PERSON_INDEX = personIds.indexOf(PERSON_ID) + 1;

  return {
    workspaceMemberId: defaultWorkspaceMemberId,
    personId: PERSON_ID,
    displayName: `Warga ${PERSON_INDEX}`,
    handle: `warga${PERSON_INDEX}@gmail.com`,
  };
};

const CREATE_WORKSPACE_MEMBER_PARTICIPANT = (
  workspaceMemberIds: string[],
  personIds: string[],
  usedWorkspaceMemberIds: Set<string>,
): ParticipantData | null => {
  const WORKSPACE_MEMBER_ID = FIND_UNUSED_WORKSPACE_MEMBER_ID(
    workspaceMemberIds,
    usedWorkspaceMemberIds,
  );

  if (!WORKSPACE_MEMBER_ID) return null;

  usedWorkspaceMemberIds.add(WORKSPACE_MEMBER_ID);

  switch (WORKSPACE_MEMBER_ID) {
    case WORKSPACE_MEMBER_DATA_SEED_IDS.KADES:
      return {
        workspaceMemberId: WORKSPACE_MEMBER_ID,
        personId: personIds[0],
        displayName: 'Drs. H. Abdullah',
        handle: 'kades@sukamaju.desa.id',
      };
    case WORKSPACE_MEMBER_DATA_SEED_IDS.SEKDES:
      return {
        workspaceMemberId: WORKSPACE_MEMBER_ID,
        personId: personIds[1] || personIds[0],
        displayName: 'Ahmad Hidayat',
        handle: 'sekdes@sukamaju.desa.id',
      };
    case WORKSPACE_MEMBER_DATA_SEED_IDS.KAUR:
      return {
        workspaceMemberId: WORKSPACE_MEMBER_ID,
        personId: personIds[2] || personIds[0],
        displayName: 'Dewi Lestari',
        handle: 'kaur@sukamaju.desa.id',
      };
    default:
      return {
        workspaceMemberId: WORKSPACE_MEMBER_ID,
        personId: personIds[0],
        displayName: 'Perangkat Desa',
        handle: 'perangkat@sukamaju.desa.id',
      };
  }
};

const CREATE_FAKE_PARTICIPANT = (
  workspaceMemberIds: string[],
  personIds: string[],
): ParticipantData => {
  const FAKE = GET_RANDOM_FAKE_PARTICIPANT();

  return {
    workspaceMemberId: workspaceMemberIds[0],
    personId:
      personIds[Math.floor(Math.random() * Math.min(10, personIds.length))],
    displayName: FAKE.name,
    handle: FAKE.email,
  };
};

const CREATE_PARTICIPANT_DATA = (
  personIds: string[],
  workspaceMemberIds: string[],
  usedPersonIds: Set<string>,
  usedWorkspaceMemberIds: Set<string>,
): ParticipantData => {
  const PARTICIPANT_TYPE = Math.random();

  // Try person participant (40% chance)
  if (PARTICIPANT_TYPE < 0.4) {
    const PERSON_PARTICIPANT = CREATE_PERSON_PARTICIPANT(
      personIds,
      usedPersonIds,
      workspaceMemberIds[0],
    );

    if (PERSON_PARTICIPANT) return PERSON_PARTICIPANT;
  }

  // Try workspace member participant (30% chance, 0.4-0.7 range)
  if (PARTICIPANT_TYPE >= 0.4 && PARTICIPANT_TYPE < 0.7) {
    const WORKSPACE_PARTICIPANT = CREATE_WORKSPACE_MEMBER_PARTICIPANT(
      workspaceMemberIds,
      personIds,
      usedWorkspaceMemberIds,
    );

    if (WORKSPACE_PARTICIPANT) return WORKSPACE_PARTICIPANT;
  }

  // Fallback to fake participant
  return CREATE_FAKE_PARTICIPANT(workspaceMemberIds, personIds);
};

const CREATE_MESSAGE_PARTICIPANTS = (
  messageId: string,
  personIds: string[],
  workspaceMemberIds: string[],
  participantIndex: number,
): { participants: MessageParticipantDataSeed[]; nextIndex: number } => {
  const PARTICIPANTS: MessageParticipantDataSeed[] = [];
  const RECIPIENT_COUNT = 1 + Math.floor(Math.random() * 3); // 1-3 recipients
  const TOTAL_PARTICIPANTS = 1 + RECIPIENT_COUNT; // sender + recipients

  const USED_PERSON_IDS = new Set<string>();
  const USED_WORKSPACE_MEMBER_IDS = new Set<string>();

  for (let I = 0; I < TOTAL_PARTICIPANTS; I++) {
    const IS_SENDER = I === 0;
    const ROLE = IS_SENDER
      ? MessageParticipantRole.FROM
      : MessageParticipantRole.TO;

    // Random date within the last 3 months
    const NOW = new Date();
    const RANDOM_DAYS_OFFSET = Math.floor(Math.random() * 90);
    const PARTICIPANT_DATE = new Date(
      NOW.getTime() - RANDOM_DAYS_OFFSET * 24 * 60 * 60 * 1000,
    );

    const PARTICIPANT_DATA = CREATE_PARTICIPANT_DATA(
      personIds,
      workspaceMemberIds,
      USED_PERSON_IDS,
      USED_WORKSPACE_MEMBER_IDS,
    );

    PARTICIPANTS.push({
      id: MESSAGE_PARTICIPANT_DATA_SEED_IDS[`ID_${participantIndex}`],
      createdAt: PARTICIPANT_DATE,
      updatedAt: PARTICIPANT_DATE,
      deletedAt: null,
      workspaceMemberId: PARTICIPANT_DATA.workspaceMemberId,
      personId: PARTICIPANT_DATA.personId,
      displayName: PARTICIPANT_DATA.displayName,
      handle: PARTICIPANT_DATA.handle,
      role: ROLE,
      messageId,
    });

    participantIndex++;
  }

  return { participants: PARTICIPANTS, nextIndex: participantIndex };
};

const GENERATE_MESSAGE_PARTICIPANT_SEEDS = (
  workspaceId: string,
): MessageParticipantDataSeed[] => {
  const PARTICIPANT_SEEDS: MessageParticipantDataSeed[] = [];
  let PARTICIPANT_INDEX = 1;

  const MESSAGE_IDS = Object.keys(MESSAGE_DATA_SEED_IDS).map(
    (key) => MESSAGE_DATA_SEED_IDS[key as keyof typeof MESSAGE_DATA_SEED_IDS],
  );

  const PERSON_IDS = Object.values(PENDUDUK_DATA_SEED_IDS);
  const WORKSPACE_MEMBER_IDS = getWorkspaceMemberDataSeeds(workspaceId).map(
    (member) => member.id,
  );

  for (const MESSAGE_ID of MESSAGE_IDS) {
    const RESULT = CREATE_MESSAGE_PARTICIPANTS(
      MESSAGE_ID,
      PERSON_IDS,
      WORKSPACE_MEMBER_IDS,
      PARTICIPANT_INDEX,
    );

    PARTICIPANT_SEEDS.push(...RESULT.participants);
    PARTICIPANT_INDEX = RESULT.nextIndex;
  }

  return PARTICIPANT_SEEDS;
};

export const getMessageParticipantDataSeeds = (
  _workspaceId: string,
): MessageParticipantDataSeed[] => {
  return [];
};
