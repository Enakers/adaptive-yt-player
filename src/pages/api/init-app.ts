import { getToken } from 'next-auth/jwt';
import playlistRepository from '~/database/playlistRepository';
import userRepository from '~/database/userRepository';
import nc from '~/lib/nc';

export default nc().get(async (req, res) => {
  const token = await getToken({ req });

  const globalPlaylists = await playlistRepository.getGlobalPlaylists();
  const userPlaylists = await playlistRepository.getUserPlaylists(token!.sub!);
  const user = await userRepository.get(token!.sub!);

  res.status(200).json({
    globalPlaylists,
    userPlaylists,
    timers: user?.timers,
    configs: user?.configs
  });
});
