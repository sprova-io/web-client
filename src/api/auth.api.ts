import { AxiosResponse } from 'axios';
import decode from 'jwt-decode';
import { User } from 'sprova-types';
import { setToken } from './agents/api.agent';
import authAgent from './agents/auth.agent';
import axiosErrorHandler from './utils/axiosErrorHandler';

export function authenticate(
  username: string,
  password: string
): Promise<User> {
  return authAgent
    .post('authenticate', {
      password,
      username,
    })
    .catch(axiosErrorHandler)
    .then(
      (response: AxiosResponse): string => {
        const { data, status, statusText } = response;
        const { error, token } = data;
        if (status !== 200) {
          throw error || statusText;
        }
        return token;
      }
    )
    .then(
      (token: string): User => {
        localStorage.setItem('token', token);
        setToken(token);

        return decode(token) as User;
      }
    );
}

export function signup(username: string, password: string): Promise<boolean> {
  return authAgent
    .post('signup', {
      password,
      username,
    })
    .catch(axiosErrorHandler)
    .then(
      (response: AxiosResponse): boolean => {
        const { data, status, statusText } = response;
        if (status !== 200 || !data.ok) {
          throw statusText;
        }
        return data.ok;
      }
    );
}

export function getUser(): User | null {
  const token = localStorage.getItem('token');
  return token ? (decode(token) as User) : null;
}

export function isAuthenticated(): boolean {
  const token = localStorage.getItem('token');

  return !!token && !isTokenExpired(token);
}

function isTokenExpired(token: string): boolean {
  // TODO: Implement
  return false;
}

export function logout(): void {
  localStorage.removeItem('token');
  setToken(null);
}
