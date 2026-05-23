import { type TableMetadata } from '@/ui/layout/table/types/TableMetadata';
import { msg } from '~/utils/i18n/badesI18n';

export type MockedTableType = {
  labelPlural: string;
  fieldsCount: number;
};

export const mockedTableMetadata: TableMetadata<MockedTableType> = {
  tableId: 'SettingsObjectDetail',
  fields: [
    {
      fieldName: 'labelPlural',
      fieldType: 'string',
      align: 'left',
      fieldLabel: "Nama",
    },
    {
      fieldName: 'fieldsCount',
      fieldType: 'number',
      align: 'right',
      fieldLabel: "Fields Count",
    },
  ],
};

export const mockedTableData = [
  {
    labelPlural: 'Permohonan Layanan',
    fieldsCount: 11,
  },
  {
    labelPlural: 'Penduduk',
    fieldsCount: 3,
  },
  {
    labelPlural: 'Program Bantuan',
    fieldsCount: 4,
  },
  {
    labelPlural: 'Kegiatan Desa',
    fieldsCount: 5,
  },
];

export const tableDataSortedBylabelInAscendingOrder = [
  { labelPlural: 'Kegiatan Desa', fieldsCount: 5 },
  { labelPlural: 'Penduduk', fieldsCount: 3 },
  { labelPlural: 'Permohonan Layanan', fieldsCount: 11 },
  { labelPlural: 'Program Bantuan', fieldsCount: 4 },
];

export const tableDataSortedBylabelInDescendingOrder = [
  { labelPlural: 'Program Bantuan', fieldsCount: 4 },
  { labelPlural: 'Permohonan Layanan', fieldsCount: 11 },
  { labelPlural: 'Penduduk', fieldsCount: 3 },
  { labelPlural: 'Kegiatan Desa', fieldsCount: 5 },
];

export const tableDataSortedByFieldsCountInAscendingOrder = [
  { labelPlural: 'Penduduk', fieldsCount: 3 },
  { labelPlural: 'Program Bantuan', fieldsCount: 4 },
  { labelPlural: 'Kegiatan Desa', fieldsCount: 5 },
  { labelPlural: 'Permohonan Layanan', fieldsCount: 11 },
];

export const tableDataSortedByFieldsCountInDescendingOrder = [
  { labelPlural: 'Permohonan Layanan', fieldsCount: 11 },
  { labelPlural: 'Kegiatan Desa', fieldsCount: 5 },
  { labelPlural: 'Program Bantuan', fieldsCount: 4 },
  { labelPlural: 'Penduduk', fieldsCount: 3 },
];
