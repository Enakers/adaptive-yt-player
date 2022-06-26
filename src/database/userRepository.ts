import { Config, PrismaClient, Timer } from '@prisma/client';

const userRepository = {
  prisma: new PrismaClient(),

  async get(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  },

  async getTimers(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    return user!.timers;
  },

  async createTimer(id: string, timer: Timer) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (timer.default) {
      user!.timers.find(t => t.default)!.default = false;
    }

    user!.timers.push(timer);

    const userUpdate = await this.prisma.user.update({
      where: { id },
      data: {
        timers: user!.timers
      }
    });

    return userUpdate.timers;
  },

  async deleteTimer(id: string, timer: Timer) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    // 30 seconds is a timer that cannot be deleted. Safe to use as a fallback default
    if (timer.default) user!.timers.find(t => t.name === '30 seconds')!.default = true;

    const index = user!.timers.findIndex(t => t.name === timer.name);
    user!.timers.splice(index, 1);

    const userUpdate = await this.prisma.user.update({
      where: { id },
      data: { timers: user!.timers }
    });

    return userUpdate.timers;
  },

  async makeTimerDefault(id: string, timerName: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    user!.timers.find(t => t.default)!.default = false;
    user!.timers.find(t => t.name === timerName)!.default = true;

    const userUpdate = await this.prisma.user.update({
      where: { id },
      data: { timers: user!.timers }
    });

    return userUpdate.timers;
  },

  async getConfigs(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    return user?.configs;
  },

  async createConfig(id: string, config: Config) {
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        configs: {
          push: config
        }
      }
    });

    return user.configs;
  },

  async deleteConfig(id: string, configName: string) {
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        configs: {
          deleteMany: {
            where: { name: configName }
          }
        }
      }
    });

    return user.configs;
  },

  async updateConfig(id: string, config: Config) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (config.loadOnInit) {
      const old = user?.configs.find(c => c.loadOnInit);
      if (old) old.loadOnInit = false;
    }

    const index = user!.configs.findIndex(c => c.name === config.name);
    user!.configs[index] = config;

    const userUpdate = await this.prisma.user.update({
      where: { id },
      data: {
        configs: user?.configs
      }
    });

    return userUpdate.configs;
  }
};

export default userRepository;
