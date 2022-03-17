import User from '../database/models/User';

interface Login {
  email: string,
  password: string,
}

const returnOptions = {
  attributes: { exclude: ['password'] },
  raw: true,
};

export const login = async ({ email, password }: Login) => {
  const user = await User.findOne({ ...returnOptions, where: { email, password } });
  return user;
};

export default login;
