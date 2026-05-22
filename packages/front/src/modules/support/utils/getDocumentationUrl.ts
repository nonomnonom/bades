import {
  DOCUMENTATION_BASE_URL,
  DOCUMENTATION_DEFAULT_PATH,
  type DocumentationPath,
} from 'shared/constants';

/**
 * Bades single-language (Bahasa Indonesia). Returns direct documentation URL.
 */
export const getDocumentationUrl = ({
  path = DOCUMENTATION_DEFAULT_PATH,
}: {
  path?: DocumentationPath | string;
}): string => {
  return `${DOCUMENTATION_BASE_URL}${path}`;
};
