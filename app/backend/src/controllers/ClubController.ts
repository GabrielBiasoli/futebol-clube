import { Request, NextFunction, Response } from 'express';
import * as ClubService from '../services/ClubService';

export const getAll = async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
  const clubs = await ClubService.getAll();

  res.status(200).json(clubs);
};

export default getAll;
