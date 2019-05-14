import { TestStep } from './TestStep';

export interface ExecutionStep extends TestStep {
  key: number;
  result: ExecutionStepResult;
  message?: string;
}

export enum ExecutionStepResult {
  Failed = 'FAILED',
  Pending = 'PENDING',
  Successful = 'SUCCESSFUL',
  Warning = 'WARNING',
  Aborted = 'ABORTED',
}
