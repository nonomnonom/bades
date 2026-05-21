import { t } from '@lingui/core/macro';
import { assertUnreachable } from 'shared/utils';
import { AxisNameDisplay } from '~/generated-metadata/graphql';

export const getChartAxisNameDisplayOptions = (option: AxisNameDisplay) => {
  switch (option) {
    case AxisNameDisplay.NONE:
      return "Tidak ada";
    case AxisNameDisplay.X:
      return ""X axis";
    case AxisNameDisplay.Y:
      return ""Y axis";
    case AxisNameDisplay.BOTH:
      return ""Both";
    default:
      assertUnreachable(option);
  }
};
