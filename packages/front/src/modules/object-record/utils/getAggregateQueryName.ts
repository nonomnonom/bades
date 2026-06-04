import { capitalize, isDefined } from 'shared/utils';
export const getAggregateQueryName = (
  objectMetadataNamePlural: string,
): string => {
  if (!isDefined(objectMetadataNamePlural)) {
    throw new Error('objectMetadataNamePlural wajib diisi');
  }
  return `Aggregate${capitalize(objectMetadataNamePlural)}`;
};
