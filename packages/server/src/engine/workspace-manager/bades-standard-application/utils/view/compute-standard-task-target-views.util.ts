import { ViewType, ViewKey } from 'shared/types';

import { type FlatView } from 'src/engine/metadata-modules/flat-view/types/flat-view.type';
import {
  createStandardViewFlatMetadata,
  type CreateStandardViewArgs,
} from 'src/engine/workspace-manager/bades-standard-application/utils/view/create-standard-view-flat-metadata.util';

export const computeStandardTaskTargetViews = (
  args: Omit<CreateStandardViewArgs<'taskTarget'>, 'context'>,
): Record<string, FlatView> => {
  return {
    allTaskTargets: createStandardViewFlatMetadata({
      ...args,
      objectName: 'taskTarget',
      context: {
        viewName: 'allTaskTargets',
        name: 'Semua {objectLabelPlural}',
        type: ViewType.TABLE,
        key: ViewKey.INDEX,
        position: 0,
        icon: 'IconList',
      },
    }),
  };
};
