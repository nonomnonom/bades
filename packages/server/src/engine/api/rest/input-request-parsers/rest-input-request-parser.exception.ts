import { msg, type MessageDescriptor } from 'src/utils/bades-i18n';
import { assertUnreachable } from 'shared/utils';

import { CustomException } from 'src/utils/custom-exception';

export enum RestInputRequestParserExceptionCode {
  INVALID_AGGREGATE_FIELDS_QUERY_PARAM = 'INVALID_AGGREGATE_FIELDS_QUERY_PARAM',
  INVALID_GROUP_BY_QUERY_PARAM = 'INVALID_GROUP_BY_QUERY_PARAM',
  INVALID_ORDER_BY_WITH_GROUP_BY_QUERY_PARAM = 'INVALID_ORDER_BY_WITH_GROUP_BY_QUERY_PARAM',
  INVALID_ORDER_BY_QUERY_PARAM = 'INVALID_ORDER_BY_QUERY_PARAM',
  INVALID_DEPTH_QUERY_PARAM = 'INVALID_DEPTH_QUERY_PARAM',
  INVALID_LIMIT_QUERY_PARAM = 'INVALID_LIMIT_QUERY_PARAM',
  INVALID_FILTER_QUERY_PARAM = 'INVALID_FILTER_QUERY_PARAM',
}

const getRestInputRequestParserExceptionUserFriendlyMessage = (
  code: RestInputRequestParserExceptionCode,
) => {
  switch (code) {
    case RestInputRequestParserExceptionCode.INVALID_AGGREGATE_FIELDS_QUERY_PARAM:
      return msg`Parameter kolom agregat tidak valid.`;
    case RestInputRequestParserExceptionCode.INVALID_GROUP_BY_QUERY_PARAM:
      return msg`Parameter group by tidak valid.`;
    case RestInputRequestParserExceptionCode.INVALID_ORDER_BY_WITH_GROUP_BY_QUERY_PARAM:
      return msg`Parameter order by dengan group by tidak valid.`;
    case RestInputRequestParserExceptionCode.INVALID_ORDER_BY_QUERY_PARAM:
      return msg`Parameter order by tidak valid.`;
    case RestInputRequestParserExceptionCode.INVALID_DEPTH_QUERY_PARAM:
      return msg`Parameter depth tidak valid.`;
    case RestInputRequestParserExceptionCode.INVALID_LIMIT_QUERY_PARAM:
      return msg`Parameter limit tidak valid.`;
    case RestInputRequestParserExceptionCode.INVALID_FILTER_QUERY_PARAM:
      return msg`Parameter filter tidak valid.`;
    default:
      assertUnreachable(code);
  }
};

export class RestInputRequestParserException extends CustomException<RestInputRequestParserExceptionCode> {
  constructor(
    message: string,
    code: RestInputRequestParserExceptionCode,
    { userFriendlyMessage }: { userFriendlyMessage?: MessageDescriptor } = {},
  ) {
    super(message, code, {
      userFriendlyMessage:
        userFriendlyMessage ??
        getRestInputRequestParserExceptionUserFriendlyMessage(code),
    });
  }
}
