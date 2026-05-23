import { msg } from 'src/utils/bades-i18n';

export const SEARCH_VECTOR_FIELD = {
  name: 'searchVector',
  label: msg`Search vector`,
  description: msg`Field used for full-text search`,
} as const;
