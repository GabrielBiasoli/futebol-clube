import Match from '../database/models/Match';
import Club from '../database/models/Club';
import * as ClubService from './ClubService';
import * as MatchService from './MatchService';

const filterMatchsByClub = (matchs: Match[], { id, clubName }: Club) => {
  const clubMatchs = matchs.filter((match) => match.homeTeam === id);

  return { name: clubName, clubMatchs };
};

const getMatchResult = (goalsbalance: number) => {
  if (goalsbalance > 0) return [1, 0, 0];
  return goalsbalance === 0 ? [0, 1, 0] : [0, 0, 1];
};

interface ClubGoals {
  goalsFavor: number,
  goalsOwn: number,
  goalsBalance: number,
}

interface MatchResult extends ClubGoals {
  victory: number,
  draw: number,
  loss: number,
}

const getMatchInfo = (clubMatchs: Match[]): MatchResult[] => clubMatchs.map((match) => {
  const goalsFavor = match.homeTeamGoals;
  const goalsOwn = match.awayTeamGoals;
  const goalsBalance = goalsFavor - goalsOwn;
  const [victory, draw, loss] = getMatchResult(goalsBalance);
  return {
    goalsFavor,
    goalsOwn,
    goalsBalance,
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

interface ClubInfo extends ClubGoals {
  totalPoints: number;
  totalGames: number;
  totalVictories: number;
  totalDraws: number;
  totalLosses: number;
  goalsFavor: number;
  goalsOwn: number;
  goalsBalance: number;
  efficiency: number;
  name: string
}

export const getAllByHome = async () => {
  const clubs = await ClubService.getAll();
  const matchs = await MatchService.getAllInProgress('false');
  const clubsWithMatchs = clubs.map((club) => filterMatchsByClub(matchs, club));
  console.log(clubsWithMatchs[0].clubMatchs);

  return clubsWithMatchs.map(({ clubMatchs, name }) => {
    const matchInfo = getMatchInfo(clubMatchs);
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
  const clubsStats = await getAllByHome();
  return orderClubs(clubsStats);
};
