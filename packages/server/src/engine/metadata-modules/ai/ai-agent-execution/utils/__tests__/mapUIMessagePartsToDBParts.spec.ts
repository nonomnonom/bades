import { mapUIMessagePartsToDBParts } from 'src/engine/metadata-modules/ai/ai-agent-execution/utils/mapUIMessagePartsToDBParts';

describe('mapUIMessagePartsToDBParts', () => {
  const messageId = 'msg-1';
  const workspaceId = 'ws-1';

  it('memetakan part tool dinamis dari AI SDK', () => {
    const parts = mapUIMessagePartsToDBParts(
      [
        {
          type: 'tool-find_daftar_wilayah',
          toolCallId: 'call-1',
          state: 'output-available',
          input: { filter: { namaWilayah: { ilike: '%jagara%' } } },
          output: { records: [] },
        },
      ],
      messageId,
      workspaceId,
    );

    expect(parts).toHaveLength(1);
    expect(parts[0]).toMatchObject({
      messageId,
      workspaceId,
      type: 'tool-find_daftar_wilayah',
      toolCallId: 'call-1',
    });
  });

  it('menangani DynamicToolUIPart dengan type dynamic-tool', () => {
    const parts = mapUIMessagePartsToDBParts(
      [
        {
          type: 'dynamic-tool',
          toolName: 'cari_data',
          toolCallId: 'call-dynamic-1',
          state: 'output-available',
          input: { query: 'test' },
          output: { result: 'ok' },
        },
      ],
      messageId,
      workspaceId,
    );

    expect(parts).toHaveLength(1);
    expect(parts[0]).toMatchObject({
      messageId,
      workspaceId,
      type: 'dynamic-tool',
      toolCallId: 'call-dynamic-1',
      toolInput: { query: 'test' },
      toolOutput: { result: 'ok' },
    });
  });

  it('mengabaikan part transient tanpa menghasilkan baris kosong', () => {
    const parts = mapUIMessagePartsToDBParts(
      [
        { type: 'step-start' },
        {
          type: 'data-code-execution',
          data: {
            executionId: 'exec-1',
            state: 'completed',
            code: 'x',
            language: 'python',
            stdout: '',
            stderr: '',
            files: [],
          },
        },
        { type: 'text', text: 'halo' },
      ],
      messageId,
      workspaceId,
    );

    expect(parts).toHaveLength(2);
    expect(parts.every((part) => isDefined(part.messageId))).toBe(true);
  });
});

const isDefined = <T>(value: T | null | undefined): value is T =>
  value !== null && value !== undefined;
