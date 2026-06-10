import { type TableMetadata } from '@/ui/layout/table/types/TableMetadata';

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
      fieldLabel: 'Nama',
    },
    {
      fieldName: 'fieldsCount',
      fieldType: 'number',
      align: 'right',
      fieldLabel: 'Fields Count',
    },
  ],
};

export const mockedTableData = [
  {
    labelPlural: 'Penduduk',
    fieldsCount: 23,
  },
  {
    labelPlural: 'Keluarga',
    fieldsCount: 13,
  },
  {
    labelPlural: 'Wilayah',
    fieldsCount: 10,
  },
  {
    labelPlural: 'Aset Desa',
    fieldsCount: 15,
  },
];

export const tableDataSortedBylabelInAscendingOrder = [
  { labelPlural: 'Aset Desa', fieldsCount: 15 },
  { labelPlural: 'Keluarga', fieldsCount: 13 },
  { labelPlural: 'Penduduk', fieldsCount: 23 },
  { labelPlural: 'Wilayah', fieldsCount: 10 },
];

export const tableDataSortedBylabelInDescendingOrder = [
  { labelPlural: 'Wilayah', fieldsCount: 10 },
  { labelPlural: 'Penduduk', fieldsCount: 23 },
  { labelPlural: 'Keluarga', fieldsCount: 13 },
  { labelPlural: 'Aset Desa', fieldsCount: 15 },
];

export const tableDataSortedByFieldsCountInAscendingOrder = [
  { labelPlural: 'Wilayah', fieldsCount: 10 },
  { labelPlural: 'Keluarga', fieldsCount: 13 },
  { labelPlural: 'Aset Desa', fieldsCount: 15 },
  { labelPlural: 'Penduduk', fieldsCount: 23 },
];

export const tableDataSortedByFieldsCountInDescendingOrder = [
  { labelPlural: 'Penduduk', fieldsCount: 23 },
  { labelPlural: 'Aset Desa', fieldsCount: 15 },
  { labelPlural: 'Keluarga', fieldsCount: 13 },
  { labelPlural: 'Wilayah', fieldsCount: 10 },
];
