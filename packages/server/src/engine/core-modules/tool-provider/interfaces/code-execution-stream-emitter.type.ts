import { type CodeExecutionData } from 'shared/ai';

export type CodeExecutionStreamEmitter = (data: CodeExecutionData) => void;
