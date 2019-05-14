import { TestStep } from './TestStep';

export interface TestCase {
  _id: string;
  title: string;
  description: string;
  projectId: string;
  cycleId: string;
  steps: TestStep[];
  createdAt: Date;
  parentId?: string;
}
