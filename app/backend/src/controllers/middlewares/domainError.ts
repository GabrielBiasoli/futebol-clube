import { NextFunction, Request, Response } from 'express';
import StatusCode from '../enums/StatusCode';

interface ErrorMap {
  INVALID_USER: [string, StatusCode],
  MISSING_FIELDS: [string, StatusCode]
}

const errorMap: ErrorMap = {
  INVALID_USER: ['Incorrect email or password', StatusCode.UNAUTHORIZED],
  MISSING_FIELDS: ['All fields must be filled', StatusCode.UNAUTHORIZED],
};

const domainError = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (!err.message) return next(err);

  const [message, statusCode] = errorMap[err.message as keyof ErrorMap];
  res.status(statusCode).json({ message });
};

export default domainError;
