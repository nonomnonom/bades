import { TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER } from 'shared/application';
import { isDefined } from 'shared/utils';

type ApplicationLike = {
  universalIdentifier?: string | null;
};

export const isTwentyStandardApplication = (
  application: ApplicationLike | null | undefined,
): boolean =>
  isDefined(application?.universalIdentifier) &&
  application.universalIdentifier ===
    TWENTY_STANDARD_APPLICATION_UNIVERSAL_IDENTIFIER;
