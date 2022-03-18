import * as jwt from 'jsonwebtoken';
import { Response, NextFunction, Request } from 'express';

export const generateToken = (req: Request, res: Response, _next: NextFunction) => {
  const { user } = req.body;

  const token = jwt.sign(user, 'secret');

  res.status(200).json({ user, token });
};

export default generateToken;
