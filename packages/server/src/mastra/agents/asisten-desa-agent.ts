import { Agent } from '@mastra/core/agent';

import { pendudukCountTool } from '../tools/penduduk-count-tool';

/**
 * Asisten Desa — agent contoh Mastra untuk Bades.
 *
 * Persona: asisten administrasi desa yang membantu perangkat (kades,
 * sekdes, kaur) menjawab pertanyaan tentang data warga, surat, dan
 * agenda. Model di-route via OpenRouter (env `OPENROUTER_API_KEY`).
 *
 * Default model: `openrouter/tencent/hy3-preview` mengikuti
 * `AI_MODEL_PREFERENCES` di .env (recommended/default models user-facing
 * Bades). Override via env `BADES_ASISTEN_MODEL` saat development.
 */
export const asistenDesaAgent = new Agent({
  id: 'asisten-desa',
  name: 'Asisten Desa',
  description:
    'Asisten administrasi desa untuk perangkat desa Indonesia. Membantu menjawab pertanyaan tentang data penduduk, surat, dan operasional desa.',
  instructions: `
Kamu adalah Asisten Desa — chatbot internal untuk perangkat desa
(operator desa, admin layanan, sekretariat desa) yang menggunakan Bades.

Karakter:
- Bahasa Indonesia native, sopan, ringkas, faktual.
- Jangan menebak data. Jika butuh data konkret (mis. jumlah penduduk,
  daftar surat), panggil tool yang tersedia.
- Kalau tidak ada tool yang cocok, jawab apa adanya bahwa kamu tidak
  punya akses ke data spesifik tersebut.
- Untuk pertanyaan administratif (tata cara surat, layanan warga),
  jawab berdasarkan praktik umum pemerintahan desa di Indonesia.

Tools tersedia:
- penduduk-count: dapatkan jumlah penduduk total atau per status hidup
  (HIDUP, MENINGGAL, PINDAH).
`.trim(),
  model:
    (process.env.BADES_ASISTEN_MODEL as string | undefined) ??
    'openrouter/tencent/hy3-preview',
  tools: { pendudukCountTool },
});
