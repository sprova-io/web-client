export interface ExecutionContext {
  _id: string;
  userId: string;
  projectId: string;
  type: ExecutionType;
  reference?: string;
  method: ExecutionMethod;
  status: ExecutionContextStatus;
  createdAt: Date;
  startedAt?: Date;
  finishedAt?: Date;
}

export enum ExecutionContextStatus {
  Active = 'ACTIVE',
  Finished = 'FINISHED',
  Scheduled = 'SCHEDULED',
}

export enum ExecutionMethod {
  Automated = 'AUTOMATED',
  Manual = 'MANUAL',
}

export enum ExecutionType {
  Cycle = 'CYCLE',
  TestSet = 'TESTSET',
  TestCases = 'TESTCASES',
}
