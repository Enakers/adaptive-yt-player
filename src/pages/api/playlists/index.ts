import { getToken } from 'next-auth/jwt';
import playlistRepository from '~/database/playlistRepository';
import nc from '~/lib/nc';

export default nc()
  .get(async (req, res) => {
    const token = await getToken({ req });
    const isGlobal = req.query.isGlobal;

    const playlists =
      isGlobal === 'true'
        ? await playlistRepository.getGlobalPlaylists()
        : await playlistRepository.getUserPlaylists(token!.sub!);

    res.status(200).json(playlists);
  })
  .post(async (req, res) => {
    const playlists = await playlistRepository.create(req.body);

    res.status(201).json(playlists);
  })
  .delete(async (req, res) => {
    const id = req.query.id as string;
    const playlists = await playlistRepository.delete(id);

    res.status(200).json(playlists);
  });
