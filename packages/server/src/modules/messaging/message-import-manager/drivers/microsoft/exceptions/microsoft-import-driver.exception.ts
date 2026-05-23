import { msg, type MessageDescriptor } from 'src/utils/bades-i18n';
import { CustomException } from 'src/utils/custom-exception';

export class MicrosoftImportDriverException extends CustomException<string> {
  statusCode: number;
  constructor(
    message: string,
    code: string,
    statusCode: number,
    { userFriendlyMessage }: { userFriendlyMessage?: MessageDescriptor } = {},
  ) {
    super(message, code, {
      userFriendlyMessage:
        userFriendlyMessage ?? msg`An error occurred during messages import`,
    });
    this.statusCode = statusCode;
  }
}
