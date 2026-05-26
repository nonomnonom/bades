import { BACKGROUND_MOCK_COLUMN_WIDTHS } from '@/sign-in-background-mock/constants/BackgroundMockColumnWidths';

export type BackgroundMockColumn = {
  label: keyof typeof BACKGROUND_MOCK_COLUMN_WIDTHS;
  iconName: string;
  width: number;
};

export const BACKGROUND_MOCK_COLUMNS = [
  {
    label: 'Nama',
    iconName: 'IconBuilding',
    width: BACKGROUND_MOCK_COLUMN_WIDTHS.Nama,
  },
  {
    label: 'Alamat',
    iconName: 'IconMap',
    width: BACKGROUND_MOCK_COLUMN_WIDTHS.Alamat,
  },
  {
    label: 'Pengurus',
    iconName: 'IconUserCircle',
    width: BACKGROUND_MOCK_COLUMN_WIDTHS.Pengurus,
  },
  {
    label: 'Penanggung jawab',
    iconName: 'IconUserCircle',
    width: BACKGROUND_MOCK_COLUMN_WIDTHS['Penanggung jawab'],
  },
  {
    label: 'Waktu dibuat',
    iconName: 'IconCalendar',
    width: BACKGROUND_MOCK_COLUMN_WIDTHS['Waktu dibuat'],
  },
  {
    label: 'Anggota',
    iconName: 'IconUsers',
    width: BACKGROUND_MOCK_COLUMN_WIDTHS.Anggota,
  },
] satisfies BackgroundMockColumn[];
