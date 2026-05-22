import { msg } from '~/utils/i18n/badesI18n';
import { type TableMetadata } from '@/ui/layout/table/types/TableMetadata';
import { type SettingsObjectTableItem } from '~/pages/settings/data-model/types/SettingsObjectTableItem';

export const GET_SETTINGS_OBJECT_TABLE_METADATA: TableMetadata<SettingsObjectTableItem> =
  {
    tableId: 'settingsObject',
    fields: [
      {
        fieldLabel: msg`Nama`,
        fieldName: 'labelPlural',
        fieldType: 'string',
        align: 'left',
      },
      {
        fieldLabel: msg`Aplikasi`,
        fieldName: 'objectTypeLabel',
        fieldType: 'string',
        align: 'left',
      },
      {
        fieldLabel: msg`Kolom`,
        fieldName: 'fieldsCount',
        fieldType: 'number',
        align: 'right',
      },
      {
        fieldLabel: msg`Instansi`,
        fieldName: 'totalObjectCount',
        fieldType: 'number',
        align: 'right',
      },
    ],
    initialSort: {
      fieldName: 'labelPlural',
      orderBy: 'AscNullsLast',
    },
  };
