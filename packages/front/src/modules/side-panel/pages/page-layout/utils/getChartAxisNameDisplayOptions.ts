import { assertUnreachable } from 'shared/utils';
import { AxisNameDisplay } from '~/generated-metadata/graphql';

export const getChartAxisNameDisplayOptions = (option: AxisNameDisplay) => {
  switch (option) {
    case AxisNameDisplay.NONE:
      return `Tidak ada`;
    case AxisNameDisplay.X:
      return `Sumbu X`;
    case AxisNameDisplay.Y:
      return `Sumbu Y`;
    case AxisNameDisplay.BOTH:
      return `Keduanya`;
    default:
      assertUnreachable(option);
  }
};
