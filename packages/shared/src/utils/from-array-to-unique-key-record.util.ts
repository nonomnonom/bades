import { type StringPropertyKeys } from '@/utils/trim-and-remove-duplicated-whitespaces-from-object-string-properties';
import { isDefined } from '@/utils/validation';

export const fromArrayToUniqueKeyRecord = <T extends object>({
  array,
  uniqueKey,
}: {
  array: T[];
  uniqueKey: StringPropertyKeys<T>;
}) => {
  return array.reduce<Record<string, T>>((acc, occurrence) => {
    const currentUniqueKey = occurrence[uniqueKey] as string;

    if (isDefined(acc[currentUniqueKey])) {
      throw new Error(
        `Tidak seharusnya terjadi, array datar mengandung kunci unik yang sama dua kali: ${occurrence[uniqueKey]}`,
      );
    }

    return {
      ...acc,
      [currentUniqueKey]: occurrence,
    };
  }, {});
};
