import { DataTypes, Model } from 'sequelize';
import db from '.';
import Club from './Club';

class Match extends Model {
  public id!: number;

  public homeTeam!: number;

  public homeTeamGoals!: number;

  public awayTeam!: number;

  public awayTeamGoals!: number;

  public inProgress: boolean;
}

Match.init({
  id: { type: DataTypes.INTEGER, primaryKey: true },
  homeTeam: { type: DataTypes.INTEGER, allowNull: false },
  homeTeamGoals: DataTypes.INTEGER,
  awayTeam: { type: DataTypes.INTEGER, allowNull: false },
  awayTeamGoals: DataTypes.INTEGER,
  inProgress: DataTypes.BOOLEAN,
}, {
  underscored: true,
  sequelize: db,
  tableName: 'matchs',
  modelName: 'Match',
  timestamps: false,
});

Club.hasMany(Match, { foreignKey: 'homeTeam', as: 'match' });
Club.hasMany(Match, { foreignKey: 'awayTeam', as: 'match' });

Match.belongsTo(Club, { foreignKey: 'homeTeam', as: 'homeClub' });
Match.belongsTo(Club, { foreignKey: 'awayTeam', as: 'awayClub' });

export default Match;
