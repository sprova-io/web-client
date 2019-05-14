import { Execution, ExecutionStatus } from '@/models/Execution';
import { ExecutionStep } from '@/models/ExecutionStep';
import { AxiosResponse } from 'axios';
import agent from './agents/api.agent';
import axiosErrorHandler from './utils/axiosErrorHandler';

export function getExecutions(projectId: string): Promise<Execution[]> {
  return agent
    .get('/executions', {
      params: {
        projectId,
      },
    })
    .catch(axiosErrorHandler)
    .then(
      (response: AxiosResponse): Execution[] => {
        const { data, status, statusText } = response;
        if (status !== 200) {
          throw statusText;
        }
        return data as Execution[];
      }
    );
}

export function getExecution(id: string): Promise<Execution> {
  return agent
    .get(`/executions/${id}`)
    .catch(axiosErrorHandler)
    .then(
      (response: AxiosResponse): Execution => {
        const { data, status, statusText } = response;
        if (status !== 200) {
          throw statusText;
        }
        return data as Execution;
      }
    );
}

export function getExecutionsOfContext(
  contextId: string,
  withTitle = false
): Promise<Execution[]> {
  return agent
    .get('/executions', {
      params: {
        contextId,
        withTitle,
      },
    })
    .catch(axiosErrorHandler)
    .then(
      (response: AxiosResponse): Execution[] => {
        const { data, status, statusText } = response;
        if (status !== 200) {
          throw statusText;
        }
        return data as Execution[];
      }
    );
}

export function getExecutionsOfTestCase(
  testCaseId: string
): Promise<Execution[]> {
  return agent
    .get('/executions', {
      params: {
        testCaseId,
      },
    })
    .catch(axiosErrorHandler)
    .then(
      (response: AxiosResponse): Execution[] => {
        const { data, status, statusText } = response;
        if (status !== 200) {
          throw statusText;
        }
        return data as Execution[];
      }
    );
}

export function getExecutionSteps(
  executionId: string
): Promise<ExecutionStep[]> {
  return agent
    .get(`/executions/${executionId}/steps`)
    .catch(axiosErrorHandler)
    .then(
      (response: AxiosResponse): ExecutionStep[] => {
        const { data, status, statusText } = response;
        if (status !== 200) {
          throw statusText;
        }
        return data as ExecutionStep[];
      }
    );
}

export function postExecution(execution: Partial<Execution>) {
  return agent
    .post('/executions', execution)
    .catch(axiosErrorHandler)
    .then(
      (response: AxiosResponse): Execution => {
        const { data, status, statusText } = response;
        if (status !== 201) {
          throw statusText;
        }
        return data as Execution;
      }
    );
}

export function updateExecutionStatus(
  executionId: string,
  executionStatus: ExecutionStatus
): Promise<boolean> {
  return agent
    .put(`/executions/${executionId}/status`, { status: executionStatus })
    .catch(axiosErrorHandler)
    .then(
      (response: AxiosResponse): boolean => {
        const { data, status, statusText } = response;
        if (status !== 200) {
          throw statusText;
        }
        return !!data.ok;
      }
    );
}

export function updateExecutionStep(
  executionId: string,
  executionStep: ExecutionStep
): Promise<boolean> {
  return agent
    .put(`/executions/${executionId}/steps`, executionStep)
    .catch(axiosErrorHandler)
    .then(
      (response: AxiosResponse): boolean => {
        const { data, status, statusText } = response;
        if (status !== 200) {
          throw statusText;
        }
        return !!data.ok;
      }
    );
}

export function updateExecutionSteps(
  executionId: string,
  executionSteps: ExecutionStep[]
): Promise<boolean> {
  return agent
    .put(`/executions/${executionId}/steps`, executionSteps)
    .catch(axiosErrorHandler)
    .then(
      (response: AxiosResponse): boolean => {
        const { data, status, statusText } = response;
        if (status !== 200) {
          throw statusText;
        }
        return !!data.ok;
      }
    );
}

export function postExecutions(executions: Array<Partial<Execution>>) {
  return agent
    .post('/executions', executions)
    .catch(axiosErrorHandler)
    .then(
      (response: AxiosResponse): Execution[] => {
        const { data, status, statusText } = response;
        if (status !== 201) {
          throw statusText;
        }
        return data as Execution[];
      }
    );
}

export function deleteExecution(id: string) {
  return agent
    .delete(`/executions/${id}`)
    .catch(axiosErrorHandler)
    .then(
      (response: AxiosResponse): boolean => {
        const { data, status, statusText } = response;
        if (status !== 200) {
          throw statusText;
        }
        return !!data.ok;
      }
    );
}
