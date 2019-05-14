import { AxiosResponse } from 'axios';
import { TestCase, TestStep } from 'sprova-types';
import agent from './agents/api.agent';
import axiosErrorHandler from './utils/axiosErrorHandler';

export function getTestCases(
  projectId: string,
  cycleId: string
): Promise<TestCase[]> {
  return agent
    .get('/testcases', {
      params: {
        projectId,
        cycleId,
      },
    })
    .catch(axiosErrorHandler)
    .then(
      (response: AxiosResponse): TestCase[] => {
        const { data, status, statusText } = response;
        if (status !== 200) {
          throw statusText;
        }
        return data as TestCase[];
      }
    );
}

export function getTestCase(id: string): Promise<TestCase> {
  return agent
    .get(`/testcases/${id}`)
    .catch(axiosErrorHandler)
    .then(
      (response: AxiosResponse): TestCase => {
        const { data, status, statusText } = response;
        if (status !== 200) {
          throw statusText;
        }
        return data as TestCase;
      }
    );
}

export function getTestCaseSteps(
  id: string,
  resolveInheritance = false
): Promise<TestStep[]> {
  return agent
    .get(`/testcases/${id}/steps`, {
      params: {
        resolveInheritance,
      },
    })
    .catch(axiosErrorHandler)
    .then(
      (response: AxiosResponse): TestStep[] => {
        const { data, status, statusText } = response;
        if (status !== 200) {
          throw statusText;
        }
        return data as TestStep[];
      }
    );
}

export function postTestCase(testCase: Partial<TestCase>): Promise<TestCase> {
  return agent
    .post('/testcases', testCase)
    .catch(axiosErrorHandler)
    .then(
      (response: AxiosResponse): TestCase => {
        const { data, status, statusText } = response;
        if (status !== 201) {
          throw statusText;
        }
        return data as TestCase;
      }
    );
}

export function updateTestCase(testCase: TestCase): Promise<boolean> {
  return agent
    .put(`/testcases/${testCase._id}`, testCase)
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

export function deleteTestCase(id: string): Promise<boolean> {
  return agent
    .delete(`/testcases/${id}`)
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
