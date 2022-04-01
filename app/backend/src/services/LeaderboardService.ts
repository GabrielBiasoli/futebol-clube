import Match from '../database/models/Match';
import Club from '../database/models/Club';
import * as ClubService from './ClubService';
import * as MatchService from './MatchService';

const filterMatchsByClub = (matchs: Match[], { id, clubName }: Club) => {
  const clubMatchs = matchs.filter((match) => match.homeTeam === id || match.awayTeam === id);

  return { name: clubName, clubMatchs };
};

const getMatchResult = (goalsbalance: number) => {
  if (goalsbalance > 0) return [1, 0, 0];
  return goalsbalance === 0 ? [0, 1, 0] : [0, 0, 1];
};

const getMatchInfo = (clubMatchs: Match[], id: number) => clubMatchs.map((match) => {
  const [teamSide, opositeSide] = match.homeTeam === id
    ? ['homeTeam', 'awayTeam']
    : ['awayTeam', 'homeTeam'];
  const goalsFavor = match[`${teamSide}Goals` as keyof Match];
  const goalsOwn = match[`${opositeSide}Goals` as keyof Match];
  const goalsBalance = goalsFavor - goalsOwn;
  const [victory, draw, loss] = getMatchResult(goalsBalance);
  return {
    goalsFavor,
    goalsOwn,
    goalsBalance,
    victory,
    draw,
    loss,
  };
});

const getTotalGameByClub = async () => {
  const clubs = await ClubService.getAll();
  const matchs = await MatchService.getAll();
  const clubsWithMatchs = clubs.map((club) => filterMatchsByClub(matchs, club));
  clubsWithMatchs.map(({ clubMatchs, name }) => {

  });
};
