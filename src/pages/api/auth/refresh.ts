import { refreshAccessToken } from '~/lib/googleAuth';
import nc from '~/lib/nc';

export default nc().post(async (req, res) => {
  return res.status(200).json(await refreshAccessToken(req.body));
});
