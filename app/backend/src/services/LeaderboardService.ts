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

interface MatchResult {
  goalsFavor: number,
  goalsOwn: number,
  goalsBalance: number,
  victory: number,
  draw: number,
  loss: number,
}

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

const sumMatchResults = (matchResults: MatchResult[]) => {
  const totalGoalsFavor = matchResults.reduce((acc, { goalsFavor }) => acc + goalsFavor, 0);
  const totalGoalsOwn = matchResults.reduce((acc, { goalsOwn }) => acc + goalsOwn, 0);
  const totalGoalsBalance = matchResults.reduce((acc, { goalsBalance }) => acc + goalsBalance, 0);
  const totalGames = matchResults.length;
  const totalVictories = matchResults.reduce((acc, { victory }) => acc + victory, 0);
  const totalDraws = matchResults.reduce((acc, { draw }) => acc + draw, 0);
  const totalLosses = matchResults.reduce((acc, { loss }) => acc + loss, 0);
  return {
    totalGames,
    totalVictories,
    totalDraws,
    totalLosses,
    goalsFavor: totalGoalsFavor,
    goalsOwn: totalGoalsOwn,
    goalsBalance: totalGoalsBalance,
  };
};

const getTotalGameByClub = async () => {
  const clubs = await ClubService.getAll();
  const matchs = await MatchService.getAll();
  const clubsWithMatchs = clubs.map((club) => filterMatchsByClub(matchs, club));
  clubsWithMatchs.map(({ clubMatchs, name }) => {

  });
};
