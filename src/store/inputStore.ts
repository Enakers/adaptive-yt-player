import { Config } from '@prisma/client';
import { makeAutoObservable } from 'mobx';
import Router from 'next/router';
import agent from '~/lib/agent';

export default class InputStore {
  inputOptions: InputOptions = {
    size: 'md',
    dwellTime: 1,
    fixedPosition: true
  };
  configs: Config[] = [];
  loadedConfig?: Config;

  constructor() {
    makeAutoObservable(this);
  }

  setInputMethod = (method: InputMethod | undefined) => (this.inputOptions.method = method);
  setDwellTimer = (time: number) => (this.inputOptions.dwellTime = time);
  setPosition = (isFixed: boolean) => (this.inputOptions.fixedPosition = isFixed);
  setSize = (size: InputSize) => (this.inputOptions.size = size);

  get inputSize() {
    switch (this.inputOptions.size) {
      case 'sm': {
        return {
          size: 100,
          imgSize: 50
        };
      }
      case 'md': {
        return {
          size: 150,
          imgSize: 70
        };
      }
      case 'lg': {
        return {
          size: 200,
          imgSize: 100
        };
      }
    }
  }

  getRandomPosition = () => {
    const spaceWidth = window.innerHeight - (this.inputSize.size + 20);
    const spaceHeight = window.innerWidth - (this.inputSize.size + 20);

    return {
      top: Math.round(Math.random() * spaceWidth) + 'px',
      left: Math.round(Math.random() * spaceHeight) + 'px'
    };
  };

  createOrUpdateConfig = async (
    name: string,
    loadOnInit: boolean,
    loadPlaylistPage: string | null,
    update?: boolean
  ) => {
    const config: Config = {
      name,
      loadOnInit,
      inputOptions: {
        ...this.inputOptions,
        method: this.inputOptions.method ?? null
      },
      loadPlaylistPage
    };

    const configs = update
      ? await agent.configs.update(config)
      : await agent.configs.create(config);
    this.setConfigs(configs);
  };

  updateConfig = async (config: Config) => {
    const configs = await agent.configs.update(config);
    this.setConfigs(configs);
  };

  deleteConfig = async (name: string) => {
    const configs = await agent.configs.delete(name);
    this.setConfigs(configs);
  };

  loadConfig = (config: Config) => {
    // @ts-ignore
    this.inputOptions = config.inputOptions;
    this.loadedConfig = config;
    if (config.loadPlaylistPage) Router.push(`/playlist/${config.loadPlaylistPage}`);
  };

  setConfigs = (configs: Config[]) => (this.configs = configs);
}
