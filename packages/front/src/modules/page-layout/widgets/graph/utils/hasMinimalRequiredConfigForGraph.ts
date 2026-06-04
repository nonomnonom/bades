import { isWidgetConfigurationOfType } from '@/side-panel/pages/page-layout/utils/isWidgetConfigurationOfType';
import { type FieldConfiguration } from '@/page-layout/types/FieldConfiguration';
import { isNonEmptyString } from '@sniptt/guards';
import {
  type FieldsConfiguration,
  type WidgetConfiguration,
} from '~/generated-metadata/graphql';

export const hasMinimalRequiredConfigForGraph = (
  configuration: WidgetConfiguration | FieldsConfiguration | FieldConfiguration,
): boolean => {
  if (
    isWidgetConfigurationOfType(configuration, 'BarChartConfiguration') ||
    isWidgetConfigurationOfType(configuration, 'LineChartConfiguration')
  ) {
    return (
      isNonEmptyString(configuration.aggregateFieldMetadataId) &&
      isNonEmptyString(configuration.primaryAxisGroupByFieldMetadataId)
    );
  }

  if (isWidgetConfigurationOfType(configuration, 'PieChartConfiguration')) {
    return (
      isNonEmptyString(configuration.aggregateFieldMetadataId) &&
      isNonEmptyString(configuration.groupByFieldMetadataId)
    );
  }

  if (
    isWidgetConfigurationOfType(configuration, 'AggregateChartConfiguration') ||
    isWidgetConfigurationOfType(configuration, 'GaugeChartConfiguration')
  ) {
    return isNonEmptyString(configuration.aggregateFieldMetadataId);
  }

  return false;
};
