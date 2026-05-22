import { type ErrorLike } from '@apollo/client';
import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { type MessageDescriptor } from '~/utils/i18n/badesI18n';
import { t } from '~/utils/i18n/badesI18n';
import { type Nullable } from 'shared/types';
import { isDefined } from 'shared/utils';

export const getErrorMessageFromApolloError = (error: ErrorLike): string => {
  if (!CombinedGraphQLErrors.is(error)) {
    return error.message ?? t`An error occurred.`;
  }

  const userFriendlyMessage = error.errors?.[0]?.extensions
    ?.userFriendlyMessage as Nullable<MessageDescriptor | string>;

  if (!isDefined(userFriendlyMessage)) {
    return t`An error occurred.`;
  }

  return t(userFriendlyMessage);
};
