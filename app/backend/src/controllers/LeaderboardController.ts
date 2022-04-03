import { NextFunction, Request, Response } from 'express';
import * as leaderboardService from '../services/LeaderboardService';

export const getAllByHome = async (req: Request, res: Response, _next: NextFunction) => {
  const clubsInfo = await leaderboardService.getAllOrderedByHome();
  res.status(200).json(clubsInfo);
};

export const getAllByAway = async (req: Request, res: Response, _next: NextFunction) => {
  const clubsInfo = await leaderboardService.getAllOrderedByAway();
  res.status(200).json(clubsInfo);
};

export const getAll = async (req: Request, res: Response, _next: NextFunction) => {
  const clubsInfo = await leaderboardService.getAllOrdered();
  res.status(200).json(clubsInfo);
};

export default getAllByHome;
