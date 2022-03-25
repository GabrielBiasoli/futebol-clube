import { Request, NextFunction, Response } from 'express';
import rescue from 'express-rescue';
import * as UserService from '../services/UserService';

const MISSING_FIELDS = new Error('MISSING_FIELDS');

export const login = rescue(
  async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    if (!req.body.email || !req.body.password) next(MISSING_FIELDS);
    try {
      const user = await UserService.login(req.body);
      req.body.user = user;
      next();
    } catch (error) {
      next(error);
    }
  },
);

export default login;
