import NewMatch from '../database/interfaces/NewMatch';
import Club from '../database/models/Club';
import Match from '../database/models/Match';

const EQUAL_TEAMS = new Error('EQUAL_TEAMS');

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

const getLastOne = async (): Promise<Match | null> => {
  const match = await Match.findOne({ order: [['id', 'DESC']] });
  return match;
};

const validateNewMatch = (newMatch: NewMatch) => {
  if (!newMatch.inProgress) throw new Error('inProgress property must be true');
  const { homeTeam, awayTeam } = newMatch;
  if (homeTeam === awayTeam) throw EQUAL_TEAMS;
};

export const create = async (
  {
    homeTeam,
    awayTeam,
    homeTeamGoals,
    awayTeamGoals,
    inProgress,
  }: NewMatch,
): Promise<Match | null> => {
  const newMatchData = { homeTeam, awayTeam, homeTeamGoals, awayTeamGoals, inProgress };
  validateNewMatch(newMatchData);
  await Match.create(newMatchData);

  return getLastOne();
};

export const updateOne = async (id: string) => {
  const match = await Match.findByPk(id);
  await Match.update({ ...match, inProgress: false }, { where: { id } });
};
