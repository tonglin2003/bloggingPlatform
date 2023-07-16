'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Posts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Users);
      this.hasMany(models.Comments, { foreignKey: 'PostId' });
    }
  }
  Posts.init({
    postTitle: DataTypes.STRING,
    postContent: DataTypes.STRING,
    postImgUrl: DataTypes.STRING,
    UserId: {
      type:DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: "Users",
        key: "id",
      },
      field: "UserId"      
    }
  }, {
    sequelize,
    modelName: 'Posts',
    tableName: "posts",
    underscored: true,
    timestamps: false
  });
  return Posts;
};