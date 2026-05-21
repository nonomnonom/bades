import { RATING_VALUES } from 'shared/constants';
import { type FieldRatingValue } from 'shared/types';

export const isFieldRatingValue = (
  fieldValue: unknown,
): fieldValue is FieldRatingValue =>
  RATING_VALUES.includes(fieldValue as NonNullable<FieldRatingValue>);
