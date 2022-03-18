import { Request, NextFunction, Response, RequestHandler } from 'express';
import User from 'src/database/models/User';
import * as jwt from 'jsonwebtoken';
import * as UserService from '../services/UserService';

interface UserRequest extends Request {
  user: User
}

// interface RequestHandlerWithUser extends RequestHandler {
//   (req: UserRequest, res: Response, next: NextFunction): void
// }

// class UserController {
//   UserService = UserService;
// }

export const login = async (req: UserRequest, _res: Response, next: NextFunction) => {
  const user = await UserService.login(req.body);
  req.user = user;
  next();
};

export const generateToken = (req: UserRequest, res: Response, _next: NextFunction) => {
  const { user } = req;

  const token = jwt.sign(user, 'secret');

  res.status(200).json({ user, token });
};
