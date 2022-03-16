'use strict';

import { DataTypes, QueryInterface, Sequelize } from "sequelize/types";

module.exports = {
  up: async (queryInterface: QueryInterface, _Sequelize: Sequelize) => {
    await queryInterface.createTable('clubs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.STRING
      }, 
      clubName: {
        type: DataTypes.STRING
      },
    });
  },
  down: async (queryInterface: QueryInterface, _Sequelize: Sequelize) => {
    await queryInterface.dropTable('clubs');
  }
};