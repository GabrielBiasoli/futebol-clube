'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('clubs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.STRING
      }, 
      clubName: {
        type: Sequelize.STRING
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('clubs');
  }
};