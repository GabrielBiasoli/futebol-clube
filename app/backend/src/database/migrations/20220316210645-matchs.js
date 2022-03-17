'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('matchs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.STRING
      }, 
      homeTeam: {
        type: Sequelize.INTEGER,
      },
      homeTeamGoals: {
        type: Sequelize.INTEGER,
      },
      awayTeam: {
        type: Sequelize.INTEGER,
      },
      awayTeamGoals: {
        type: Sequelize.INTEGER,
      },
      inProgress: {
        type: DataTypes.BOOLEAN,
      },
    });
  },
  down: async (queryInterface, _Sequelize) => {
    await queryInterface.dropTable('matchs');
  }
};