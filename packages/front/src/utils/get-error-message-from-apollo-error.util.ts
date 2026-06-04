import { type ErrorLike } from '@apollo/client';
import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { type MessageDescriptor, t } from '~/utils/i18n/badesI18n';
import { type Nullable } from 'shared/types';
import { isDefined } from 'shared/utils';

export const getErrorMessageFromApolloError = (error: ErrorLike): string => {
  if (!CombinedGraphQLErrors.is(error)) {
    return error.message ?? 'Terjadi kesalahan.';
  }

  const userFriendlyMessage = error.errors?.[0]?.extensions
    ?.userFriendlyMessage as Nullable<MessageDescriptor | string>;

  if (!isDefined(userFriendlyMessage)) {
    return 'Terjadi kesalahan.';
  }

  return t(userFriendlyMessage);
};
