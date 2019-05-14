import { AxiosResponse } from 'axios';
import { Project } from 'sprova-types';
import agent from './agents/api.agent';
import axiosErrorHandler from './utils/axiosErrorHandler';

export interface QueryParams {
  limit?: number;
  skip?: number;
  sort?: any;
}

export async function getProjects(params?: QueryParams): Promise<Project[]> {
  return agent
    .get('/projects', { params })
    .catch(axiosErrorHandler)
    .then(
      (response: AxiosResponse): Project[] => {
        const { data, status, statusText } = response;
        if (status !== 200) {
          throw statusText;
        }
        return data as Project[];
      }
    );
}

export function getProject(projectId: string): Promise<Project> {
  return agent
    .get(`/projects/${projectId}`)
    .catch(axiosErrorHandler)
    .then(
      (response: AxiosResponse): Project => {
        const { data, status, statusText } = response;
        if (status !== 200) {
          throw statusText;
        }
        return data as Project;
      }
    );
}

export function postProject(project: Partial<Project>) {
  return agent
    .post('/projects', project)
    .catch(axiosErrorHandler)
    .then(
      (response: AxiosResponse): Project => {
        const { data, status, statusText } = response;
        if (status !== 201) {
          throw statusText;
        }
        return data as Project;
      }
    );
}

export function updateProject(project: Project) {
  return agent
    .put(`/projects/${project._id}`, project)
    .catch(axiosErrorHandler)
    .then(
      (response: AxiosResponse): void => {
        const { data, status, statusText } = response;
        if (status !== 200 || !data.ok) {
          throw statusText;
        }
      }
    );
}

export function deleteProject(id: string) {
  return agent
    .delete(`/projects/${id}`)
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
