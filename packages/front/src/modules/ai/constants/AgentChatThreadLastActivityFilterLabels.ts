import { msg } from '@lingui/core/macro';
import { type MessageDescriptor } from '@lingui/core';

import { type AgentChatThreadLastActivityFilter } from '@/ai/types/AgentChatThreadLastActivityFilter';

export const AGENT_CHAT_THREAD_LAST_ACTIVITY_FILTER_LABELS: Record<
  AgentChatThreadLastActivityFilter,
  MessageDescriptor
> = {
  all: msg`Semua`,
  '1d': msg`1 hari`,
  '3d': msg`3 hari`,
  '7d': msg`7 hari`,
  '30d': msg`30 hari`,
};
