import { msg } from '~/utils/i18n/badesI18n';

import { type AgentChatThreadFilterStatus } from '@/ai/types/AgentChatThreadFilterStatus';

export const AGENT_CHAT_THREAD_FILTER_STATUS_LABELS: Record<
  AgentChatThreadFilterStatus,
  string
> = {
  active: msg`Aktif`,
  archived: msg`Diarsipkan`,
  all: msg`Semua`,
};
