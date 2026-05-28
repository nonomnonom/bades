import { Mastra } from '@mastra/core/mastra';

import { buildAgentRegistry } from './agents';
import { buildMemory } from './memory';
import { buildStorage } from './storage';

/**
 * Mastra instance utama Bades.
 *
 * Tahap migrasi (lihat `docs/mastra-migration.md`):
 * - Storage: `@mastra/pg` di schema `mastra`, share DB dengan `core`.
 * - Memory: working memory aktif per-resource (userWorkspaceId).
 * - Agents: dibangun dinamis dari `AgentEntity` per workspace. Lihat
 *   `agents/index.ts` untuk factory.
 * - Tools: di-port satu per satu dari `tool-provider/` Bades.
 * - Routes: di-mount via `@mastra/nestjs` (`/mastra/agents/<id>/...`).
 *
 * Workspace isolation di runtime via Mastra `RequestContext` yang di-set
 * NestJS middleware (`mastra-request-context.middleware.ts`).
 */
const storage = buildStorage();
const memory = buildMemory(storage);

/**
 * Catatan endpoint:
 * - Adapter `@mastra/nestjs` route via catch-all controller yang match ke
 *   SERVER_ROUTES bawaan Mastra (`agents/<id>/generate`,
 *   `agents/<id>/stream`, dst.). Custom `apiRoutes` (mis. `chatRoute()`
 *   dari `@mastra/ai-sdk`) **tidak otomatis ter-mount** lewat adapter ini.
 * - Untuk SSE kompat AI SDK UI di front (`useChat`), nanti expose lewat
 *   NestJS controller manual yang panggil `handleChatStream()`. Sementara,
 *   front pakai endpoint native Mastra `/mastra/agents/<id>/stream`.
 */
export const mastra = new Mastra({
  storage,
  agents: buildAgentRegistry({ memory }),
});
