import { absoluteUrlSchema } from '@/utils/url/absoluteUrlSchema';

export const getAbsoluteUrlOrThrow = (url: string): string => {
  try {
    return absoluteUrlSchema.parse(url);
  } catch {
    throw new Error('URL tidak valid');
  }
};
