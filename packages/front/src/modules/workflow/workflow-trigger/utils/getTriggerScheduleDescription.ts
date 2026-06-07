import { type WorkflowCronTrigger } from '@/workflow/types/Workflow';
import { describeCronExpression } from '@/workflow/workflow-trigger/utils/cron-to-human/describeCronExpression';
import { convertScheduleToCronExpression } from '@/workflow/workflow-trigger/utils/cron-to-human/utils/convertScheduleToCronExpression';
export const getTriggerScheduleDescription = (
  trigger: WorkflowCronTrigger,
  localeCatalog?: Locale,
): string | null => {
  const cronExpression = convertScheduleToCronExpression(trigger);

  if (!cronExpression) {
    return null;
  }

  try {
    return describeCronExpression(
      cronExpression,
      { use24HourTimeFormat: true },
      localeCatalog,
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : `Ekspresi cron tidak valid`;
    return errorMessage;
  }
};
