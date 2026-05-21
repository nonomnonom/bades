import type { MessageDescriptor } from '@lingui/core';
import { msg } from '@lingui/core/macro';
import {
  type IconComponent,
  IconLayoutDashboard,
  IconPlus,
  IconSettingsAutomation,
} from 'ui/display';

export type SuggestedPrompt = {
  id: string;
  label: MessageDescriptor;
  Icon: IconComponent;
  prefillPrompts: MessageDescriptor[];
};

export const DEFAULT_SUGGESTED_PROMPTS: SuggestedPrompt[] = [
  {
    id: 'dashboard',
    label: msg`Create a dashboard`,
    Icon: IconLayoutDashboard,
    prefillPrompts: [
      msg`Create a dashboard with a chart of service requests by stage (Menunggu, Diproses, Selesai, Ditolak) for the current month, and a table of my top 10 open requests with applicant name, service type and expected completion date.`,
      msg`Build a dashboard that shows: (1) total service requests by stage for the last 3 months, (2) count of services completed vs rejected per month, (3) average processing time. Use our standard service stages.`,
      msg`I need a dashboard for resident services: number of new requests by type this month, how many were processed, and completion rate by type. Include a simple table and a bar chart.`,
    ],
  },
  {
    id: 'workflow',
    label: msg`Create a workflow`,
    Icon: IconSettingsAutomation,
    prefillPrompts: [
      msg`When a service request's stage changes to Completed, create a task assigned to the officer handling the request, due 7 days after the completion date, with title "Follow-up satisfaction check" and the resident name in the description.`,
      msg`When a new service request is created with type "Surat Keterangan Domisili", assign it to the village officer whose sector matches the resident's RT; if no match, assign to the village secretary.`,
      msg`When any service request with priority "Urgent" has its stage or priority updated, send a notification to the admin channel with the request name, resident name, new stage, priority and officer.`,
    ],
  },
  {
    id: 'record',
    label: msg`Create a record`,
    Icon: IconPlus,
    prefillPrompts: [
      msg`Add a new resident we are processing documents for (e.g. name, NIK, address). Details: `,
      msg`Create a new service request and link them to a resident. Details: `,
      msg`Log a new service request (resident name, service type, status, expected completion). Details: `,
    ],
  },
];
