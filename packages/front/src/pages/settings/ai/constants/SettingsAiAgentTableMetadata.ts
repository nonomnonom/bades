import { msg } from '~/utils/i18n/badesI18n';
import { type TableMetadata } from '@/ui/layout/table/types/TableMetadata';
import { type Agent } from '~/generated-metadata/graphql';

export const SETTINGS_AI_AGENT_TABLE_METADATA: TableMetadata<Agent> = {
  tableId: 'settingsAiAgent',
  fields: [
    {
      fieldLabel: msg`Nama`,
      fieldName: 'name',
      fieldType: 'string',
      align: 'left',
    },
    {
      fieldLabel: msg`Tipe`,
      fieldName: 'isCustom',
      fieldType: 'string',
      align: 'left',
    },
  ],
  initialSort: {
    fieldName: 'name',
    orderBy: 'AscNullsLast',
  },
};
