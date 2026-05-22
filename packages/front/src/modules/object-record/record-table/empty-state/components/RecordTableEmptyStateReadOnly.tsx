import { t } from '~/utils/i18n/badesI18n';
import { useObjectLabel } from '@/object-metadata/hooks/useObjectLabel';
import { useRecordTableContextOrThrow } from '@/object-record/record-table/contexts/RecordTableContext';
import { RecordTableEmptyStateDisplay } from '@/object-record/record-table/empty-state/components/RecordTableEmptyStateDisplay';
import { IconPlus } from 'ui/display';

export const RecordTableEmptyStateReadOnly = () => {
  const { objectMetadataItem } = useRecordTableContextOrThrow();

  const objectLabelSingular = useObjectLabel(objectMetadataItem);

  const buttonTitle = `Add a ${objectLabelSingular}`;

  return (
    <RecordTableEmptyStateDisplay
      title={t`Tidak ada data ditemukan`}
      subTitle={t`Anda tidak memiliki izin untuk membuat data pada objek ini`}
      animatedPlaceholderType="noRecord"
      buttonTitle={buttonTitle}
      ButtonIcon={IconPlus}
      buttonIsDisabled={true}
    />
  );
};
