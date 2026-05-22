import { msg } from 'src/utils/bades-i18n';
import { isValidUuid } from 'shared/utils';

import {
  WorkspaceQueryRunnerException,
  WorkspaceQueryRunnerExceptionCode,
} from 'src/engine/api/graphql/workspace-query-runner/workspace-query-runner.exception';

export const assertIsValidUuid = (value: string) => {
  if (!isValidUuid(value)) {
    throw new WorkspaceQueryRunnerException(
      `Value "${value}" is not a valid UUID`,
      WorkspaceQueryRunnerExceptionCode.INVALID_QUERY_INPUT,
      { userFriendlyMessage: msg`Invalid UUID format.` },
    );
  }
};
