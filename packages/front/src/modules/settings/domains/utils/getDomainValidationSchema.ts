import { t } from '~/utils/i18n/badesI18n';
import { z } from 'zod';

export const getDomainValidationSchema = () =>
  z
    .string()
    .regex(
      /^([a-zA-Z0-9][a-zA-Z0-9-]*\.)+[a-zA-Z0-9][a-zA-Z0-9-]*\.[a-zA-Z]{2,}$/,
      {
        message: t`Domain tidak valid. Sertakan setidaknya satu subdomain (contoh: sub.example.com).`,
      },
    )
    .regex(
      /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9-]*[A-Za-z0-9])$/,
      {
        message: t`Domain tidak valid. Domain harus kurang dari 256 karakter, tidak boleh berupa alamat IP, tidak boleh mengandung spasi, tidak boleh mengandung karakter khusus seperti _~\`!@#$%^*()=+{}[]|\\;:'",<>/? dan tidak boleh diawali atau diakhiri dengan karakter '-'.`,
      },
    )
    .max(256)
    .optional()
    .or(z.literal(''));
