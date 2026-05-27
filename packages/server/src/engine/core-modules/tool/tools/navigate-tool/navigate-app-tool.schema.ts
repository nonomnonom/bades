import { z } from 'zod';

export const NavigateAppInputZodSchema = z.discriminatedUnion('type', [
  z.object({
    type: z
      .literal('navigateToView')
      .describe(
        'Navigate to a specific view by name. ONLY use this type when the user explicitly mentions the word "view" (e.g. "buka view Keluarga Saya", "open view Semua Penduduk"). Do NOT use this for general navigation requests.',
      ),
    viewName: z
      .string()
      .describe(
        'The name of the view to navigate to (e.g. "Keluarga Saya", "Semua Penduduk")',
      ),
  }),
  z.object({
    type: z
      .literal('navigateToObject')
      .describe(
        'Navigate to the default view for an object. This is the PREFERRED and DEFAULT type for all navigation requests unless the user explicitly mentions the word "view".',
      ),
    objectNameSingular: z
      .string()
      .describe(
        'The singular name of the object to navigate to (e.g. "keluarga", "penduduk", "programBantuan")',
      ),
  }),
  z.object({
    type: z
      .literal('navigateToRecord')
      .describe(
        'Navigate to a specific record page. Use this when the user wants to go to a particular record by name (e.g. "buka keluarga Anggrek", "open penduduk Budi Santoso", "tampilkan program Bantuan Lansia").',
      ),
    objectNameSingular: z
      .string()
      .describe(
        'The singular name of the object type (e.g. "keluarga", "penduduk", "programBantuan")',
      ),
    recordName: z
      .string()
      .describe(
        'The name or label of the record to navigate to (e.g. "Keluarga Anggrek", "Budi Santoso", "Bantuan Lansia")',
      ),
  }),
  z.object({
    type: z
      .literal('wait')
      .describe(
        'Wait for a specified duration in milliseconds before continuing. Useful when you need the page to fully load after a navigation before taking further actions (e.g. 2000 for 2 seconds).',
      ),
    durationMs: z
      .number()
      .int()
      .min(0)
      .max(30000)
      .describe(
        'The duration in milliseconds to wait (e.g. 2000 for 2 seconds). Maximum 30000 (30 seconds).',
      ),
  }),
]);

export type NavigateAppInput = z.infer<typeof NavigateAppInputZodSchema>;
