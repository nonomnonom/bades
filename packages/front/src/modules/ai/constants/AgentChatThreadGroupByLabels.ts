import { type AgentChatThreadGroupBy } from '@/ai/types/AgentChatThreadGroupBy';

export const AGENT_CHAT_THREAD_GROUP_BY_LABELS: Record<
  AgentChatThreadGroupBy,
  string
> = {
  date: `Tanggal`,
  none: `Tidak dikelompokkan`,
};
