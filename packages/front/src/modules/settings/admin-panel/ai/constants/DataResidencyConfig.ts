import { type DataResidency } from 'shared/ai';

export const DATA_RESIDENCY_CONFIG: Record<
  DataResidency,
  { label: string; flag: string }
> = {
  us: { label: 'Amerika Serikat', flag: '🇺🇸' },
  eu: { label: 'Uni Eropa', flag: '🇪🇺' },
  global: { label: 'Global', flag: '🌐' },
  uk: { label: 'Britania Raya', flag: '🇬🇧' },
  ap: { label: 'Asia Pasifik', flag: '🌏' },
  jp: { label: 'Jepang', flag: '🇯🇵' },
  au: { label: 'Australia', flag: '🇦🇺' },
  ca: { label: 'Canada', flag: '🇨🇦' },
  de: { label: 'Germany', flag: '🇩🇪' },
  fr: { label: 'France', flag: '🇫🇷' },
};
