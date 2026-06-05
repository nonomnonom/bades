import { type ToolUIPart } from 'ai';
import { isExtendedFileUIPart, type ExtendedUIMessagePart } from 'shared/ai';
import { isDefined } from 'shared/utils';

import { type AgentMessagePartEntity } from 'src/engine/metadata-modules/ai/ai-agent-execution/entities/agent-message-part.entity';

const isToolPart = (part: ExtendedUIMessagePart): part is ToolUIPart => {
  return (
    (part.type === 'dynamic-tool' || part.type.startsWith('tool-')) &&
    'toolCallId' in part
  );
};

const mapToolPartToDBPart = (
  part: ToolUIPart,
  basePart: Partial<AgentMessagePartEntity>,
): Partial<AgentMessagePartEntity> => {
  const { toolCallId, input, output, errorText, state } = part;

  return {
    ...basePart,
    toolCallId,
    toolInput: input,
    toolOutput: output,
    errorMessage: errorText,
    state,
    providerExecuted: part.providerExecuted ?? null,
  };
};

export const mapUIMessagePartsToDBParts = (
  uiMessageParts: ExtendedUIMessagePart[],
  messageId: string,
  workspaceId: string,
): Partial<AgentMessagePartEntity>[] => {
  return uiMessageParts
    .map((part, index) => {
      const basePart: Partial<AgentMessagePartEntity> = {
        messageId,
        orderIndex: index,
        type: part.type,
        workspaceId,
      };

      switch (part.type) {
        case 'text':
          return {
            ...basePart,
            textContent: part.text,
          };
        case 'reasoning':
          return {
            ...basePart,
            reasoningContent: part.text,
          };
        case 'file': {
          if (!isExtendedFileUIPart(part)) {
            throw new Error('Expected file part');
          }

          return {
            ...basePart,
            fileFilename: part.filename,
            fileId: part.fileId,
          };
        }
        case 'source-url':
          return {
            ...basePart,
            sourceUrlSourceId: part.sourceId,
            sourceUrlUrl: part.url,
            sourceUrlTitle: part.title,
            providerMetadata: part.providerMetadata ?? null,
          };
        case 'source-document':
          return {
            ...basePart,
            sourceDocumentSourceId: part.sourceId,
            sourceDocumentMediaType: part.mediaType,
            sourceDocumentTitle: part.title,
            sourceDocumentFilename: part.filename,
            providerMetadata: part.providerMetadata ?? null,
          };
        case 'step-start':
          return basePart;
        case 'data-compaction':
          return null;
        case 'data-routing-status':
          return {
            ...basePart,
            textContent: part.data.text,
            state: part.data.state,
          };
        case 'data-code-execution':
          // Code execution parts are streamed during execution but don't need
          // to be persisted - the final result is captured in the tool part
          return null;
        case 'data-thread-title':
          // Thread title is a transient notification for the client
          return null;
        case 'tool-call':
        case 'tool-result':
        case 'dynamic-tool':
          if (isToolPart(part)) {
            return mapToolPartToDBPart(part, basePart);
          }
          throw new Error(`Unsupported part type: ${part.type}`);
        default:
          if (isToolPart(part as ExtendedUIMessagePart)) {
            // AI SDK memakai tipe dinamis seperti tool-find_daftar_wilayah.
            return mapToolPartToDBPart(part as ToolUIPart, basePart);
          }
          throw new Error(
            `Unsupported part type: ${(part as ExtendedUIMessagePart).type}`,
          );
      }
    })
    .filter((part): part is Partial<AgentMessagePartEntity> => isDefined(part));
};
