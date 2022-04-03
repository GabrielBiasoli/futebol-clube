import * as bcrypt from 'bcryptjs';
import User from '../database/models/User';
import Login from '../interfaces/Login';

const INVALID_USER = new Error('INVALID_USER');

export const login = async ({ email, password }: Login) => {
  const validUser = await User.findOne({ where: { email }, raw: true });
  if (!validUser) throw INVALID_USER;

  const correctPassword = bcrypt.compareSync(password, (validUser?.password as string));
  if (!correctPassword) throw INVALID_USER;

  return {
    id: validUser.id,
    username: validUser.username,
    role: validUser.role,
    email: validUser.email,
  };
};

export default login;
