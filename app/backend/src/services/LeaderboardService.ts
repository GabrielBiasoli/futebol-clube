import * as ClubService from './ClubService';
import * as MatchService from './MatchService';

const getTotalGameByClub = async () => {
  const clubs = await ClubService.getAll();
  const matchs = await MatchService.getAll();
};
