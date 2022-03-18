import * as jwt from 'jsonwebtoken';
import { Response, NextFunction } from 'express';

export const generateToken = (req: UserRequest, res: Response, _next: NextFunction) => {
  const { user } = req;

  const token = jwt.sign(user, 'secret');

  res.status(200).json({ user, token });
};

export default generateToken;
