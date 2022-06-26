import { Config, Playlist, Timer, Video, VideoTimer } from '@prisma/client';
import axios, { AxiosResponse } from 'axios';

const api = axios.create({ baseURL: '/api', withCredentials: true });

const resBody = <T>(res: AxiosResponse<T>) => res.data;
const requests = {
  get: <T>(url: string) => api.get<T>(url).then(resBody),
  post: <T>(url: string, body: unknown) => api.post<T>(url, body).then(resBody),
  put: <T>(url: string, body: unknown) => api.put<T>(url, body).then(resBody),
  delete: <T>(url: string) => api.delete<T>(url).then(resBody)
};

const playlists = {
  get: (isGlobal: boolean) => requests.get<Playlist[]>(`/playlists/?isGlobal=${isGlobal}`),
  create: (playlist: Partial<Playlist>) => requests.post<Playlist[]>('/playlists', playlist),
  delete: (id: string) => requests.delete<Playlist[]>(`playlists/?id=${id}`),
  addVideo: (id: string, video: Video) => requests.post<Playlist[]>(`playlists/${id}`, video),
  deleteVideo: (id: string, videoId: string) =>
    requests.delete<Playlist[]>(`/playlists/${id}/?videoId=${videoId}`),
  addVideoTimer: (id: string, videoId: string, timer: VideoTimer) =>
    requests.post<Playlist[]>(`playlists/${id}/video/${videoId}`, timer),
  deleteVideoTimer: (id: string, videoId: string, index: number) =>
    requests.delete<Playlist[]>(`playlists/${id}/video/${videoId}/?index=${index}`)
};

const timers = {
  get: () => requests.get<Timer[]>('/user/timers'),
  create: (timer: Timer) => requests.post<Timer[]>('/user/timers', timer),
  delete: (timer: Timer) => api.delete<Timer[]>('/user/timers', { data: timer }).then(resBody),
  makeDefault: (timerName: string) => requests.put<Timer[]>('user/timers', { timerName })
};

const configs = {
  get: () => requests.get<Config[]>('/user/configs'),
  create: (config: Config) => requests.post<Config[]>('/user/configs', config),
  update: (config: Config) => requests.put<Config[]>('/user/configs', config),
  delete: (name: string) => requests.delete<Config[]>(`/user/configs/?name=${name}`)
};

const initApp = () =>
  requests.get<{
    globalPlaylists: Playlist[];
    userPlaylists: Playlist[];
    timers: Timer[];
    configs: Config[];
  }>('/init-app');

const agent = {
  playlists,
  timers,
  initApp,
  configs
};

export default agent;
