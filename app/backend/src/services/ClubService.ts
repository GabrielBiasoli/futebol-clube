import Club from '../database/models/Club';

export const getAll = async () => {
  const clubs = await Club.findAll();
  return clubs;
};

export default getAll;
