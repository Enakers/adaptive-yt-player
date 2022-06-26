import playlistRepository from '~/database/playlistRepository';
import nc from '~/lib/nc';

export default nc()
  .post(async (req, res) => {
    const playlists = await playlistRepository.addVideo(req.query.id as string, req.body);

    res.status(200).json(playlists);
  })
  .delete(async (req, res) => {
    const id = req.query.id as string;
    const videoId = req.query.videoId as string;
    const playlists = await playlistRepository.deleteVideo(id, videoId);

    res.status(200).json(playlists);
  });
