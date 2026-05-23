import { type FieldArrayValue } from '@/object-record/record-field/ui/types/FieldMetadata';
import { ExpandableList } from '@/ui/layout/expandable-list/components/ExpandableList';
import { t } from '~/utils/i18n/badesI18n';
import { Chip, ChipVariant } from 'ui/components';

type ArrayDisplayProps = {
  value: FieldArrayValue;
};

export const ArrayDisplay = ({ value }: ArrayDisplayProps) => {
  return (
    <ExpandableList>
      {value?.map((item, index) => (
        <Chip
          key={`${item}-${index}`}
          variant={ChipVariant.Highlighted}
          label={item}
          emptyLabel={t`Tanpa judul`}
        />
      ))}
    </ExpandableList>
  );
};
