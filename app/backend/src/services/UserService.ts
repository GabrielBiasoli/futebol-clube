import * as bcrypt from 'bcryptjs';
import User from '../database/models/User';

interface Login {
  email: string,
  password: string,
}

// const returnOptions = {
//   attributes: { exclude: ['password'] },
//   raw: true,
// };

const INVALID_USER = new Error('INVALID_USER');

export const login = async ({ email, password }: Login) => {
  const userFromRegister = await User.findOne({ where: { email }, raw: true });
  const correctPassword = bcrypt.compareSync(password, (userFromRegister?.password as string));

  if (!correctPassword) throw INVALID_USER;

  return userFromRegister;
};

export default login;
