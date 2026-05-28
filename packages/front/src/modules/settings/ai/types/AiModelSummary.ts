// modelFamily diterima sebagai string (bukan enum import) supaya kompatibel
// dengan dua generated namespace (admin & metadata) yang masing-masing punya
// enum ModelFamily strukturalnya identik tapi nominal types beda di TS.
export type AiModelSummary = {
  modelId: string;
  label: string;
  modelFamily?: string | null;
  providerName?: string | null;
  isDeprecated?: boolean | null;
  dataResidency?: string | null;
  providerLabel?: string | null;
  contextWindowTokens?: number | null;
  maxOutputTokens?: number | null;
  inputCostPerMillionTokens?: number | null;
  outputCostPerMillionTokens?: number | null;
  // Optional admin-panel fields — kompat dengan AdminAiModelConfig fragment
  isRecommended?: boolean | null;
  isAdminEnabled?: boolean | null;
  isAvailable?: boolean | null;
};
