import { ACCOUNT_TYPES } from 'shared/constants';
import { z } from 'zod';
import { type ConnectionParametersInput } from '~/generated-metadata/graphql';

import {
  isProtocolConfigured,
  isProtocolConfiguredForUpdate,
} from '@/settings/accounts/utils/isProtocolConfigured';

const connectionParameters = z
  .object({
    host: z.string().default(''),
    port: z.int().nullable().default(null),
    username: z.string().optional(),
    password: z.string().default(''),
    secure: z.boolean().default(true),
  })
  .refine(
    (data) => {
      if (Boolean(data.host?.trim())) {
        return data.port && data.port > 0;
      }
      return true;
    },
    {
      path: ['port'],
      error: 'Port harus berupa angka positif saat mengonfigurasi protokol ini',
    },
  );

export const connectionImapSmtpCalDav = z
  .object({
    handle: z.email('Alamat email tidak valid'),
    IMAP: connectionParameters.optional(),
    SMTP: connectionParameters.optional(),
    CALDAV: connectionParameters.optional(),
  })
  .refine(
    (data) => {
      return ACCOUNT_TYPES.some((protocol) =>
        isProtocolConfigured(data[protocol] as ConnectionParametersInput),
      );
    },
    {
      path: ['handle'],
      error:
        'Setidaknya satu tipe akun (IMAP, SMTP, atau CalDAV) harus dikonfigurasi secara lengkap',
    },
  );

export const connectionImapSmtpCalDavUpdate = z
  .object({
    handle: z.email('Alamat email tidak valid'),
    IMAP: connectionParameters.optional(),
    SMTP: connectionParameters.optional(),
    CALDAV: connectionParameters.optional(),
  })
  .refine(
    (data) => {
      return ACCOUNT_TYPES.some((protocol) =>
        isProtocolConfiguredForUpdate(
          data[protocol] as ConnectionParametersInput,
        ),
      );
    },
    {
      path: ['handle'],
      error:
        'Setidaknya satu tipe akun (IMAP, SMTP, atau CalDAV) harus dikonfigurasi secara lengkap',
    },
  );
