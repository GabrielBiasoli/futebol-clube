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

export const getAllInProgress = async (req: Request, res: Response, _next: NextFunction) => {
  const { inProgress } = req.query;
  const matchs = await MatchService.getAllInProgress(inProgress as string);
  res.status(200).json(matchs);
};

export const create = async (req: Request, res: Response, _next: NextFunction) => {
  const newMatch = await MatchService.create(req.body);
  res.status(201).json(newMatch);
};

export const update = async (req: Request, res: Response, _next: NextFunction) => {
  const { id } = req.params;
  await MatchService.updateOne(id);
  res.status(200).end();
};
