import { isDefined } from 'shared/utils';

export const sanitizeMessageToRenderInSnackbar = (
  messageToRenderInSnackbar: any,
) => {
  if (!isDefined(messageToRenderInSnackbar)) {
    return null;
  } else if (
    typeof messageToRenderInSnackbar === 'string' ||
    typeof messageToRenderInSnackbar === 'string' ||
    typeof messageToRenderInSnackbar === 'boolean'
  ) {
    return `${messageToRenderInSnackbar}`;
  } else if (typeof messageToRenderInSnackbar === 'object') {
    try {
      return JSON.stringify(messageToRenderInSnackbar);
    } catch {
      return 'Cannot display message';
    }
  } else {
    return 'Cannot display message';
  }
};
