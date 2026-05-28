import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

/**
 * Tool: ringkasan workspace desa saat ini.
 *
 * Demonstrasi pattern Mastra tool yang membaca konteks workspace dari
 * `requestContext` (di-set oleh `mastra-request-context.middleware.ts`)
 * dan akan diteruskan ke service Bades nyata untuk query DB.
 *
 * TODO: ganti mock dengan query asli ke workspace data source (via
 * `GlobalWorkspaceDataSourceService` + repository `Penduduk`, `Keluarga`,
 * dst.) saat porting database tool full.
 */
export const workspaceSummaryTool = createTool({
  id: 'workspace-summary',
  description:
    'Dapatkan ringkasan workspace desa: jumlah penduduk, keluarga, dan lembaga aktif. Tool ini selalu dipanggil saat user menanyakan statistik atau gambaran umum desa.',
  inputSchema: z.object({
    includeBreakdown: z
      .boolean()
      .default(false)
      .describe(
        'Sertakan rincian per status hidup penduduk (HIDUP, MENINGGAL, PINDAH).',
      ),
  }),
  outputSchema: z.object({
    workspaceId: z.string(),
    pendudukTotal: z.number(),
    keluargaTotal: z.number(),
    lembagaTotal: z.number(),
    breakdown: z
      .object({
        pendudukHidup: z.number(),
        pendudukMeninggal: z.number(),
        pendudukPindah: z.number(),
      })
      .optional(),
  }),
  execute: async ({ context, runtimeContext }) => {
    const workspaceId =
      (runtimeContext?.get('workspaceId') as string | undefined) ??
      'workspace-unknown';

    // Mock data per workspace (deterministik agar reproducible test).
    const seed = workspaceId
      .split('')
      .reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const pendudukTotal = 1500 + (seed % 1000);
    const keluargaTotal = Math.floor(pendudukTotal / 4);
    const lembagaTotal = 15 + (seed % 30);

    const result = {
      workspaceId,
      pendudukTotal,
      keluargaTotal,
      lembagaTotal,
    };

    if (context.includeBreakdown !== true) {
      return result;
    }

    return {
      ...result,
      breakdown: {
        pendudukHidup: Math.floor(pendudukTotal * 0.92),
        pendudukMeninggal: Math.floor(pendudukTotal * 0.05),
        pendudukPindah: Math.floor(pendudukTotal * 0.03),
      },
    };
  },
});
