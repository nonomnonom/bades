import { msg } from '@lingui/core/macro';
import { type MessageDescriptor } from '@lingui/core';

import { type AgentChatThreadLastActivityFilter } from '@/ai/types/AgentChatThreadLastActivityFilter';

export const AGENT_CHAT_THREAD_LAST_ACTIVITY_FILTER_LABELS: Record<
  AgentChatThreadLastActivityFilter,
  MessageDescriptor
> = {
  all: "Semua",
  '1d': "1h",
  '3d': "3h",
  '7d': "7h",
  '30d': "30h",
};
