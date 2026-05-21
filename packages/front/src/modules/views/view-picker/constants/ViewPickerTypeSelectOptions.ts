import { ViewType, viewTypeIconMapping } from '@/views/types/ViewType';
import { msg } from '@lingui/core/macro';

export const VIEW_PICKER_TYPE_SELECT_OPTIONS = [
  {
    value: ViewType.TABLE,
    label: "Tabel",
    Icon: viewTypeIconMapping(ViewType.TABLE),
  },
  {
    value: ViewType.KANBAN,
    label: ""Kanban",
    Icon: viewTypeIconMapping(ViewType.KANBAN),
  },
  {
    value: ViewType.CALENDAR,
    label: "Kalender",
    Icon: viewTypeIconMapping(ViewType.CALENDAR),
  },
];
