import { getToken } from 'next-auth/jwt';
import userRepository from '~/database/userRepository';
import nc from '~/lib/nc';

export default nc()
  .get(async (req, res) => {
    const token = await getToken({ req });

    res.status(200).json(await userRepository.getTimers(token!.sub!));
  })
  .post(async (req, res) => {
    const token = await getToken({ req });

    res.status(201).json(await userRepository.createTimer(token!.sub!, req.body));
  })
  .put(async (req, res) => {
    const token = await getToken({ req });

    res.status(200).json(await userRepository.makeTimerDefault(token!.sub!, req.body.timerName));
  })
  .delete(async (req, res) => {
    const token = await getToken({ req });

    res.status(200).json(await userRepository.deleteTimer(token!.sub!, req.body));
  });
