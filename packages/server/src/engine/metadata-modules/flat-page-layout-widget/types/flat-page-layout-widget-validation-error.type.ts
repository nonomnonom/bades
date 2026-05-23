import { type MessageDescriptor } from 'src/utils/bades-i18n';

import { type PageLayoutWidgetExceptionCode } from 'src/engine/metadata-modules/page-layout-widget/exceptions/page-layout-widget.exception';

export type FlatPageLayoutWidgetValidationError = {
  code: PageLayoutWidgetExceptionCode;
  message: string;
  userFriendlyMessage?: MessageDescriptor;
  value?: unknown;
};
