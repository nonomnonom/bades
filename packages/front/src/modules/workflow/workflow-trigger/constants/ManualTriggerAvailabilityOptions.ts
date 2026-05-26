import { type WorkflowManualTriggerAvailability } from '@/workflow/types/Workflow';
import { IconCheckbox, type IconComponent, IconSquare } from 'ui/display';

export const MANUAL_TRIGGER_AVAILABILITY_OPTIONS: Array<{
  label: string;
  value: WorkflowManualTriggerAvailability;
  Icon: IconComponent;
}> = [
  {
    label: 'Saat rekaman dipilih',
    value: 'WHEN_RECORD_SELECTED',
    Icon: IconCheckbox,
  },
  {
    label: 'Saat tidak ada rekaman yang dipilih',
    value: 'EVERYWHERE',
    Icon: IconSquare,
  },
];
