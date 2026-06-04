import { type RecordTableWidgetViewSnapshot } from '@/page-layout/widgets/record-table/types/RecordTableWidgetViewSnapshot';
import { ViewType } from '@/views/types/ViewType';
import { isDefined } from 'shared/utils';
import {
  type PageLayoutWidget,
  WidgetConfigurationType,
} from '~/generated-metadata/graphql';

const isRecordTableDisplayViewType = (
  value: unknown,
): value is ViewType.TABLE | ViewType.MAP => {
  return (
    value === ViewType.TABLE ||
    value === ViewType.MAP ||
    value === 'TABLE' ||
    value === 'MAP'
  );
};

const toRecordTableDisplayViewType = (
  value: unknown,
): ViewType.TABLE | ViewType.MAP => {
  if (value === ViewType.MAP || value === 'MAP') {
    return ViewType.MAP;
  }

  return ViewType.TABLE;
};

export const getRecordTableWidgetDisplayViewType = ({
  widget,
  draftSnapshot,
}: {
  widget?: PageLayoutWidget;
  draftSnapshot?: RecordTableWidgetViewSnapshot;
}): ViewType.TABLE | ViewType.MAP => {
  if (isDefined(draftSnapshot?.displayViewType)) {
    return draftSnapshot.displayViewType;
  }

  const configuration = widget?.configuration;

  if (
    isDefined(configuration) &&
    configuration.configurationType === WidgetConfigurationType.RECORD_TABLE &&
    'displayViewType' in configuration &&
    isRecordTableDisplayViewType(configuration.displayViewType)
  ) {
    return toRecordTableDisplayViewType(configuration.displayViewType);
  }

  return ViewType.TABLE;
};
