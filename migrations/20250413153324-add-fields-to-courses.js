'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('courses', 'audience', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('courses', 'duration', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('courses', 'goals', {
      type: Sequelize.TEXT,
    });
    await queryInterface.addColumn('courses', 'status', {
      type: Sequelize.STRING,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('courses', 'audience');
    await queryInterface.removeColumn('courses', 'duration');
    await queryInterface.removeColumn('courses', 'goals');
    await queryInterface.removeColumn('courses', 'status');
  },
};
