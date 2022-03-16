'use strict';

import { DataTypes, QueryInterface, Sequelize } from "sequelize/types";

module.exports = {
  up: async (queryInterface: QueryInterface, _Sequelize: Sequelize) => {
    await queryInterface.createTable('matchs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.STRING
      }, 
      homeTeam: {
        type: DataTypes.INTEGER,
      },
      homeTeamGoals: {
        type: DataTypes.INTEGER,
      },
      awayTeam: {
        type: DataTypes.INTEGER,
      },
      awayTeamGoals: {
        type: DataTypes.INTEGER,
      },
      inProgress: {
        type: DataTypes.BOOLEAN,
      },
    });
  },
  down: async (queryInterface: QueryInterface, _Sequelize: Sequelize) => {
    await queryInterface.dropTable('matchs');
  }
};