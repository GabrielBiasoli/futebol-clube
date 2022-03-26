import * as jwt from 'jsonwebtoken';
import { Response, NextFunction, Request } from 'express';
import readSecret from '../../utils/readFile';

export const generateToken = async (req: Request, res: Response, _next: NextFunction) => {
  const { user } = req.body;

  const secret = await readSecret();

  const token = jwt.sign(user, secret);

  res.status(200).json({ user, token });
};

export default generateToken;
