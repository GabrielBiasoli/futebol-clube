import { NextFunction, Request, Response } from 'express';
import * as leaderboardService from '../services/LeaderboardService';

require('express-async-errors');

export const getAllByHome = async (
  _req: Request,
  res: Response,
  _next: NextFunction,
): Promise<Response> => {
  const clubsInfo = await leaderboardService.getAllOrderedByHome();

  return res.status(200).json(clubsInfo);
};

export const getAllByAway = async (
  _req: Request,
  res: Response,
  _next: NextFunction,
): Promise<Response> => {
  const clubsInfo = await leaderboardService.getAllOrderedByAway();

  return res.status(200).json(clubsInfo);
};

export const getAll = async (
  _req: Request,
  res: Response,
  _next: NextFunction,
): Promise<Response> => {
  const clubsInfo = await leaderboardService.getAllOrdered();

  return res.status(200).json(clubsInfo);
};
