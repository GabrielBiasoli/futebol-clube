import { Request, NextFunction, Response } from 'express';
import * as UserService from '../services/UserService';

require('express-async-errors');

const MISSING_FIELDS = new Error('MISSING_FIELDS');

const validateLoginBody = (req: Request): void => {
  if (!req.body.email || !req.body.password) throw MISSING_FIELDS;
};

export const login = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  validateLoginBody(req);
  const user = await UserService.login(req.body);
  req.body.user = user;

  next();
};

export const getRole = async (
  req: Request,
  res: Response,
  _next: NextFunction,
): Promise<Response> => {
  const { role } = req.body.user;

  return res.status(200).json(role);
};
