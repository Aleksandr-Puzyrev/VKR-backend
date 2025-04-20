'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('lessons', 'description', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('lessons', 'moduleId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'modules',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    await queryInterface.removeColumn('lessons', 'courseId');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('lessons', 'description');
    await queryInterface.removeColumn('lessons', 'moduleId');
    await queryInterface.addColumn('lessons', 'courseId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'courses',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  }
};