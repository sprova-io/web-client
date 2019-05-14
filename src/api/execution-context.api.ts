import {
  ExecutionContext,
  ExecutionContextStatus,
} from '@/models/ExecutionContext';
import { AxiosResponse } from 'axios';
import agent from './agents/api.agent';
import axiosErrorHandler from './utils/axiosErrorHandler';

export function getExecutionContexts(
  projectId: string
): Promise<ExecutionContext[]> {
  return agent
    .get('/execution-contexts', {
      params: {
        projectId,
      },
    })
    .catch(axiosErrorHandler)
    .then(
      (response: AxiosResponse): ExecutionContext[] => {
        const { data, status, statusText } = response;
        if (status !== 200) {
          throw statusText;
        }
        return data as ExecutionContext[];
      }
    );
}

export function getExecutionContext(id: string): Promise<ExecutionContext> {
  return agent
    .get(`/execution-contexts/${id}`)
    .catch(axiosErrorHandler)
    .then(
      (response: AxiosResponse): ExecutionContext => {
        const { data, status, statusText } = response;
        if (status !== 200) {
          throw statusText;
        }
        return data as ExecutionContext;
      }
    );
}

export function postExecutionContext(
  executionContext: Partial<ExecutionContext>
): Promise<ExecutionContext> {
  return agent
    .post('/execution-contexts', executionContext)
    .catch(axiosErrorHandler)
    .then(
      (response: AxiosResponse): ExecutionContext => {
        const { data, status, statusText } = response;
        if (status !== 201) {
          throw statusText;
        }
        return data as ExecutionContext;
      }
    );
}

export function updateExecutionContextStatus(
  executionContextId: string,
  executionContextStatus: ExecutionContextStatus
): Promise<boolean> {
  return agent
    .put(`/execution-contexts/${executionContextId}/status`, {
      status: executionContextStatus,
    })
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

export function deleteExecutionContext(id: string) {
  return agent
    .delete(`/execution-contexts/${id}`)
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
