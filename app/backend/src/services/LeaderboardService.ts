import Match from '../database/models/Match';
import Club from '../database/models/Club';
import * as ClubService from './ClubService';
import * as MatchService from './MatchService';
import { MatchResult, ClubInfo } from '../interfaces';

const filterMatchsByClub = (matchs: Match[], { id, clubName }: Club, side?: string) => {
  const clubMatchs = matchs.filter((match) => {
    const isHomeTeam = match.homeTeam === id;
    const isAwayTeam = match.awayTeam === id;
    if (side === undefined) return isHomeTeam || isAwayTeam;
    return (side === 'home') ? isHomeTeam : isAwayTeam;
  });

  return { name: clubName, clubMatchs, id };
};

const getMatchResult = (goalsbalance: number) => {
  if (goalsbalance > 0) return [1, 0, 0];
  return goalsbalance === 0 ? [0, 1, 0] : [0, 0, 1];
};

const getMatchInfo = (clubMatchs: Match[], id: number, side?: string): MatchResult[] => clubMatchs
  .map(({ homeTeam, awayTeamGoals, homeTeamGoals }) => {
    let [goalsFavor, goalsOwn] = [0, 0];
    if (!side) {
      [goalsFavor, goalsOwn] = homeTeam === id ? [homeTeamGoals, awayTeamGoals]
        : [awayTeamGoals, homeTeamGoals];
    } else {
      goalsFavor = side === 'home' ? homeTeamGoals : awayTeamGoals;
      goalsOwn = side === 'home' ? awayTeamGoals : homeTeamGoals;
    }
    const [victory, draw, loss] = getMatchResult(goalsFavor - goalsOwn);
    return {
      goalsFavor,
      goalsOwn,
      goalsBalance: goalsFavor - goalsOwn,
      victory,
      draw,
      loss,
    } as MatchResult;
  });

const getTotalPoints = (victories: number, draws: number): number => {
  const victoryPoints = victories * 3;
  return victoryPoints + draws;
};

const sumMatchsResults = (matchResults: MatchResult[]) => {
  const totalGoalsFavor = matchResults.reduce((acc, { goalsFavor }) => acc + goalsFavor, 0);
  const totalGoalsOwn = matchResults.reduce((acc, { goalsOwn }) => acc + goalsOwn, 0);
  const totalGoalsBalance = matchResults.reduce((acc, { goalsBalance }) => acc + goalsBalance, 0);
  const totalVictories = matchResults.reduce((acc, { victory }) => acc + victory, 0);
  const totalDraws = matchResults.reduce((acc, { draw }) => acc + draw, 0);
  const totalLosses = matchResults.reduce((acc, { loss }) => acc + loss, 0);
  const totalPoints = getTotalPoints(totalVictories, totalDraws);
  return {
    totalPoints,
    totalGames: matchResults.length,
    totalVictories,
    totalDraws,
    totalLosses,
    goalsFavor: totalGoalsFavor,
    goalsOwn: totalGoalsOwn,
    goalsBalance: totalGoalsBalance,
    efficiency: +((totalPoints / (matchResults.length * 3)) * 100).toFixed(2),
  };
};

export const getAllBySide = async (side?: string) => {
  const clubs = await ClubService.getAll();
  const matchs = await MatchService.getAllInProgress('false');
  const clubsWithMatchs = clubs.map((club) => filterMatchsByClub(matchs, club, side));
  return clubsWithMatchs.map(({ clubMatchs, name, id }) => {
    const matchInfo = getMatchInfo(clubMatchs, id, side);
    const matchResultsSummed = sumMatchsResults(matchInfo);
    return {
      name,
      ...matchResultsSummed,
    };
  });
};

const orderClubs = (clubsStats: ClubInfo[]) => clubsStats.sort((a, b) => {
  if (a.totalPoints > b.totalPoints) return -1;
  if (a.totalPoints < b.totalPoints) return 1;
  if (a.totalVictories > b.totalVictories) return -1;
  if (a.totalVictories < b.totalVictories) return 1;
  if (a.goalsBalance > b.goalsBalance) return -1;
  if (a.goalsBalance < b.goalsBalance) return 1;
  if (a.goalsFavor > b.goalsFavor) return -1;
  if (a.goalsFavor < b.goalsFavor) return 1;
  if (a.goalsOwn > b.goalsOwn) return -1;
  if (a.goalsOwn < b.goalsOwn) return 1;
  return 0;
});
export const getAllOrderedByHome = async () => {
  const clubsStats = await getAllBySide('home');
  return orderClubs(clubsStats);
};

export const getAllOrderedByAway = async () => {
  const clubStats = await getAllBySide('away');
  return orderClubs(clubStats);
};

export const getAllOrdered = async () => {
  const clubStats = await getAllBySide();
  return orderClubs(clubStats);
};
