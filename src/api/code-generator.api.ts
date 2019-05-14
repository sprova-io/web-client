import { AxiosResponse } from 'axios';
import agent from './agents/api.agent';
import axiosErrorHandler from './utils/axiosErrorHandler';

export function getGeneratedTestCase(testCaseId: string, language: string) {
  return agent
    .get(`/generators/${language}/testcases/${testCaseId}`)
    .catch(axiosErrorHandler)
    .then(
      (response: AxiosResponse): string => {
        const { data, status, statusText } = response;
        if (status !== 200 || !data.ok) {
          throw statusText;
        }
        return data.content as string;
      }
    );
}
