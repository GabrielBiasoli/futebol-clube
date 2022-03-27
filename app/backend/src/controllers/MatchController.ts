import { Request, NextFunction, Response } from 'express';
import * as MatchService from '../services/MatchService';

export const getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  if (req.query) return next();
  const matchs = await MatchService.getAll();
  res.status(200).json(matchs);
};

export const getAllInProgress = async (req: Request, res: Response, _next: NextFunction) => {
  const { inProgress } = req.query;
  const matchs = await MatchService.getAllInProgress(inProgress as string);
  res.status(200).json(matchs);
};

export default getAll;
