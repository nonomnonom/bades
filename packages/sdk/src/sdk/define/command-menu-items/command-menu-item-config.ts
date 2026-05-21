import { type CommandMenuItemManifest } from 'shared/application';

export type CommandMenuItemConfig = Omit<
  CommandMenuItemManifest,
  'conditionalAvailabilityExpression'
> & {
  conditionalAvailabilityExpression?: boolean | string;
};
