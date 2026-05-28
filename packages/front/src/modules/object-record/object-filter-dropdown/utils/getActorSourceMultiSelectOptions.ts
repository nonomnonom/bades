import { type SelectableItem } from '@/object-record/select/types/SelectableItem';
import {
  IconApi,
  IconCsv,
  IconGmail,
  IconGoogleCalendar,
  IconRobot,
  IconSettingsAutomation,
  IconUserCircle,
  IconWebhook,
} from 'ui/display';

export const getActorSourceMultiSelectOptions = (
  selectedSourceNames: string[],
): SelectableItem[] => {
  return [
    {
      id: 'MANUAL',
      name: 'Manuel',
      isSelected: selectedSourceNames.includes('MANUAL'),
      AvatarIcon: IconUserCircle,
      isIconInverted: true,
    },
    {
      id: 'IMPORT',
      name: 'Impor',
      isSelected: selectedSourceNames.includes('IMPORT'),
      AvatarIcon: IconCsv,
      isIconInverted: true,
    },
    {
      id: 'API',
      name: 'API',
      isSelected: selectedSourceNames.includes('API'),
      AvatarIcon: IconApi,
      isIconInverted: true,
    },
    {
      id: 'EMAIL',
      name: 'Surel',
      isSelected: selectedSourceNames.includes('EMAIL'),
      AvatarIcon: IconGmail,
    },
    {
      id: 'CALENDAR',
      name: 'Kalender',
      isSelected: selectedSourceNames.includes('CALENDAR'),
      AvatarIcon: IconGoogleCalendar,
    },
    {
      id: 'WORKFLOW',
      name: 'Alur kerja',
      isSelected: selectedSourceNames.includes('WORKFLOW'),
      AvatarIcon: IconSettingsAutomation,
      isIconInverted: true,
    },
    {
      id: 'WEBHOOK',
      name: 'Web hook',
      isSelected: selectedSourceNames.includes('WEBHOOK'),
      AvatarIcon: IconWebhook,
      isIconInverted: true,
    },
    {
      id: 'SYSTEM',
      name: 'Sistem',
      isSelected: selectedSourceNames.includes('SYSTEM'),
      AvatarIcon: IconRobot,
      isIconInverted: true,
    },
  ];
};
