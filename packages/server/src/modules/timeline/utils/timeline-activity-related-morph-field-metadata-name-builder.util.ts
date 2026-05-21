import { capitalize } from 'shared/utils';

export const buildTimelineActivityRelatedMorphFieldMetadataName = (
  name: string,
) => {
  return `target${capitalize(name)}`;
};
