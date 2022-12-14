import { NextFunction, Request, Response } from 'express';
import StatusCode from '../enums/StatusCode';

interface ErrorMap {
  INVALID_USER: [string, StatusCode],
  MISSING_FIELDS: [string, StatusCode],
  EQUAL_TEAMS: [string, StatusCode],
  INVALID_INPROGRESS: [string, StatusCode],
  TEAM_NOT_FOUND: [string, StatusCode],
}

const errorMap: ErrorMap = {
  INVALID_USER: ['Incorrect email or password', StatusCode.UNAUTHORIZED],
  MISSING_FIELDS: ['All fields must be filled', StatusCode.UNAUTHORIZED],
  EQUAL_TEAMS: [
    'It is not possible to create a match with two equal teams',
    StatusCode.UNAUTHORIZED,
  ],
  INVALID_INPROGRESS: ['inProgress property must be true', StatusCode.UNAUTHORIZED],
  TEAM_NOT_FOUND: ['There is no team with such id!', StatusCode.UNAUTHORIZED],
};

const domainError = async (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (!err.message) return next(err);

  // console.log(err);

  const [message, statusCode] = errorMap[err.message as keyof ErrorMap];
  res.status(statusCode).json({ message });
};

export default domainError;
