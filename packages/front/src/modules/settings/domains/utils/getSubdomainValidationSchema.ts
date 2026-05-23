import { t } from '~/utils/i18n/badesI18n';
import { RESERVED_SUBDOMAINS, SUBDOMAIN_PATTERN } from 'shared/constants';
import { z } from 'zod';

export const getSubdomainValidationSchema = () =>
  z
    .string()
    .min(3, { message: t`Subdomain tidak boleh kurang dari 3 karakter` })
    .max(30, { message: t`Subdomain tidak boleh lebih dari 30 karakter` })
    .regex(SUBDOMAIN_PATTERN, {
      message: t`Gunakan huruf, angka, dan tanda hubung saja. Awali dan akhiri dengan huruf atau angka`,
    })
    .refine((value) => !RESERVED_SUBDOMAINS.includes(value.toLowerCase()), {
      message: t`Subdomain ini sudah dipesan`,
    });
