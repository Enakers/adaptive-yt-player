import playlistRepository from '~/database/playlistRepository';
import nc from '~/lib/nc';

export default nc()
  .post(async (req, res) => {
    const id = req.query.id as string;
    const videoId = req.query.videoId as string;
    const playlists = await playlistRepository.addVideoTimer(id, videoId, req.body);

    res.status(201).json(playlists);
  })
  .delete(async (req, res) => {
    const id = req.query.id as string;
    const videoId = req.query.videoId as string;
    const index = parseInt(req.query.index as string);
    const playlists = await playlistRepository.deleteVideoTimer(id, videoId, index);

    res.status(200).json(playlists);
  });
