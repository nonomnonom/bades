import { t } from '~/utils/i18n/badesI18n';

export const getOperationTypeLabel = (key: string): string => {
  switch (key) {
    case 'AI_CHAT_TOKEN':
      return ""AI Chat";
    case 'AI_WORKFLOW_TOKEN':
      return ""AI Workflow";
    case 'WORKFLOW_EXECUTION':
      return ""Workflow Execution";
    case 'CODE_EXECUTION':
      return ""Code Execution";
    default:
      return key;
  }
};
