'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("comments", "UserId",{
      type: Sequelize.INTEGER,
      references: {
        model: "users",
        key: "id"
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

    await queryInterface.addColumn("comments", "PostId",{
      type:Sequelize.INTEGER,
      references: {
        model: "posts",
        key: "id"
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("comments", "UserId");
    await queryInterface.removeColumn("comments", "PostId");

  }
};
