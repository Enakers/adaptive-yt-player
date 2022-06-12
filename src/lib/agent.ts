import axios, { AxiosResponse } from 'axios';

const api = axios.create({ baseURL: '/api', withCredentials: true });

const resBody = <T>(res: AxiosResponse<T>) => res.data;
const requests = {
  get: <T>(url: string) => api.get<T>(url).then(resBody),
  post: <T>(url: string, body: unknown) => api.post<T>(url, body).then(resBody),
  put: <T>(url: string, body: unknown) => api.put<T>(url, body).then(resBody),
  delete: <T>(url: string) => api.delete<T>(url).then(resBody)
};

const agent = {};

export default agent;
