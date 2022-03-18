import User from '../database/models/User';

interface Login {
  email: string,
  password: string,
}

const returnOptions = {
  attributes: { exclude: ['password'] },
  raw: true,
};

export class UserService {
  private _UserModel = User;

  public async login({ email, password }: Login) {
    const user = await this._UserModel
      .findOne({ ...returnOptions, where: { email, password } });

    // if (!user) throw new Error();

    return user || {};
  }
}

export default UserService;
