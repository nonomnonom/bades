import { type TableMetadata } from '@/ui/layout/table/types/TableMetadata';
import { msg } from '@lingui/core/macro';

import { type Skill } from '~/generated-metadata/graphql';

export const SETTINGS_SKILL_TABLE_METADATA: TableMetadata<Skill> = {
  tableId: 'settingsSkill',
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
