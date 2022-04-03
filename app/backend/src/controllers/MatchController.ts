import { Request, NextFunction, Response } from 'express';
import * as MatchService from '../services/MatchService';

require('express-async-errors');

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> => {
  if (req.query.inProgress) return next();

  const matchs = await MatchService.getAll();

  return res.status(200).json(matchs);
};

export const getAllInProgress = async (
  req: Request,
  res: Response,
  _next: NextFunction,
): Promise<Response> => {
  const { inProgress } = req.query;
  const matchs = await MatchService.getAllInProgress(inProgress as string);

  return res.status(200).json(matchs);
};

export const create = async (
  req: Request,
  res: Response,
  _next: NextFunction,
): Promise<Response> => {
  const newMatch = await MatchService.create(req.body);

  return res.status(201).json(newMatch);
};

export const finishMatch = async (
  req: Request,
  res: Response,
  _next: NextFunction,
): Promise<Response> => {
  const { id } = req.params;
  const [numberOfUpdates] = await MatchService.finishMatch(Number(id));

  return res.status(200).json({ numberOfUpdates });
};

export const updateGoals = async (
  req: Request,
  res: Response,
  _next: NextFunction,
): Promise<Response> => {
  const { id } = req.params;
  const { homeTeamGoals, awayTeamGoals } = req.body;
  const [numberOfUpdates] = await MatchService
    .updateGoals({ id, homeTeamGoals, awayTeamGoals });

  return res.status(200).json({ numberOfUpdates });
};
