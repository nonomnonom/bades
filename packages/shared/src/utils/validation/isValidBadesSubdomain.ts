import { SUBDOMAIN_PATTERN } from '@/constants/SubdomainPattern';

export const isValidBadesSubdomain = (subdomain: string): boolean => {
  return SUBDOMAIN_PATTERN.test(subdomain);
};
