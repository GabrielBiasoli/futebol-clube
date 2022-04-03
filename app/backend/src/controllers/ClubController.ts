import { Request, NextFunction, Response } from 'express';
import * as ClubService from '../services/ClubService';

require('express-async-errors');

export const getAll = async (
  _req: Request,
  res: Response,
  _next: NextFunction,
): Promise<Response> => {
  const clubs = await ClubService.getAll();

  return res.status(200).json(clubs);
};

export const getById = async (
  req: Request,
  res: Response,
  _next: NextFunction,
): Promise<Response> => {
  const { id } = req.params;
  const club = await ClubService.getById(Number(id));

  return res.status(200).json(club);
};
