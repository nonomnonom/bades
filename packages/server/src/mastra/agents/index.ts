import { Agent } from '@mastra/core/agent';
import { type Memory } from '@mastra/memory';

import { workspaceSummaryTool } from '../tools/workspace-summary-tool';

type BuildAgentRegistryOptions = {
  memory: Memory;
};

/**
 * Registry agent Bades — single dispatch agent untuk chat panel.
 *
 * Saat ini hanya satu agent generic "Asisten Desa" yang dipakai semua
 * workspace. Fase berikutnya: load dari `AgentEntity` per workspace
 * (registerAsync pattern dengan DI repository) dan gunakan dynamic
 * `instructions` + `model` callbacks dari Mastra supaya per request bisa
 * di-rewrite berdasarkan `runtimeContext.get('agentId')`.
 *
 * Untuk sekarang agent dibangun statis dengan tool dasar yang
 * mendemonstrasikan workspace isolation via `runtimeContext`.
 */
export const buildAgentRegistry = ({
  memory,
}: BuildAgentRegistryOptions): Record<string, Agent> => {
  const asistenDesa = new Agent({
    id: 'asisten-desa',
    name: 'Asisten Desa',
    description:
      'Asisten administrasi desa untuk perangkat desa Indonesia. Membantu menjawab pertanyaan tentang data penduduk, surat, agenda, dan operasional desa.',
    instructions: `
Kamu adalah Asisten Desa — chatbot internal Bades untuk perangkat desa
(operator, admin layanan, sekretariat, kades, sekdes, kaur, kasi).

Karakter:
- Bahasa Indonesia native, sopan, ringkas, faktual.
- Jangan menebak data. Saat user menanyakan statistik atau gambaran
  workspace, **wajib panggil** tool \`workspace-summary\` untuk dapat
  angka real-time. Jangan menjawab dari memori sendiri.
- Untuk pertanyaan administratif (tata cara surat, layanan warga),
  jawab berdasarkan praktik umum pemerintahan desa di Indonesia.
- Jika user belum sebut nama atau peran, ingat informasi tersebut di
  working memory supaya percakapan berikutnya tetap personal.

Tools tersedia:
- workspace-summary: ringkasan data workspace (jumlah penduduk,
  keluarga, lembaga). Set \`includeBreakdown: true\` saat user minta
  rincian per status hidup penduduk.
`.trim(),
    model:
      (process.env.BADES_ASISTEN_MODEL as string | undefined) ??
      'openrouter/tencent/hy3-preview',
    memory,
    tools: { workspaceSummaryTool },
  });

  return {
    asistenDesa,
  };
};
