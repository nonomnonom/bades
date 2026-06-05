import { msg } from '~/utils/i18n/badesI18n';
import {
  IconLayoutDashboard,
  IconPlus,
  IconSettingsAutomation,
} from 'ui/display';

import {
  DEFAULT_SUGGESTED_PROMPTS,
  type SuggestedPrompt,
} from '@/ai/components/suggested-prompts/default-suggested-prompts';
import { type EnrichedObjectMetadataItem } from '@/object-metadata/types/EnrichedObjectMetadataItem';

type GenerateSuggestedPromptsArgs = {
  objectMetadataItems: EnrichedObjectMetadataItem[];
};

export const generateSuggestedPrompts = ({
  objectMetadataItems,
}: GenerateSuggestedPromptsArgs): SuggestedPrompt[] => {
  const customObjects = objectMetadataItems
    .filter((item) => item.isActive && !item.isSystem)
    .slice(0, 3);

  if (customObjects.length === 0) {
    return DEFAULT_SUGGESTED_PROMPTS;
  }

  const objectPrompts: SuggestedPrompt[] = customObjects.map((object) => ({
    id: `summary-${object.nameSingular}`,
    label: `Buat ringkasan ${object.labelPlural}`,
    Icon: IconPlus,
    prefillPrompts: [
      `Buat ringkasan ${object.labelPlural} terbaru: total, tren, dan poin penting.`,
      `Ringkas data ${object.labelPlural} yang paling relevan untuk operasional hari ini.`,
      `Buat laporan singkat ${object.labelPlural} dengan highlight perubahan signifikan.`,
    ],
  }));

  return [
    ...objectPrompts,
    {
      id: 'dashboard',
      label: msg`Buat dasbor`,
      Icon: IconLayoutDashboard,
      prefillPrompts: [
        msg`Buat dasbor operasional harian dari objek data utama workspace ini.`,
      ],
    },
    {
      id: 'workflow',
      label: msg`Buat alur kerja`,
      Icon: IconSettingsAutomation,
      prefillPrompts: [
        msg`Buat alur kerja otomatis untuk mempercepat proses administrasi desa.`,
      ],
    },
  ].slice(0, 3);
};
