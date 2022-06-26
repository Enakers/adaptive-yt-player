import { Playlist, PrismaClient, Video, VideoTimer } from '@prisma/client';

const playlistRepository = {
  prisma: new PrismaClient(),

  getGlobalPlaylists() {
    return this.prisma.playlist.findMany({ where: { isGlobal: true } });
  },
  getUserPlaylists(userId: string) {
    return this.prisma.playlist.findMany({ where: { userId } });
  },

  async create(playlist: Playlist) {
    await this.prisma.playlist.create({ data: playlist });

    if (playlist.isGlobal) return this.getGlobalPlaylists();

    return this.getUserPlaylists(playlist.userId!);
  },

  async delete(id: string) {
    const playlist = await this.prisma.playlist.delete({ where: { id } });

    if (playlist.isGlobal) return this.getGlobalPlaylists();

    return this.getUserPlaylists(playlist.userId!);
  },

  async addVideo(id: string, video: Video) {
    const playlist = await this.prisma.playlist.update({
      where: { id },
      data: {
        videos: {
          push: {
            id: video.id,
            title: video.title,
            description: video.description,
            thumbnails: {
              default: { url: video.thumbnails.default.url },
              medium: { url: video.thumbnails.default.url }
            },
            timers: []
          }
        }
      }
    });

    if (playlist.isGlobal) return this.getGlobalPlaylists();

    return this.getUserPlaylists(playlist.userId!);
  },

  async deleteVideo(id: string, videoId: string) {
    const playlist = await this.prisma.playlist.update({
      where: { id },
      data: {
        videos: {
          deleteMany: {
            where: { id: videoId }
          }
        }
      }
    });

    if (playlist.isGlobal) return this.getGlobalPlaylists();

    return this.getUserPlaylists(playlist.userId!);
  },

  async addVideoTimer(id: string, videoId: string, timer: VideoTimer) {
    const playlist = await this.prisma.playlist.update({
      where: { id },
      data: {
        videos: {
          updateMany: {
            where: { id: videoId },
            data: {
              timers: {
                push: timer
              }
            }
          }
        }
      }
    });

    if (playlist.isGlobal) return this.getGlobalPlaylists();

    return this.getUserPlaylists(playlist.userId!);
  },

  async deleteVideoTimer(id: string, videoId: string, timerIndex: number) {
    const playlist = await this.prisma.playlist.update({
      where: { id },
      data: {
        videos: {
          updateMany: {
            where: {
              id: videoId
            },
            data: {
              timers: {
                deleteMany: {
                  where: { index: timerIndex }
                }
              }
            }
          }
        }
      }
    });

    if (playlist.isGlobal) return this.getGlobalPlaylists();

    return this.getUserPlaylists(playlist.userId!);
  }
};

export default playlistRepository;
