import Match from '../database/models/Match';
import Club from '../database/models/Club';
import * as ClubService from './ClubService';
import * as MatchService from './MatchService';

const getTotalGameByClub = async () => {
  const clubs = await ClubService.getAll();
  const matchs = await MatchService.getAll();
};

const filterMatchsByClub = (matchs: Match[], { id, clubName }: Club) => {
  const clubMatchs = matchs.filter((match) => match.homeTeam === id || match.awayTeam === id);

  return { name: clubName, clubMatchs };
};



const getGoals = (clubMatchs: Match[], id: number) => {
  const matchsWithGoals = clubMatchs.map((match) => {
    const [teamSide, opositeSide] = match.homeTeam === id ? ['homeTeam', 'awayTeam']
      : ['awayTeam', 'homeTeam'];
    const goalsFavor = match[`${teamSide}Goals` as keyof Match];
    const goalsOwn = match[`${opositeSide}Goals` as keyof Match];
  });
};
