import { RESERVED_SUBDOMAINS, SUBDOMAIN_PATTERN } from 'shared/constants';
import { z } from 'zod';

export const getSubdomainValidationSchema = () =>
  z
    .string()
    .min(3, { message: `Subdomain tidak boleh kurang dari 3 karakter` })
    .max(30, { message: `Subdomain tidak boleh lebih dari 30 karakter` })
    .regex(SUBDOMAIN_PATTERN, {
      message: `Gunakan huruf, angka, dan tanda hubung saja. Awali dan akhiri dengan huruf atau angka`,
    })
    .refine((value) => !RESERVED_SUBDOMAINS.includes(value.toLowerCase()), {
      message: `Subdomain ini sudah dipesan`,
    });
