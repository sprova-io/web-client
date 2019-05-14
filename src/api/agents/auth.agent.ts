import axios from 'axios';

const url = 'http://localhost:8181/';
const timeout = 5000;

const agent = axios.create({
  baseURL: url,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout,
});

export default agent;
