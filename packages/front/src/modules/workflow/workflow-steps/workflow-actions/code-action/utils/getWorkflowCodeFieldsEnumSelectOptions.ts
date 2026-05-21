import { isNonEmptyArray } from '@sniptt/guards';
import { isDefined } from 'shared/utils';
import { type InputSchemaProperty } from 'shared/workflow';
import { type SelectOption } from 'ui/input';

export const getWorkflowCodeFieldsEnumSelectOptions = (
  property: InputSchemaProperty | undefined,
): SelectOption[] => {
  if (!isDefined(property) || !isNonEmptyArray(property.enum)) {
    return [];
  }

  return property.enum.map((value) => ({
    value,
    label: value,
  }));
};
