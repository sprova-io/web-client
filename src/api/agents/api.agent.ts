import axios from 'axios';

const url = 'http://localhost:8181/api/';
const timeout = 5000;

const getToken = () => localStorage.getItem('token');

const formatToken = (token: string | null) => {
  return token && `Bearer ${token}`;
};

export const setToken = (token: string | null) => {
  agent.defaults.headers.Authorization = formatToken(token);
};

const agent = axios.create({
  baseURL: url,
  headers: {
    "Authorization": formatToken(getToken()),
    'Content-Type': 'application/json',
  },
  timeout,
});

export default agent;
