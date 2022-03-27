import { Request, NextFunction, Response } from 'express';
import * as MatchService from '../services/MatchService';

export const getAll = async (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
  const matchs = await MatchService.getAll();
  res.status(200).json(matchs);
};

export default getAll;
