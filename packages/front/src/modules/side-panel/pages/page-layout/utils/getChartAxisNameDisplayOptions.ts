import { t } from '@lingui/core/macro';
import { assertUnreachable } from 'shared/utils';
import { AxisNameDisplay } from '~/generated-metadata/graphql';

export const getChartAxisNameDisplayOptions = (option: AxisNameDisplay) => {
  switch (option) {
    case AxisNameDisplay.NONE:
      return t`Tidak ada`;
    case AxisNameDisplay.X:
      return t`Sumbu X`;
    case AxisNameDisplay.Y:
      return t`Sumbu Y`;
    case AxisNameDisplay.BOTH:
      return t`Keduanya`;
    default:
      assertUnreachable(option);
  }
};
