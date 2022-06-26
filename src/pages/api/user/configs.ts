import { getToken } from 'next-auth/jwt';
import userRepository from '~/database/userRepository';
import nc from '~/lib/nc';

export default nc()
  .get(async (req, res) => {
    const token = await getToken({ req });

    res.status(200).json(await userRepository.getConfigs(token!.sub!));
  })
  .post(async (req, res) => {
    const token = await getToken({ req });

    res.status(201).json(await userRepository.createConfig(token!.sub!, req.body));
  })
  .put(async (req, res) => {
    const token = await getToken({ req });

    res.status(201).json(await userRepository.updateConfig(token!.sub!, req.body));
  })
  .delete(async (req, res) => {
    const token = await getToken({ req });

    res.status(200).json(await userRepository.deleteConfig(token!.sub!, req.query.name as string));
  });
