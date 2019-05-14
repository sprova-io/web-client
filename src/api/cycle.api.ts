import { AxiosResponse } from 'axios';
import { Cycle } from 'sprova-types';
import agent from './agents/api.agent';
import axiosErrorHandler from './utils/axiosErrorHandler';

export function getCycles(projectId: string): Promise<Cycle[]> {
  return agent
    .get('/cycles', {
      params: {
        projectId,
      },
    })
    .catch(axiosErrorHandler)
    .then(
      (response: AxiosResponse): Cycle[] => {
        const { data, status, statusText } = response;
        if (status !== 200) {
          throw statusText;
        }
        return data as Cycle[];
      }
    );
}

export function getCycle(id: string): Promise<Cycle> {
  return agent
    .get(`/cycles/${id}`)
    .catch(axiosErrorHandler)
    .then(
      (response: AxiosResponse): Cycle => {
        const { data, status, statusText } = response;
        if (status !== 200) {
          throw statusText;
        }
        return data as Cycle;
      }
    );
}

export function postCycle(cycle: Partial<Cycle>) {
  return agent
    .post('/cycles', cycle)
    .catch(axiosErrorHandler)
    .then(
      (response: AxiosResponse): Cycle => {
        const { data, status, statusText } = response;
        if (status !== 201) {
          throw statusText;
        }
        return data as Cycle;
      }
    );
}

export function deleteCycle(id: string) {
  return agent
    .delete(`/cycles/${id}`)
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
