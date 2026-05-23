import { z } from 'zod';
import { EmailingDomainDriver } from '~/generated-metadata/graphql';

export const settingsEmailingDomainFormSchema = z.object({
  domain: z
    .string()
    .min(1, 'Domain wajib diisi')
    .regex(
      /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9-]*[A-Za-z0-9])\.[a-zA-Z]{2,}$/,
      'Format domain tidak valid. Masukkan nama domain yang benar.',
    )
    .max(256, 'Domain tidak boleh lebih dari 256 karakter.'),
  driver: z.nativeEnum(EmailingDomainDriver),
});

export type SettingsEmailingDomainFormValues = z.infer<
  typeof settingsEmailingDomainFormSchema
>;
