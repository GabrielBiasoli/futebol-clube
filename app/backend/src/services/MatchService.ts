import NewMatch from '../interfaces/NewMatch';
import UpdateGoals from '../interfaces/UpdateGoals';
import Club from '../database/models/Club';
import * as ClubService from './ClubService';
import Match from '../database/models/Match';

const EQUAL_TEAMS = new Error('EQUAL_TEAMS');
const INVALID_INPROGRESS = new Error('INVALID_INPROGRESS');
const TEAM_NOT_FOUND = new Error('TEAM_NOT_FOUND');

export const getAll = async () => {
  const matchs = await Match.findAll({
    include: [
      {
        model: Club,
        as: 'homeClub',
        foreignKey: 'homeTeam',
        attributes: { exclude: ['id'] },
      },
      {
        model: Club,
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

const teamsExist = async (homeTeamId: number, awayTeamId: number) => {
  const teams = await ClubService.getAll();
  const homeTeamExists = teams.some((team) => team.id === homeTeamId);
  const awayTeamExists = teams.some((team) => team.id === awayTeamId);

  if (!homeTeamExists || !awayTeamExists) throw TEAM_NOT_FOUND;
};

const validateNewMatch = async (newMatch: NewMatch) => {
  const { homeTeam, awayTeam } = newMatch;
  if (homeTeam === awayTeam) throw EQUAL_TEAMS;

  await teamsExist(homeTeam, awayTeam);
  if (!newMatch.inProgress) throw INVALID_INPROGRESS;
};

const getLastOne = async (): Promise<Match | null> => {
  const match = await Match.findOne({ order: [['id', 'DESC']] });

  return match;
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

  await validateNewMatch(newMatchData);
  await Match.create(newMatchData);

  return getLastOne();
};

export const finishMatch = async (id: number) => Match
  .update({ inProgress: false }, { where: { id } });

export const updateGoals = async ({ homeTeamGoals, awayTeamGoals, id }: UpdateGoals) => Match
  .update({ awayTeamGoals, homeTeamGoals }, { where: { id } });
