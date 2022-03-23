import User from '../database/models/User';

interface Login {
  email: string,
  password: string,
}

const returnOptions = {
  attributes: { exclude: ['password'] },
  raw: true,
};

const INVALID_USER = new Error('INVALID_USER');

export class UserService {
  private _UserModel = User;

  public async login({ email, password }: Login) {
    const user = await this._UserModel
      .findOne({ ...returnOptions, where: { email, password } });

    if (!user) throw INVALID_USER;

    return user;
  }
}

export default UserService;
