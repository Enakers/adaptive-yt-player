import { Video } from '@prisma/client';
import axios, { AxiosError, AxiosInstance } from 'axios';
import { makeAutoObservable, runInAction } from 'mobx';
import { signIn } from 'next-auth/react';
import { TokenData } from '~/types/next-auth';
import RootStore from './rootStore';

export default class YTApi {
  query = '';
  nextPageToken?: string;
  loading = false;
  private api: AxiosInstance;

  videos: Video[] = [];

  constructor(private root: RootStore) {
    makeAutoObservable(this);

    this.api = axios.create({ baseURL: 'https://www.googleapis.com/youtube/v3' });
    this.api.interceptors.response.use(res => res, this.retryOn401);
  }

  search = async (query?: string) => {
    runInAction(() => (this.loading = true));
    const params = new URLSearchParams({
      maxResults: '50',
      part: 'snippet',
      q: query ?? this.query
    });

    if (!query) params.set('pageToken', this.nextPageToken!);

    const req = await this.api.get<YTSearchResponse>(`/search?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${this.root.tokenData!.accessToken}`
      }
    });

    const videos = req.data.items.map(this.mapToVideo);

    runInAction(() => {
      // if query is provided it is a new request so replace old response videos
      // if not it is triggered by infinite scroll so add to video list
      if (query) {
        this.videos = videos;
        this.query = query;
      } else {
        this.videos = this.videos.concat(videos);
      }

      this.nextPageToken = req.data.nextPageToken;
      this.loading = false;
    });
  };

  searchVideo = async (id: string) => {
    const params = new URLSearchParams({
      part: 'snippet',
      id,
      maxResults: '1'
    });

    const req = await this.api.get<YTSearchResponse>(`/videos?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${this.root.tokenData!.accessToken}`
      }
    });

    return this.mapToVideo(req.data.items[0]);
  };

  private mapToVideo = (ytVideo: YTVideo): Video => ({
    // search results return id as object with videoId property. video results return id as string
    // @ts-ignore
    id: ytVideo.id?.videoId ?? ytVideo.id,
    title: ytVideo.snippet.title,
    description: ytVideo.snippet.description,
    thumbnails: ytVideo.snippet.thumbnails,
    timers: []
  });

  private retryOn401 = async (error: AxiosError) => {
    const { status } = error.response!;

    if (status === 401) {
      const req = await axios.post<TokenData>('/api/auth/refresh', this.root.tokenData);
      const tokenData = req.data;
      if (tokenData.error) {
        signIn();
        return;
      }
      this.root.setTokenData(tokenData);

      error.config!.headers!['Authorization'] = `Bearer ${tokenData.accessToken}`;

      return this.api.request(error.config);
    }

    return Promise.reject(error);
  };
}
