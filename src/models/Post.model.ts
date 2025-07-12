import { DataTypes, Model, Optional } from "sequelize";
import { PostAttributes } from "../interfaces/IPostAttributes";
import sequelize from "../config/db";

type CreationAttributes = Optional<
  PostAttributes,
  "id" | "createdAt" | "updatedAt"
>;

class Post
  extends Model<PostAttributes, CreationAttributes>
  implements PostAttributes
{
  public id!: number;
  public title!: string;
  public content!: string;
  public status!: string;
  public author_id!: number;
  public category_id!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public setTags!: (tagIds: number[] | number) => Promise<void>;
}

Post.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },

    title: { type: DataTypes.STRING(200), allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },

    status: {
      type: DataTypes.ENUM("draft", "published"),
      defaultValue: "draft",
      allowNull: false,
    },

    author_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },

    category_id: {type: DataTypes.INTEGER.UNSIGNED, 
      allowNull: false
    },

    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },

    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "Posts",
    modelName: "Post",
  }
);

export default Post;
