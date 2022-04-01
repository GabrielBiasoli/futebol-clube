import Match from 'src/database/models/Match';
import Club from '../database/models/Club';
import * as ClubService from './ClubService';
import * as MatchService from './MatchService';

const getTotalGameByClub = async () => {
  const clubs = await ClubService.getAll();
  const matchs = await MatchService.getAll();
};

const func = (matchs: Match[], { id, clubName }: Club) => {
  const clubMatchs = matchs.filter((match) => match.homeTeam === id || match.awayTeam === id);
  
};
