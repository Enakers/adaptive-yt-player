import { Playlist, Video } from '@prisma/client';
import { makeAutoObservable } from 'mobx';
import agent from '~/lib/agent';
import RootStore from './rootStore';

export default class PlaylistStore {
  userPlaylists: Playlist[] = [];
  globalPlaylists: Playlist[] = [];
  loadedPlaylist?: Playlist;

  constructor(private root: RootStore) {
    makeAutoObservable(this);
  }

  get playlists(): Playlist[] {
    return [...this.userPlaylists, ...this.globalPlaylists];
  }

  create = async (title: string, isGlobal: boolean) => {
    if (
      (isGlobal && this.globalPlaylists.some(t => t.title === title)) ||
      this.userPlaylists.some(t => t.title === title)
    ) {
      throw new Error(`Playlist ${title} already exists.`);
    }

    const playlists = await agent.playlists.create({
      title,
      isGlobal,
      userId: isGlobal ? null : this.root.userId!,
      videos: []
    });

    this.setPlaylists(playlists, isGlobal);
  };

  delete = async (id: string, isGlobal: boolean) => {
    const playlists = await agent.playlists.delete(id);

    this.setPlaylists(playlists, isGlobal);
  };

  addVideo = async (playlistId: string, video: Video) => {
    const playlists = await agent.playlists.addVideo(playlistId, video);

    this.setPlaylists(playlists, playlists[0].isGlobal);
  };

  deleteVideo = async (playlistId: string, videoId: string, isGlobal: boolean) => {
    const playlists = await agent.playlists.deleteVideo(playlistId, videoId);

    this.setPlaylists(playlists, isGlobal);
  };

  addVideoTimer = async (playlistId: string, videoId: string, minutes: number, seconds: number) => {
    const playlist = this.playlists.find(p => p.id === playlistId)!;
    const video = playlist.videos.find(v => v.id === videoId)!;
    const prevTimer = video.timers.find(t => t.index === video.timers.length - 1);

    const pauseTime = minutes * 60 + seconds;

    if (prevTimer && prevTimer.pauseTime > pauseTime) {
      throw new Error(`Pause time cannot be less than last timers pause time`);
    }

    const playlists = await agent.playlists.addVideoTimer(playlistId, videoId, {
      pauseTime,
      index: video.timers.length,
      videoTime: `${minutes}:${seconds}`
    });

    this.setPlaylists(playlists, playlist.isGlobal);
  };

  deleteVideoTimer = async (
    playlistId: string,
    videoId: string,
    index: number,
    isGlobal: boolean
  ) => {
    const playlists = await agent.playlists.deleteVideoTimer(playlistId, videoId, index);

    this.setPlaylists(playlists, isGlobal);
  };

  private setPlaylists = (playlists: Playlist[], isGlobal: boolean) => {
    if (isGlobal) this.globalPlaylists = playlists;
    else this.userPlaylists = playlists;
  };

  findVideo = async (videoId: string, playlistId?: string) => {
    if (playlistId) {
      return this.playlists.find(p => p.id === playlistId)?.videos.find(v => v.id === videoId)!;
    }

    let video = this.root.ytApi.videos?.find(v => v.id === videoId);

    if (!video) {
      video = await this.root.ytApi.searchVideo(videoId);
    }

    return video;
  };

  loadPlaylist = (playlist: Playlist) => {
    this.loadedPlaylist = playlist;
    this.root.ytApi.videos = playlist.videos;
  };
}
