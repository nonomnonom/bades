import { Memory } from '@mastra/memory';
import { PostgresStore } from '@mastra/pg';

/**
 * Mastra memory factory untuk Bades.
 *
 * Resource scope = `userWorkspaceId` (per kombinasi user+workspace).
 * Thread scope = chat session individual.
 *
 * Working memory aktif dengan template Indonesia-native untuk profile user
 * (nama, role di desa, preferensi). Pruning via `lastMessages: 20` supaya
 * context window tidak meledak — pruning lebih agresif via token estimate
 * di runtime kalau perlu.
 */
export const buildMemory = (storage: PostgresStore): Memory => {
  return new Memory({
    storage,
    options: {
      lastMessages: 20,
      workingMemory: {
        enabled: true,
        scope: 'resource',
        template: `# Profil Pengguna

- Nama:
- Peran di Desa: [Kades / Sekdes / Kaur / Kasi / Operator]
- Workspace ID:
- Preferensi gaya komunikasi: [Formal / Santai]
- Catatan penting:
`,
      },
    },
  });
};
