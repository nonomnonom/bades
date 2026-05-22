import { type AgentResponseFieldType } from 'shared/ai';
import { msg } from '~/utils/i18n/badesI18n';
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
    label: msg`Teks`,
    value: 'string' as const,
    Icon: IllustrationIconText,
  },
  {
    label: msg`Angka`,
    value: 'number' as const,
    Icon: IllustrationIconNumbers,
  },
  {
    label: msg`Ya/Tidak`,
    value: 'boolean' as const,
    Icon: IllustrationIconToggle,
  },
];
