import { type AiModelPreferences } from 'src/engine/metadata-modules/ai/ai-models/types/ai-model-preferences.type';

// Bades memakai satu model operasional tunggal via OpenRouter (lihat GOAL.md
// "Goal AI Satu Model"). Tidak ada katalog multi-provider yang diekspos ke
// pengguna; routing/fallback di belakang layar adalah detail internal.
const BADES_OPERATIONAL_MODEL = 'tencent/hy3-preview';

export const DEFAULT_MODEL_PREFERENCES: AiModelPreferences = {
  disabledModels: [],
  recommendedModels: [BADES_OPERATIONAL_MODEL],
  defaultFastModels: [BADES_OPERATIONAL_MODEL],
  defaultSmartModels: [BADES_OPERATIONAL_MODEL],
};
