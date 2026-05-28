import { Mastra } from '@mastra/core/mastra';

import { asistenDesaAgent } from './agents/asisten-desa-agent';

/**
 * Mastra instance utama Bades.
 *
 * Diregistrasi di [app.module.ts](../app.module.ts) via
 * `MastraModule.register({ mastra })` dari `@mastra/nestjs`. Endpoint
 * agent default mount di `/api/agents/<agentId>/generate` dan
 * `/api/agents/<agentId>/stream`.
 *
 * Catatan migrasi:
 * - Agent legacy Bades di [packages/server/src/engine/metadata-modules/ai/](../engine/metadata-modules/ai/)
 *   masih jalan paralel. Migrasi bertahap per fitur supaya billing,
 *   workspace isolation, dan persist chat thread tetap konsisten
 *   selama transisi.
 * - Model di-route via OpenRouter (env `OPENROUTER_API_KEY`). Format
 *   model Mastra: `openrouter/<provider>/<model>` (lihat
 *   `https://mastra.ai/models/providers/openrouter`).
 */
export const mastra = new Mastra({
  agents: { asistenDesaAgent },
});
