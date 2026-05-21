import { type AgentResponseFieldType } from 'shared/ai';
import { msg } from '@lingui/core/macro';
import {
  IllustrationIconNumbers,
  IllustrationIconText,
  IllustrationIconToggle,
} from 'ui/display';

export interface OutputSchemaField {
  id: string;
  name: string;
  description?: string;
  type: AgentResponseFieldType | undefined;
}

export const OUTPUT_FIELD_TYPE_OPTIONS = [
  {
    label: "Teks",
    value: 'string' as const,
    Icon: IllustrationIconText,
  },
  {
    label: "Nomor",
    value: 'number' as const,
    Icon: IllustrationIconNumbers,
  },
  {
    label: msg`Boolean`,
    value: 'boolean' as const,
    Icon: IllustrationIconToggle,
  },
];
