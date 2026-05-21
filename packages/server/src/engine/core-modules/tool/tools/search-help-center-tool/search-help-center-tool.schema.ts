import { z } from 'zod';

export const SearchHelpCenterInputZodSchema = z.object({
  query: z
    .string()
    .describe('Kueri pencarian untuk menemukan artikel bantuan yang relevan tentang Bades'),
});

export type SearchHelpCenterInput = z.infer<
  typeof SearchHelpCenterInputZodSchema
>;
