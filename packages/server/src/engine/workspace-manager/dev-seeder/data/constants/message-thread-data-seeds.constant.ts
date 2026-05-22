type MessageThreadDataSeed = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  subject: string;
};

export const MESSAGE_THREAD_DATA_SEED_COLUMNS: (keyof MessageThreadDataSeed)[] =
  ['id', 'createdAt', 'updatedAt', 'deletedAt', 'subject'];

const EMAIL_SUBJECTS = [
  'Meeting Request',
  'Project Update',
  'Invoice for Services',
  'Thank You for the Meeting',
  'Proposal Submission',
  'Follow-up on Discussion',
  'Customer Feedback',
  'Training Session Reminder',
  'Contract Renewal',
  'Quarterly Report',
  'Partnership Opportunity',
  'Event Invitation',
];

const GENERATE_MESSAGE_THREAD_IDS = (): Record<string, string> => {
  const THREAD_IDS: Record<string, string> = {};

  for (let INDEX = 1; INDEX <= 300; INDEX++) {
    const HEX_INDEX = INDEX.toString(16).padStart(4, '0');

    THREAD_IDS[`ID_${INDEX}`] = `20202020-${HEX_INDEX}-4e7c-8001-123456789def`;
  }

  return THREAD_IDS;
};

export const MESSAGE_THREAD_DATA_SEED_IDS = GENERATE_MESSAGE_THREAD_IDS();

export const MESSAGE_THREAD_DATA_SEEDS: MessageThreadDataSeed[] = [];
