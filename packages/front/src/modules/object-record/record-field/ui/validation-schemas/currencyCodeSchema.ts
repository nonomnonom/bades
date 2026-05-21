import { z } from 'zod';

import { CurrencyCode } from 'shared/constants';

export const currencyCodeSchema = z.enum(CurrencyCode);
