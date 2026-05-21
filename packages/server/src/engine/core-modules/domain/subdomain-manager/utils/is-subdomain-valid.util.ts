import { RESERVED_SUBDOMAINS } from 'shared/constants';
import { isValidBadesSubdomain } from 'shared/utils';

export const isSubdomainValid = (subdomain: string) => {
  return (
    isValidBadesSubdomain(subdomain) &&
    !RESERVED_SUBDOMAINS.includes(subdomain.toLowerCase())
  );
};
