import { type I18n } from 'src/utils/bades-i18n';

import { isDefined } from 'shared/utils';

import { generateMessageId } from 'src/engine/core-modules/i18n/utils/generateMessageId';
import { type PageLayoutTabOverrides } from 'src/engine/metadata-modules/page-layout-tab/entities/page-layout-tab.entity';

export const resolvePageLayoutTabTitle = ({
  title,
  applicationId,
  badesStandardApplicationId,
  overrides,
  i18nInstance,
}: {
  title: string;
  applicationId: string;
  badesStandardApplicationId: string;
  overrides?: PageLayoutTabOverrides | null;
  i18nInstance: I18n;
}): string => {
  if (applicationId !== badesStandardApplicationId) {
    return title;
  }

  if (isDefined(overrides?.title)) {
    return title;
  }

  const messageId = generateMessageId(title);
  const translatedMessage = i18nInstance._(messageId);

  if (translatedMessage === messageId) {
    return title;
  }

  return translatedMessage;
};
