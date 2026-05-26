import { absoluteUrlSchema } from '@/utils/url/absoluteUrlSchema';

export const getUrlHostnameOrThrow = (url: string): string => {
  const result = absoluteUrlSchema.safeParse(url);

  if (!result.success) {
    throw new Error('URL tidak valid');
  }

  try {
    const url = new URL(result.data);
    return url.hostname;
  } catch {
    throw new Error('URL tidak valid');
  }
};
