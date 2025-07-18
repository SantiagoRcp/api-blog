import { Optional, DataTypes, Model } from "sequelize";
import sequelize from "../config/db";
import IComment from "../interfaces/IComment";

type CommentAttributes = Optional<IComment, "id">;

 export default class Comment extends Model<IComment, CommentAttributes> implements IComment {
  public id!: number;
  public content!: string;
  public author_id!: number;
  public post_id!: number;
  public readonly createdAt?: Date | undefined;
  public readonly updatedAt?: Date | undefined;
}

Comment.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },

    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    author_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },

    post_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "comments",
    modelName: "Comment",
  }
);


