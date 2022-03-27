import Club from '../database/models/Club';
import Match from '../database/models/Match';

export const getAll = async () => {
  const matchs = await Match.findAll({
    include: [
      { model: Club, as: 'homeClub', attributes: { exclude: ['id'] } },
      { model: Club, as: 'awayClub', attributes: { exclude: ['id'] } },
    ],
  });

  return matchs;
};

export default getAll;
