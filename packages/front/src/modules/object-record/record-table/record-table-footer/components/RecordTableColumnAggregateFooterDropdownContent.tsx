import { useLingui } from '~/utils/i18n/badesI18n';
import { useDropdownContextStateManagement } from '@/dropdown-context-state-management/hooks/useDropdownContextStateManagement';
import { type AggregateOperations } from '@/object-record/record-table/constants/AggregateOperations';
import { type DateAggregateOperations } from '@/object-record/record-table/constants/DateAggregateOperations';
import { RecordTableColumnAggregateFooterDropdownSubmenuContent } from '@/object-record/record-table/record-table-footer/components/RecordTableColumnAggregateDropdownSubmenuContent';
import { RecordTableColumnAggregateFooterDropdownContext } from '@/object-record/record-table/record-table-footer/components/RecordTableColumnAggregateFooterDropdownContext';
import { RecordTableColumnAggregateFooterMenuContent } from '@/object-record/record-table/record-table-footer/components/RecordTableColumnAggregateFooterMenuContent';
import { COUNT_AGGREGATE_OPERATION_OPTIONS } from '@/object-record/record-table/record-table-footer/constants/countAggregateOperationOptions';
import { DATE_AGGREGATE_OPERATION_OPTIONS } from '@/object-record/record-table/record-table-footer/constants/dateAggregateOperationOptions';
import { PERCENT_AGGREGATE_OPERATION_OPTIONS } from '@/object-record/record-table/record-table-footer/constants/percentAggregateOperationOptions';
import { STANDARD_AGGREGATE_OPERATION_OPTIONS } from '@/object-record/record-table/record-table-footer/constants/standardAggregateOperationOptions';
import { getAvailableAggregateOperationsForFieldMetadataType } from '@/object-record/record-table/record-table-footer/utils/getAvailableAggregateOperationsForFieldMetadataType';


export const RecordTableColumnAggregateFooterDropdownContent = () => {
  const { t } = useLingui();
  const { currentContentId, fieldMetadataType } =
    useDropdownContextStateManagement({
      context: RecordTableColumnAggregateFooterDropdownContext,
    });

  const availableAggregateOperations =
    getAvailableAggregateOperationsForFieldMetadataType({
      fieldMetadataType: fieldMetadataType,
    });

  switch (currentContentId) {
    case 'moreAggregateOperationOptions': {
      const aggregateOperations = availableAggregateOperations.filter(
        (aggregateOperation) =>
          !STANDARD_AGGREGATE_OPERATION_OPTIONS.includes(
            aggregateOperation as AggregateOperations,
          ),
      );

      return (
        <RecordTableColumnAggregateFooterDropdownSubmenuContent
          aggregateOperations={aggregateOperations}
          title={t`Opsi lainnya`}
        />
      );
    }
    case 'countAggregateOperationsOptions': {
      const aggregateOperations = availableAggregateOperations.filter(
        (aggregateOperation) =>
          COUNT_AGGREGATE_OPERATION_OPTIONS.includes(
            aggregateOperation as AggregateOperations,
          ),
      );
      return (
        <RecordTableColumnAggregateFooterDropdownSubmenuContent
          aggregateOperations={aggregateOperations}
          title={t`Jumlah`}
        />
      );
    }
    case 'percentAggregateOperationsOptions': {
      const aggregateOperations = availableAggregateOperations.filter(
        (aggregateOperation) =>
          PERCENT_AGGREGATE_OPERATION_OPTIONS.includes(
            aggregateOperation as AggregateOperations,
          ),
      );
      return (
        <RecordTableColumnAggregateFooterDropdownSubmenuContent
          aggregateOperations={aggregateOperations}
          title={t`Persentase`}
        />
      );
    }
    case 'datesAggregateOperationsOptions': {
      const aggregateOperations = availableAggregateOperations.filter(
        (aggregateOperation) =>
          DATE_AGGREGATE_OPERATION_OPTIONS.includes(
            aggregateOperation as DateAggregateOperations,
          ),
      );
      return (
        <RecordTableColumnAggregateFooterDropdownSubmenuContent
          aggregateOperations={aggregateOperations}
          title={t`Tanggal`}
        />
      );
    }
    default:
      return <RecordTableColumnAggregateFooterMenuContent />;
  }
};
