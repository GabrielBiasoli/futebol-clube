import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import readSecret from '../../utils/readFile';

const tokenExists = (token: string | undefined): string => {
  if (!token) throw new Error();
  return token;
};

const authenticateToken = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const token = tokenExists(req.headers.authorization);
    const secret = await readSecret();
    const user = jwt.verify(token, secret);
    req.body.user = user;
  } catch (error) {
    next(error);
  }
  next();
};

export default authenticateToken;
