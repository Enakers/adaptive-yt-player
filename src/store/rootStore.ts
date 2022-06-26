import { action, makeObservable, observable, runInAction } from 'mobx';
import { signOut } from 'next-auth/react';
import agent from '~/lib/agent';
import { TokenData } from '~/types/next-auth';
import InputStore from './inputStore';
import PlayerApi from './playerApi';
import PlaylistStore from './playlistStore';
import TimerStore from './timerStore';
import YTApi from './ytApi';

export default class RootStore {
  appLoading = true;
  tokenData: TokenData | null = null;
  userId: string | null = null;

  playlistStore: PlaylistStore;
  timerStore: TimerStore;
  inputStore: InputStore;
  playerApi: PlayerApi;
  ytApi: YTApi;

  constructor() {
    this.playlistStore = new PlaylistStore(this);
    this.timerStore = new TimerStore();
    this.inputStore = new InputStore();
    this.playerApi = new PlayerApi(this);
    this.ytApi = new YTApi(this);

    makeObservable(this, {
      tokenData: observable,
      userId: observable,
      setTokenData: action,
      setUserId: action,
      initApp: action,
      appLoading: observable
    });
  }

  setTokenData = (tokenData: TokenData | null) => (this.tokenData = tokenData);
  setUserId = (userId: string | null) => {
    if (userId === this.userId) return;
    if (!this.appLoading) this.appLoading = true;

    this.userId = userId;
    this.initApp();
  };

  logout = () => {
    this.tokenData = null;
    this.userId = null;
    signOut();
  };

  initApp = async () => {
    const data = await agent.initApp();

    const config = data.configs.find(c => c.loadOnInit);

    runInAction(() => {
      this.playlistStore.globalPlaylists = data.globalPlaylists;
      this.playlistStore.userPlaylists = data.userPlaylists;
      this.timerStore.timers = data.timers;
      this.inputStore.configs = data.configs;
      if (config) {
        this.inputStore.loadConfig(config);
      }
      this.appLoading = false;
    });
  };
}
