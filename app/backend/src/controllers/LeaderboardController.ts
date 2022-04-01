import { NextFunction, Request, Response } from 'express';
import * as leaderboardService from '../services/LeaderboardService';

export const getAllMatchsByClub = async (req: Request, res: Response, _next: NextFunction) => {
  const clubsInfo = await leaderboardService.getAllClubsWithInfo();
  res.status(200).json(clubsInfo);
};

export default getAllMatchsByClub;
