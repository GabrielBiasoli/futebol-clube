import * as jwt from 'jsonwebtoken';
import { Request, NextFunction, Response } from 'express';
import User from '../database/models/User';
import { UserService } from '../services/UserService';

interface UserRequest extends Request {
  user: User
}

// interface RequestHandlerWithUser extends RequestHandler {
//   (req: UserRequest, res: Response, next: NextFunction): void
// }

export class UserController {
  private _UserService = new UserService();

  public async login(req: UserRequest, _res: Response, next: NextFunction) {
    const user = await this._UserService.login(req.body);
    req.user = user;
    next();
  }
}
export default UserController;
