import NewMatch from '../interfaces/NewMatch';
import Club from '../database/models/Club';
import Match from '../database/models/Match';

export const getAll = async () => {
  const matchs = await Match.findAll({
    include: [
      {
        model: Club,
        as: 'homeClub',
        foreignKey: 'homeTeam',
        attributes: { exclude: ['id'] },
      },
      { model: Club,
        as: 'awayClub',
        foreignKey: 'awayTeam',
        attributes: { exclude: ['id'] },
      },
    ],
  });

  return matchs;
};

export const getAllInProgress = async (inProgress: string) => {
  const matchs = await getAll();
  const filteredMatchs = matchs
    .filter((match) => `${match.inProgress}` === inProgress);
  return filteredMatchs;
};

export const create = async (
  {
    homeTeam,
    awayTeam,
    homeTeamGoals,
    awayTeamGoals,
    inProgress,
  }: NewMatch,
) => {
  const newMatch = { homeTeam, awayTeam, homeTeamGoals, awayTeamGoals, inProgress };
  const createdMatch = await Match.create(newMatch);
  return createdMatch;
};
