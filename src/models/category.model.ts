import { DataTypes, Model, Optional } from "sequelize";
import { ICategotyAttributes } from "../interfaces/ICategoryAttributes";
import sequelize from "../config/db";

type CreationAttributes = Optional<
  ICategotyAttributes,
  "id" | "createdAt" | "updatedAt"
>;

class Category
  extends Model<ICategotyAttributes, CreationAttributes>
  implements ICategotyAttributes
{
  public id!: number;
  public name!: string;
  public slug!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Category.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },

    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },

    slug: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
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
  { sequelize, tableName: "categories", modelName: "Category" }
);

export default Category;
