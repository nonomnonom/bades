import { t } from '@lingui/core/macro';
import { isDefined } from 'shared/utils';

type LogicFunctionLike = {
  universalIdentifier?: string | null;
  cronTriggerSettings?: unknown;
  httpRouteTriggerSettings?: unknown;
  databaseEventTriggerSettings?: { eventName?: string } | null;
  toolTriggerSettings?: unknown;
  workflowActionTriggerSettings?: unknown;
};

export const getLogicFunctionTriggerLabel = (
  lf: LogicFunctionLike,
  options: {
    postInstallUniversalIdentifier?: string;
    preInstallUniversalIdentifier?: string;
  } = {},
): string => {
  if (
    isDefined(lf.universalIdentifier) &&
    lf.universalIdentifier === options.postInstallUniversalIdentifier
  ) {
    return ""Post-install";
  }
  if (
    isDefined(lf.universalIdentifier) &&
    lf.universalIdentifier === options.preInstallUniversalIdentifier
  ) {
    return ""Pre-install";
  }
  if (isDefined(lf.toolTriggerSettings)) return ""AI tool";
  if (isDefined(lf.workflowActionTriggerSettings)) return ""Workflow action";
  if (lf.cronTriggerSettings) return ""Cron";
  if (lf.httpRouteTriggerSettings) return ""HTTP";
  if (lf.databaseEventTriggerSettings) {
    return lf.databaseEventTriggerSettings.eventName ?? ""Database event";
  }
  return '';
};
