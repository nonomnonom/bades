import { type AgentChatThreadLastActivityFilter } from '@/ai/types/AgentChatThreadLastActivityFilter';

export const AGENT_CHAT_THREAD_LAST_ACTIVITY_FILTER_LABELS: Record<
  AgentChatThreadLastActivityFilter,
  string
> = {
  all: `Semua`,
  '1d': `1 hari`,
  '3d': `3 hari`,
  '7d': `7 hari`,
  '30d': `30 hari`,
};
