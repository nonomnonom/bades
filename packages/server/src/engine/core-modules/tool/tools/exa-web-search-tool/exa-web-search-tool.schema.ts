import { z } from 'zod';

export const ExaWebSearchInputZodSchema = z.object({
  query: z.string().min(1).describe('Kueri pencarian web dalam bahasa natural'),
  numResults: z
    .number()
    .int()
    .min(1)
    .max(10)
    .optional()
    .describe('Jumlah hasil (default 5, maks 10)'),
});

export type ExaWebSearchInput = z.infer<typeof ExaWebSearchInputZodSchema>;
