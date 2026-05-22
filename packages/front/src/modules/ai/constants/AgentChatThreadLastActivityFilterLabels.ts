import { msg } from '~/utils/i18n/badesI18n';

import { type AgentChatThreadLastActivityFilter } from '@/ai/types/AgentChatThreadLastActivityFilter';

export const AGENT_CHAT_THREAD_LAST_ACTIVITY_FILTER_LABELS: Record<
  AgentChatThreadLastActivityFilter,
  string
> = {
  all: msg`Semua`,
  '1d': msg`1 hari`,
  '3d': msg`3 hari`,
  '7d': msg`7 hari`,
  '30d': msg`30 hari`,
};
