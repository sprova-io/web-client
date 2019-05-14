import { ExecutionStep } from './ExecutionStep';

export interface Execution {
  _id: string;
  contextId: string;
  testCaseId: string;
  testCaseTitle?: string;
  status: ExecutionStatus;
  steps: ExecutionStep[];
  createdAt: Date;
  finishedAt?: Date;
}

export enum ExecutionStatus {
  Failed = 'FAILED',
  Pending = 'PENDING',
  Successful = 'SUCCESSFUL',
  Warning = 'WARNING',
}
