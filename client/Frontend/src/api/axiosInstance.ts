import axios, { AxiosInstance } from 'axios';
import { SERVER_URL } from '../components/Authentication/Authentication'; // debug

export const myApi: AxiosInstance = axios.create({
  baseURL: SERVER_URL,
  withCredentials: true,
});
