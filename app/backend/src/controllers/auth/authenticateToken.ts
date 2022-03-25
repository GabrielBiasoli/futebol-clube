import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

const tokenExists = (token: string | undefined): string => {
  if (!token) throw new Error();
  return token;
};

const authenticateToken = (req: Request, _res: Response, next: NextFunction): void => {
  try {
    const token = tokenExists(req.headers.authorization);
    const user = jwt.verify(token, 'secret');
    req.body.user = user;
  } catch (error) {
    next(error);
  }
  next();
};

export default authenticateToken;
