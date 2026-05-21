import { RESERVED_SUBDOMAINS } from 'shared/constants';
import { isValidTwentySubdomain } from 'shared/utils';

export const isSubdomainValid = (subdomain: string) => {
  return (
    isValidTwentySubdomain(subdomain) &&
    !RESERVED_SUBDOMAINS.includes(subdomain.toLowerCase())
  );
};
