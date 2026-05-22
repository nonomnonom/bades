import {
  IconBuildingSkyscraper,
  IconCalendarEvent,
  IconCheckbox,
  type IconComponent,
  IconFileText,
  IconHeart,
  IconHome,
  IconLayoutDashboard,
  IconNotes,
  IconUsers,
} from 'ui/display';
import { type ThemeColor } from 'ui/theme';

export type BackgroundMockNavigationItem = {
  label: string;
  Icon: IconComponent;
  color: ThemeColor;
};

export const BACKGROUND_MOCK_WORKSPACE_ITEMS = [
  { label: 'Penduduk', Icon: IconUsers, color: 'blue' },
  { label: 'Keluarga', Icon: IconHome, color: 'blue' },
  { label: 'Lembaga Desa', Icon: IconBuildingSkyscraper, color: 'green' },
  { label: 'Surat', Icon: IconFileText, color: 'purple' },
  { label: 'Bantuan Sosial', Icon: IconHeart, color: 'red' },
  { label: 'Tugas', Icon: IconCheckbox, color: 'turquoise' },
  { label: 'Catatan', Icon: IconNotes, color: 'turquoise' },
  { label: 'Dasbor', Icon: IconLayoutDashboard, color: 'orange' },
  { label: 'Agenda', Icon: IconCalendarEvent, color: 'yellow' },
] satisfies BackgroundMockNavigationItem[];
