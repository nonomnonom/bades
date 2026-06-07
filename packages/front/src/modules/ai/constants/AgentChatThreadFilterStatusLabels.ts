import { type AgentChatThreadFilterStatus } from '@/ai/types/AgentChatThreadFilterStatus';

export const AGENT_CHAT_THREAD_FILTER_STATUS_LABELS: Record<
  AgentChatThreadFilterStatus,
  string
> = {
  active: `Aktif`,
  archived: `Diarsipkan`,
  all: `Semua`,
};
