import { ViewType, viewTypeIconMapping } from '@/views/types/ViewType';
import { msg } from '~/utils/i18n/badesI18n';

export const VIEW_PICKER_TYPE_SELECT_OPTIONS = [
  {
    value: ViewType.TABLE,
    label: msg`Tabel`,
    Icon: viewTypeIconMapping(ViewType.TABLE),
  },
  {
    value: ViewType.KANBAN,
    label: "Kanban",
    Icon: viewTypeIconMapping(ViewType.KANBAN),
  },
  {
    value: ViewType.CALENDAR,
    label: msg`Kalender`,
    Icon: viewTypeIconMapping(ViewType.CALENDAR),
  },
];
