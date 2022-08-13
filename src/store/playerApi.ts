import {Video} from "@prisma/client";
import {makeAutoObservable} from "mobx";
import Router from "next/router";
import {FullScreenHandle} from "react-full-screen";
import YouTubePlayer from "yt-player";
import RootStore from "./rootStore";

const VALID_CODES = ["Enter", "Space"];

export default class PlayerApi {
  private player?: YouTubePlayer;
  video?: Video;
  useVideoTimers = false;
  videoTimerIndex = 0;
  private videoTimerPauseTime?: number;
  private pauseTimeout?: NodeJS.Timeout;
  isPlaying = false;
  isBuffering = false;
  ready = false;
  started = false;
  playlistVideoIndex = 0;
  handleFullscreen?: FullScreenHandle;

  constructor(private root: RootStore) {
    makeAutoObservable(this);
  }

  private get timer() {
    return this.root.timerStore.timer;
  }

  get isSwitchInput() {
    return this.root.inputStore.inputOptions.method === "switch";
  }

  setTimer = (name: string) => {
    if (name === "custom") {
      this.resetVideoTimer();
      return;
    }
    this.useVideoTimers = false;
    this.root.timerStore.setActiveTimer(name);
  };

  setStarted = () => {
    this.started = true;
    if (!this.handleFullscreen?.active) this.handleFullscreen?.enter();
  };

  setupPlayer(div: HTMLDivElement, video: Video, handleFullscreen: FullScreenHandle) {
    this.player = new YouTubePlayer(div, {
      keyboard: false,
      fullscreen: false,
      host: "https://www.youtube-nocookie.com",
      related: false,
      modestBranding: true,
      annotations: false
    });

    this.handleFullscreen = handleFullscreen;

    document.addEventListener("keyup", this.onKeyup);
    this.player.on("playing", this.onPlay);
    this.player.on("paused", this.onPause);
    this.player.on("timeupdate", this.onTimeUpdate);
    this.player.on("ended", this.onEnded);
    this.player.on("buffering", () => (this.isBuffering = true));
    this.player.on("cued", () => (this.isBuffering = false));

    this.video = video;
    if (video.timers) this.useVideoTimers = true;
    this.player.load(video.id);
    this.ready = true;

    return () => {
      document.removeEventListener("keyup", this.onKeyup);
      this.player?.destroy();
      this.ready = false;
    };
  }

  handlePlay = () => {
    this.incrementVideoTimerIndex();
    this.player?.play();
    if (!this.handleFullscreen?.active) this.handleFullscreen?.enter();
  };

  private onKeyup = (e: KeyboardEvent) => {
    if (!this.started) return;

    // TODO this is not triggered while fullscreen. Fullscreen esc to exit overrides
    if (e.code === "Escape") {
      this.player?.pause();
      this.started = false;
      return;
    }

    if (
      !this.isSwitchInput ||
      !VALID_CODES.includes(e.code) ||
      this.player?.getState() === "buffering"
    ) {
      return;
    }

    if (e.code === "Space" && this.root.inputStore.loadedConfig?.loadPlaylistPage) {
      this.onPause();
      Router.push(`/playlist/${this.root.inputStore.loadedConfig?.loadPlaylistPage}`);
      return;
    }

    if (this.player?.getState() === "playing" && this.timer.playtime === 0) {
      this.player?.pause();
      return;
    }

    this.handlePlay();
  };

  private onPlay = () => {
    this.isPlaying = true;
    this.isBuffering = false;
    if (this.useVideoTimers || this.timer.playtime === 0) return;

    this.pauseTimeout = setTimeout(() => this.player?.pause(), this.timer.playtime);
  };

  private onPause = () => {
    clearTimeout(this.pauseTimeout);
    this.isPlaying = false;
  };

  private onTimeUpdate = (seconds: number) => {
    if (!this.useVideoTimers) return;

    if (seconds >= this.videoTimerPauseTime!) {
      this.player?.pause();
    }
  };

  private incrementVideoTimerIndex = () => {
    const pauseTime = this.video?.timers.find(t => t.index === this.videoTimerIndex)?.pauseTime;

    if (pauseTime) {
      this.videoTimerPauseTime = pauseTime;
      this.videoTimerIndex++;
    } else {
      this.useVideoTimers = false;
      this.videoTimerIndex = 0;
    }
  };

  private resetVideoTimer = () => {
    this.useVideoTimers = true;
    this.videoTimerIndex = 0;
  };

  private onEnded = () => {
    if (this.root.playlistStore.loadedPlaylist) {
      this.playlistVideoIndex++;
      let video = this.root.ytApi.videos[this.playlistVideoIndex];
      if (!video) {
        video = this.root.ytApi.videos[0];
      }

      this.video = video;
      this.player?.load(video.id);
    }
  };
}
