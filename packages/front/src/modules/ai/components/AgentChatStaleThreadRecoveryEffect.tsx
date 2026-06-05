import { useEffect } from 'react';
import { isValidUuid } from 'shared/utils';

import { AGENT_CHAT_NEW_THREAD_DRAFT_KEY } from '@/ai/states/agentChatDraftsByThreadIdState';
import { agentChatVisibleThreadsSelector } from '@/ai/states/selectors/agentChatVisibleThreadsSelector';
import { currentAiChatThreadState } from '@/ai/states/currentAiChatThreadState';
import { hasInitializedAgentChatThreadsState } from '@/ai/states/hasInitializedAgentChatThreadsState';
import { useSwitchToNewAiChat } from '@/ai/hooks/useSwitchToNewAiChat';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';

export const AgentChatStaleThreadRecoveryEffect = () => {
  const currentAiChatThread = useAtomStateValue(currentAiChatThreadState);
  const agentChatVisibleThreads = useAtomStateValue(
    agentChatVisibleThreadsSelector,
  );
  const hasInitializedAgentChatThreads = useAtomStateValue(
    hasInitializedAgentChatThreadsState,
  );
  const { switchToNewChat } = useSwitchToNewAiChat();

  useEffect(() => {
    if (
      !hasInitializedAgentChatThreads ||
      currentAiChatThread === null ||
      currentAiChatThread === AGENT_CHAT_NEW_THREAD_DRAFT_KEY ||
      !isValidUuid(currentAiChatThread)
    ) {
      return;
    }

    const threadExists = agentChatVisibleThreads.some(
      (thread) => thread.id === currentAiChatThread,
    );

    if (!threadExists) {
      switchToNewChat();
    }
  }, [
    agentChatVisibleThreads,
    currentAiChatThread,
    hasInitializedAgentChatThreads,
    switchToNewChat,
  ]);

  return null;
};
