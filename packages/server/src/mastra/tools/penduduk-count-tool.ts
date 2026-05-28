import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

/**
 * Tool contoh: hitung jumlah penduduk per status atau total.
 * Demo Mastra integration — eksekusi sebenarnya akan baca dari workspace
 * data source via service Bades; sementara ini return mock supaya bisa
 * di-test ujung ke ujung tanpa workspace context.
 */
export const pendudukCountTool = createTool({
  id: 'penduduk-count',
  description:
    'Hitung jumlah penduduk di desa. Bisa di-filter berdasarkan status hidup (HIDUP, MENINGGAL, PINDAH).',
  inputSchema: z.object({
    statusHidup: z
      .enum(['HIDUP', 'MENINGGAL', 'PINDAH', 'SEMUA'])
      .default('SEMUA')
      .describe('Filter status hidup penduduk'),
  }),
  outputSchema: z.object({
    total: z.number(),
    statusHidup: z.string(),
  }),
  execute: async ({ context }) => {
    const statusHidup = context.statusHidup ?? 'SEMUA';
    // TODO: ganti ke query workspace-scoped via TypeORM/Apollo internal.
    const mockTotals: Record<string, number> = {
      HIDUP: 1842,
      MENINGGAL: 124,
      PINDAH: 67,
      SEMUA: 2033,
    };

    return {
      total: mockTotals[statusHidup] ?? 0,
      statusHidup,
    };
  },
});
