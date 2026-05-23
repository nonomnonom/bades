import { msg } from '~/utils/i18n/badesI18n';

import { type AgentChatThreadGroupBy } from '@/ai/types/AgentChatThreadGroupBy';

export const AGENT_CHAT_THREAD_GROUP_BY_LABELS: Record<
  AgentChatThreadGroupBy,
  string
> = {
  date: msg`Tanggal`,
  none: msg`Tidak dikelompokkan`,
};
