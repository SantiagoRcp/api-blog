import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db";
import Post from "./Post.model";
import { TagAttibutes } from "../interfaces/ITagAttributes";

type TagCreationAttributes = Optional<TagAttibutes, "id">;

class Tag extends Model<TagAttibutes, TagCreationAttributes> implements TagAttibutes {
  public id!: number;
  public name!: string;
  public slug!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Tag.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    slug: {
      type: DataTypes.STRING,
      allowNull: false,
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
  { sequelize, tableName: "tags", modelName: "Tag" }
);

export default Tag;
