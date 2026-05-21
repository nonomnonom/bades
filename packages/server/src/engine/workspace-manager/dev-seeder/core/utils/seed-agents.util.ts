import { type QueryRunner } from 'typeorm';

import { AgentMessageRole } from 'src/engine/metadata-modules/ai/ai-agent-execution/entities/agent-message.entity';
import {
  SEED_SUKAMAJU_WORKSPACE_ID,
  SEED_MEKARSARI_WORKSPACE_ID,
} from 'src/engine/workspace-manager/dev-seeder/core/constants/seeder-workspaces.constant';
import { USER_WORKSPACE_DATA_SEED_IDS } from 'src/engine/workspace-manager/dev-seeder/core/utils/seed-user-workspaces.util';

const agentChatThreadTableName = 'agentChatThread';
const agentTurnTableName = 'agentTurn';
const agentMessageTableName = 'agentMessage';
const agentMessagePartTableName = 'agentMessagePart';

export const AGENT_DATA_SEED_IDS = {
  SUKAMAJU_DEFAULT_AGENT: '20202020-0000-4000-8000-000000000001',
  MEKAR_SARI_DEFAULT_AGENT: '20202020-0000-4000-8000-000000000002',
};

export const AGENT_CHAT_THREAD_DATA_SEED_IDS = {
  SUKAMAJU_DEFAULT_THREAD: '20202020-0000-4000-8000-000000000011',
  MEKAR_SARI_DEFAULT_THREAD: '20202020-0000-4000-8000-000000000012',
};

export const AGENT_CHAT_MESSAGE_DATA_SEED_IDS = {
  SUKAMAJU_MESSAGE_1: '20202020-0000-4000-8000-000000000021',
  SUKAMAJU_MESSAGE_2: '20202020-0000-4000-8000-000000000022',
  SUKAMAJU_MESSAGE_3: '20202020-0000-4000-8000-000000000023',
  SUKAMAJU_MESSAGE_4: '20202020-0000-4000-8000-000000000024',
  MEKAR_SARI_MESSAGE_1: '20202020-0000-4000-8000-000000000031',
  MEKAR_SARI_MESSAGE_2: '20202020-0000-4000-8000-000000000032',
  MEKAR_SARI_MESSAGE_3: '20202020-0000-4000-8000-000000000033',
  MEKAR_SARI_MESSAGE_4: '20202020-0000-4000-8000-000000000034',
};

export const AGENT_CHAT_MESSAGE_PART_DATA_SEED_IDS = {
  SUKAMAJU_MESSAGE_1_PART_1: '20202020-0000-4000-8000-000000000041',
  SUKAMAJU_MESSAGE_2_PART_1: '20202020-0000-4000-8000-000000000042',
  SUKAMAJU_MESSAGE_3_PART_1: '20202020-0000-4000-8000-000000000043',
  SUKAMAJU_MESSAGE_4_PART_1: '20202020-0000-4000-8000-000000000044',
  MEKAR_SARI_MESSAGE_1_PART_1: '20202020-0000-4000-8000-000000000051',
  MEKAR_SARI_MESSAGE_2_PART_1: '20202020-0000-4000-8000-000000000052',
  MEKAR_SARI_MESSAGE_3_PART_1: '20202020-0000-4000-8000-000000000053',
  MEKAR_SARI_MESSAGE_4_PART_1: '20202020-0000-4000-8000-000000000054',
};

type SeedChatThreadsArgs = {
  queryRunner: QueryRunner;
  schemaName: string;
  workspaceId: string;
};

const seedChatThreads = async ({
  queryRunner,
  schemaName,
  workspaceId,
}: SeedChatThreadsArgs) => {
  let threadId: string;
  let userWorkspaceId: string;

  if (workspaceId === SEED_SUKAMAJU_WORKSPACE_ID) {
    threadId = AGENT_CHAT_THREAD_DATA_SEED_IDS.SUKAMAJU_DEFAULT_THREAD;
    userWorkspaceId = USER_WORKSPACE_DATA_SEED_IDS.KADES;
  } else if (workspaceId === SEED_MEKARSARI_WORKSPACE_ID) {
    threadId = AGENT_CHAT_THREAD_DATA_SEED_IDS.MEKAR_SARI_DEFAULT_THREAD;
    userWorkspaceId = USER_WORKSPACE_DATA_SEED_IDS.KADES_ACME;
  } else {
    throw new Error(
      `Unsupported workspace ID for agent chat thread seeding: ${workspaceId}`,
    );
  }

  const now = new Date();

  await queryRunner.manager
    .createQueryBuilder()
    .insert()
    .into(`${schemaName}.${agentChatThreadTableName}`, [
      'id',
      'workspaceId',
      'userWorkspaceId',
      'createdAt',
      'updatedAt',
    ])
    .orIgnore()
    .values([
      {
        id: threadId,
        workspaceId,
        userWorkspaceId,
        createdAt: now,
        updatedAt: now,
      },
    ])
    .execute();

  return threadId;
};

type SeedChatMessagesArgs = {
  queryRunner: QueryRunner;
  schemaName: string;
  workspaceId: string;
  threadId: string;
};

const seedChatMessages = async ({
  queryRunner,
  schemaName,
  workspaceId,
  threadId,
}: SeedChatMessagesArgs) => {
  let messageIds: string[];
  let partIds: string[];
  let turnIds: string[];
  let messages: Array<{
    id: string;
    workspaceId: string;
    threadId: string;
    turnId: string;
    role: AgentMessageRole;
    createdAt: Date;
  }>;
  let messageParts: Array<{
    id: string;
    workspaceId: string;
    messageId: string;
    orderIndex: number;
    type: string;
    textContent: string;
    createdAt: Date;
  }>;

  const now = new Date();
  const baseTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  if (workspaceId === SEED_SUKAMAJU_WORKSPACE_ID) {
    messageIds = [
      AGENT_CHAT_MESSAGE_DATA_SEED_IDS.SUKAMAJU_MESSAGE_1,
      AGENT_CHAT_MESSAGE_DATA_SEED_IDS.SUKAMAJU_MESSAGE_2,
      AGENT_CHAT_MESSAGE_DATA_SEED_IDS.SUKAMAJU_MESSAGE_3,
      AGENT_CHAT_MESSAGE_DATA_SEED_IDS.SUKAMAJU_MESSAGE_4,
    ];
    partIds = [
      AGENT_CHAT_MESSAGE_PART_DATA_SEED_IDS.SUKAMAJU_MESSAGE_1_PART_1,
      AGENT_CHAT_MESSAGE_PART_DATA_SEED_IDS.SUKAMAJU_MESSAGE_2_PART_1,
      AGENT_CHAT_MESSAGE_PART_DATA_SEED_IDS.SUKAMAJU_MESSAGE_3_PART_1,
      AGENT_CHAT_MESSAGE_PART_DATA_SEED_IDS.SUKAMAJU_MESSAGE_4_PART_1,
    ];
    turnIds = [
      '20202020-0000-4000-8000-000000000061',
      '20202020-0000-4000-8000-000000000062',
    ];
    messages = [
      {
        id: messageIds[0],
        workspaceId,
        threadId,
        turnId: turnIds[0],
        role: AgentMessageRole.USER,
        createdAt: new Date(baseTime.getTime()),
      },
      {
        id: messageIds[1],
        workspaceId,
        threadId,
        turnId: turnIds[0],
        role: AgentMessageRole.ASSISTANT,
        createdAt: new Date(baseTime.getTime() + 5 * 60 * 1000),
      },
      {
        id: messageIds[2],
        workspaceId,
        threadId,
        turnId: turnIds[1],
        role: AgentMessageRole.USER,
        createdAt: new Date(baseTime.getTime() + 10 * 60 * 1000),
      },
      {
        id: messageIds[3],
        workspaceId,
        threadId,
        turnId: turnIds[1],
        role: AgentMessageRole.ASSISTANT,
        createdAt: new Date(baseTime.getTime() + 15 * 60 * 1000),
      },
    ];
    messageParts = [
      {
        id: partIds[0],
        workspaceId,
        messageId: messageIds[0],
        orderIndex: 0,
        type: 'text',
        textContent:
          'Halo! Bisakah kamu bantu saya memahami program layanan desa dan data warga saat ini?',
        createdAt: new Date(baseTime.getTime()),
      },
      {
        id: partIds[1],
        workspaceId,
        messageId: messageIds[1],
        orderIndex: 0,
        type: 'text',
        textContent:
          'Halo! Saya dengan senang hati membantu Anda memahami program layanan dan data warga Desa Sukamaju. Berdasarkan data workspace Anda, saya dapat melihat berbagai permohonan layanan dan program bantuan yang sedang berjalan. Aspek apa yang ingin Anda eksplorasi - data kependudukan, status permohonan layanan, atau realisasi program bantuan sosial?',
        createdAt: new Date(baseTime.getTime() + 5 * 60 * 1000),
      },
      {
        id: partIds[2],
        workspaceId,
        messageId: messageIds[2],
        orderIndex: 0,
        type: 'text',
        textContent:
          'Tolong tampilkan data permohonan layanan administrasi dan status penyelesaiannya bulan ini.',
        createdAt: new Date(baseTime.getTime() + 10 * 60 * 1000),
      },
      {
        id: partIds[3],
        workspaceId,
        messageId: messageIds[3],
        orderIndex: 0,
        type: 'text',
        textContent:
          'Berikut ringkasan permohonan layanan administrasi bulan ini: Total permohonan masuk 47 berkas, sudah selesai 38 berkas (81%), dalam proses 6 berkas, dan menunggu kelengkapan dokumen 3 berkas. Layanan terbanyak adalah pembuatan surat keterangan (18 berkas) dan pengurusan KTP (12 berkas). Rata-rata waktu penyelesaian 2,3 hari kerja. Apakah ingin melihat detail per jenis layanan atau per petugas?',
        createdAt: new Date(baseTime.getTime() + 15 * 60 * 1000),
      },
    ];
  } else if (workspaceId === SEED_MEKARSARI_WORKSPACE_ID) {
    messageIds = [
      AGENT_CHAT_MESSAGE_DATA_SEED_IDS.MEKAR_SARI_MESSAGE_1,
      AGENT_CHAT_MESSAGE_DATA_SEED_IDS.MEKAR_SARI_MESSAGE_2,
      AGENT_CHAT_MESSAGE_DATA_SEED_IDS.MEKAR_SARI_MESSAGE_3,
      AGENT_CHAT_MESSAGE_DATA_SEED_IDS.MEKAR_SARI_MESSAGE_4,
    ];
    partIds = [
      AGENT_CHAT_MESSAGE_PART_DATA_SEED_IDS.MEKAR_SARI_MESSAGE_1_PART_1,
      AGENT_CHAT_MESSAGE_PART_DATA_SEED_IDS.MEKAR_SARI_MESSAGE_2_PART_1,
      AGENT_CHAT_MESSAGE_PART_DATA_SEED_IDS.MEKAR_SARI_MESSAGE_3_PART_1,
      AGENT_CHAT_MESSAGE_PART_DATA_SEED_IDS.MEKAR_SARI_MESSAGE_4_PART_1,
    ];
    turnIds = [
      '20202020-0000-4000-8000-000000000071',
      '20202020-0000-4000-8000-000000000072',
    ];
    messages = [
      {
        id: messageIds[0],
        workspaceId,
        threadId,
        turnId: turnIds[0],
        role: AgentMessageRole.USER,
        createdAt: new Date(baseTime.getTime()),
      },
      {
        id: messageIds[1],
        workspaceId,
        threadId,
        turnId: turnIds[0],
        role: AgentMessageRole.ASSISTANT,
        createdAt: new Date(baseTime.getTime() + 3 * 60 * 1000),
      },
      {
        id: messageIds[2],
        workspaceId,
        threadId,
        turnId: turnIds[1],
        role: AgentMessageRole.USER,
        createdAt: new Date(baseTime.getTime() + 8 * 60 * 1000),
      },
      {
        id: messageIds[3],
        workspaceId,
        threadId,
        turnId: turnIds[1],
        role: AgentMessageRole.ASSISTANT,
        createdAt: new Date(baseTime.getTime() + 12 * 60 * 1000),
      },
    ];
    messageParts = [
      {
        id: partIds[0],
        workspaceId,
        messageId: messageIds[0],
        orderIndex: 0,
        type: 'text',
        textContent:
          'Bagaimana kondisi pembangunan infrastruktur desa dan lembaga-lembaga mana yang paling aktif?',
        createdAt: new Date(baseTime.getTime()),
      },
      {
        id: partIds[1],
        workspaceId,
        messageId: messageIds[1],
        orderIndex: 0,
        type: 'text',
        textContent:
          'Halo! Saya dapat membantu menganalisis kondisi pembangunan dan kinerja lembaga Desa Mekar Sari. Dari data workspace Anda, terlihat ada kemajuan baik dalam pembangunan infrastruktur. Beberapa lembaga menunjukkan keaktifan tinggi terutama PKK, BPD, dan Karang Taruna. Apakah ingin melihat realisasi anggaran pembangunan, atau laporan kinerja per lembaga?',
        createdAt: new Date(baseTime.getTime() + 3 * 60 * 1000),
      },
      {
        id: partIds[2],
        workspaceId,
        messageId: messageIds[2],
        orderIndex: 0,
        type: 'text',
        textContent:
          'Tolong tampilkan 5 lembaga paling aktif dan capaian program mereka.',
        createdAt: new Date(baseTime.getTime() + 8 * 60 * 1000),
      },
      {
        id: partIds[3],
        workspaceId,
        messageId: messageIds[3],
        orderIndex: 0,
        type: 'text',
        textContent:
          'Berikut 5 lembaga paling aktif: 1) PKK - 95% program terlaksana, 12 kegiatan bulan ini; 2) BPD - 4 rapat pleno, 2 peraturan desa disahkan; 3) Karang Taruna - 8 kegiatan kepemudaan, 150 anggota aktif; 4) Kelompok Tani Maju - produktivitas naik 20%, area tanam 15 ha; 5) Posyandu Melati - 98% balita terpantau, 0 kasus gizi buruk. Semua lembaga menunjukkan kinerja baik. Apakah ingin detail laporan untuk lembaga tertentu?',
        createdAt: new Date(baseTime.getTime() + 12 * 60 * 1000),
      },
    ];
  } else {
    throw new Error(
      `Unsupported workspace ID for agent chat message seeding: ${workspaceId}`,
    );
  }

  const turns = turnIds.map((id, index) => ({
    id,
    workspaceId,
    threadId,
    createdAt: messages[index * 2].createdAt,
  }));

  await queryRunner.manager
    .createQueryBuilder()
    .insert()
    .into(`${schemaName}.${agentTurnTableName}`, [
      'id',
      'workspaceId',
      'threadId',
      'createdAt',
    ])
    .orIgnore()
    .values(turns)
    .execute();

  await queryRunner.manager
    .createQueryBuilder()
    .insert()
    .into(`${schemaName}.${agentMessageTableName}`, [
      'id',
      'workspaceId',
      'threadId',
      'turnId',
      'role',
      'createdAt',
    ])
    .orIgnore()
    .values(messages)
    .execute();

  await queryRunner.manager
    .createQueryBuilder()
    .insert()
    .into(`${schemaName}.${agentMessagePartTableName}`, [
      'id',
      'workspaceId',
      'messageId',
      'orderIndex',
      'type',
      'textContent',
      'createdAt',
    ])
    .orIgnore()
    .values(messageParts)
    .execute();
};

type SeedAgentsArgs = {
  queryRunner: QueryRunner;
  schemaName: string;
  workspaceId: string;
};

export const seedAgents = async ({
  queryRunner,
  schemaName,
  workspaceId,
}: SeedAgentsArgs) => {
  if (workspaceId === SEED_SUKAMAJU_WORKSPACE_ID) {
    return;
  }

  const threadId = await seedChatThreads({
    queryRunner,
    schemaName,
    workspaceId,
  });

  await seedChatMessages({
    queryRunner,
    schemaName,
    workspaceId,
    threadId,
  });
};
