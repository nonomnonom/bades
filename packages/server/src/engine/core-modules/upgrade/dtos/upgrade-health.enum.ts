import { registerEnumType } from '@nestjs/graphql';

import { UpgradeHealthEnum } from 'shared/types';

export { UpgradeHealthEnum };

registerEnumType(UpgradeHealthEnum, {
  name: 'UpgradeHealth',
});
