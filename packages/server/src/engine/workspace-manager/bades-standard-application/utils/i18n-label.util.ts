import { type MessageDescriptor } from 'src/utils/bades-i18n';

export const i18nLabel = (descriptor: MessageDescriptor): string =>
  descriptor.message ?? '';
