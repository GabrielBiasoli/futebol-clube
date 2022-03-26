import { Request, NextFunction, Response } from 'express';
import * as UserService from '../services/UserService';

const MISSING_FIELDS = new Error('MISSING_FIELDS');

const validateLoginBody = (req: Request) => {
  if (!req.body.email || !req.body.password) throw MISSING_FIELDS;
};

export const login = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  try {
    validateLoginBody(req);
    const user = await UserService.login(req.body);
    req.body.user = user;
  } catch (error) {
    next(error);
  }
  next();
};

export const getRole = async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
  const { role } = req.body.user;
  res.status(200).json(role);
};

export default login;
