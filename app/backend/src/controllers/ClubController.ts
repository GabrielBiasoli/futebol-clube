import { Request, NextFunction, Response } from 'express';
import * as ClubService from '../services/ClubService';

export const getAll = async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
  const clubs = await ClubService.getAll();

  res.status(200).json(clubs);
};

export const getById = async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
  const { id } = req.params;
  const club = await ClubService.getById(Number(id));
  res.status(200).json(club);
};
