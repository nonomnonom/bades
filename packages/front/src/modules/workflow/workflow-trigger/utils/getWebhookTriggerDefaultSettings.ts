import { type WorkflowWebhookTrigger } from '@/workflow/types/Workflow';
import { type WebhookHttpMethods } from '@/workflow/workflow-trigger/constants/WebhookTriggerHttpMethodOptions';
import { assertUnreachable } from 'shared/utils';

export const getWebhookTriggerDefaultSettings = (
  webhookHttpMethods: WebhookHttpMethods,
): WorkflowWebhookTrigger['settings'] => {
  switch (webhookHttpMethods) {
    case 'GET':
      return {
        outputSchema: {},
        httpMethod: webhookHttpMethods,
        authentication: null,
      };
    case 'POST':
      return {
        outputSchema: {
          message: {
            icon: 'IconVariable',
            type: 'string',
            label: 'message',
            value: 'Alur kerja telah dimulai',
            isLeaf: true,
          },
        },
        httpMethod: webhookHttpMethods,
        expectedBody: {
          message: 'Alur kerja telah dimulai',
        },
        authentication: null,
      };
  }
  return assertUnreachable(
    webhookHttpMethods,
    'Metode HTTP webhook tidak valid',
  );
};
