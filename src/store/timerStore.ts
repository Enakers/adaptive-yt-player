import {Timer} from '@prisma/client';
import {makeAutoObservable, reaction} from 'mobx';
import agent from '~/lib/agent';

export default class TimerStore {
  timers: Timer[] = [{name: '30 seconds', playtime: 30000, default: true}];
  activeTimer: Timer | null = null;
  defaultTimer: Timer = {name: '30 seconds', playtime: 3000, default: true};

  constructor() {
    makeAutoObservable(this);

    reaction(
      () => this.timers,
      timers => {
        this.defaultTimer = timers.find(t => t.default)!;
      },
      {fireImmediately: true}
    );
  }

  get timer(): Timer {
    return this.activeTimer ?? this.defaultTimer;
  }

  setActiveTimer = (name: string) => {
    this.activeTimer = this.timers.find(t => t.name === name) ?? null;
  };

  create = async (timer: Timer) => {
    timer.playtime = timer.playtime * 1000;

    if (this.timers.some(t => t.name === timer.name)) {
      throw new Error(`Timer ${timer.name} already exists`);
    }

    const timers = await agent.timers.create(timer);

    this.setTimers(timers);
  };

  delete = async (timer: Timer) => {
    const timers = await agent.timers.delete(timer);

    this.setTimers(timers);
  };

  makeDefault = async (name: string) => {
    const timers = await agent.timers.makeDefault(name);

    this.setTimers(timers);
  };

  private setTimers = (timers: Timer[]) => (this.timers = timers);
}
