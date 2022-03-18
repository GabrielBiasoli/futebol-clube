import { Request, NextFunction, Response } from 'express';
import { UserService } from '../services/UserService';

export class UserController {
  private _UserService = new UserService();

  public async login(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const user = await this._UserService.login(req.body);
    req.body.user = user;
    next();
  }
}

export default UserController;
