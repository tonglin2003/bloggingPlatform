'use strict';
const bcrypt = require("bcryptjs")

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "users",
      [
        {
          username: "username 1",
          password: await bcrypt.hash("password",10),
        }
      ], {}
    );

    const users = await queryInterface.sequelize.query(`SELECT id FROM users`);
    const userId = users[0][0].id;
    await queryInterface.bulkInsert(
      "posts",
      [
        {
          post_title: "Post 1",
          post_content: "Content 1",
          post_img_url: "https://via.placeholder.com/150x200.png",
          UserId: userId, 
        },
        {
          post_title: "Post 2",
          post_content: "Content 2",
          post_img_url: "https://via.placeholder.com/150x200.png",
          UserId: userId,
        }
      ], {}
    );
    const posts = await queryInterface.sequelize.query(`SELECT id FROM posts`);
    const postId = posts[0][0].id;

      await queryInterface.bulkInsert(
        "comments",
        [
          {
            comment_content: "comment1",
            UserId: userId,
            PostId: postId,
          },
          {
            comment_content: "comment2",
            UserId: userId,
            PostId: postId,
          }
        ]
      )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null, {});
    await queryInterface.bulkDelete("posts", null, {});
    await queryInterface.bulkDelete("comments", null, {});
  }
};
