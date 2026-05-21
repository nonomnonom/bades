'use client';

import { createContext } from 'react';
import { type AppLocale } from 'shared/translations';

export const LocaleContext = createContext<AppLocale | null>(null);
