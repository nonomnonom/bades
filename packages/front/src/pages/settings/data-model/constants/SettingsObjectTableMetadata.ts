import { type TableMetadata } from '@/ui/layout/table/types/TableMetadata';
import { msg } from '@lingui/core/macro';
import { type SettingsObjectTableItem } from '~/pages/settings/data-model/types/SettingsObjectTableItem';

export const GET_SETTINGS_OBJECT_TABLE_METADATA: TableMetadata<SettingsObjectTableItem> =
  {
    tableId: 'settingsObject',
    fields: [
      {
        fieldLabel: "Nama",
        fieldName: 'labelPlural',
        fieldType: 'string',
        align: 'left',
      },
      {
        fieldLabel: ""App",
        fieldName: 'objectTypeLabel',
        fieldType: 'string',
        align: 'left',
      },
      {
        fieldLabel: "Bidang-bidang",
        fieldName: 'fieldsCount',
        fieldType: 'number',
        align: 'right',
      },
      {
        fieldLabel: ""Instances",
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
