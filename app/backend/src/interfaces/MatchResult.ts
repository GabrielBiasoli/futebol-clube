import ClubGoals from './ClubGoals';

export default interface MatchResult extends ClubGoals {
  victory: number,
  draw: number,
  loss: number,
}
