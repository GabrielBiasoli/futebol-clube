import { Request, NextFunction, Response } from 'express';
import { UserService } from '../services/UserService';

const MISSING_FIELDS = new Error('MISSING_FIELDS');

export class UserController {
  private _UserService = new UserService();

  public async login(req: Request, _res: Response, next: NextFunction): Promise<void> {
    if (!req.body.email || !req.body.password) next(MISSING_FIELDS);
    try {
      const user = await this._UserService.login(req.body);
      req.body.user = user;
      next();
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;
