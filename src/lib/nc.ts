import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';

const nc = () => {
  return nextConnect<NextApiRequest, NextApiResponse>();
};

export default nc;
