import { DataTypes, Model } from 'sequelize';
import db from '.';

class Club extends Model {
  public id!: number;

  public clubName!: string;
}

Club.init({
  id: { type: DataTypes.INTEGER, primaryKey: true },
  clubName: DataTypes.STRING,
}, {
  underscored: true,
  sequelize: db,
  tableName: 'clubs',
  modelName: 'Club',
  timestamps: false,
});

export default Club;
