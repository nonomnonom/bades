import { type RecordReference } from 'src/engine/core-modules/tool/types/record-reference.type';

export type ToolPendingConfirmation = {
  toolName: string;
  arguments: Record<string, unknown>;
  operation: string;
  objectNameSingular: string;
};

export type ToolOutput<T = object> = {
  success: boolean;
  message: string;
  error?: string;
  result?: T;
  status?: number;
  statusText?: string;
  headers?: Record<string, string>;
  recordReferences?: RecordReference[];
  pendingConfirmation?: ToolPendingConfirmation;
};
