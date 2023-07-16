'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Comments extends Model {
    static associate(models) {
      this.belongsTo(models.Users, {foreignKey: 'UserId'});
      this.belongsTo(models.Posts, {foreignKey: 'PostId'});
    }
  }

  Comments.init(
    {
      commentContent: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "UserId"
      },
      PostId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "PostId"
      },
    },
    {
      sequelize,
      modelName: 'Comments',
      tableName: 'comments',
      underscored: true,
      timestamps: false,
    }
  );

  return Comments;
};
