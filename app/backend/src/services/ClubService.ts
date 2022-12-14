import Club from '../database/models/Club';

export const getAll = async () => {
  const clubs = await Club.findAll();

  return clubs;
};

export const getById = async (id: number) => {
  const club = await Club.findByPk(id);

  return club;
};
