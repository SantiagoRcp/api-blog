import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db";
import { IReactionsAttributes } from "../interfaces/IReactions Attributes";

type CreationAttributes = Optional<
  IReactionsAttributes,
  "id" | "createdAt" | "updatedAt"
>;

export default class Reactions
  extends Model<IReactionsAttributes, CreationAttributes>
  implements IReactionsAttributes
{
  public id!: number;
  public user_id!: number;
  public post_id!: number;
  public type!: "like" | "dislike" | "love";
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Reactions.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },

    user_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    post_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    type: { type: DataTypes.ENUM("like", "dislike", "love"), allowNull: false },

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
    modelName: "Reactions",
    tableName: "reactions",
    // Evita relaciones duplicadas.
    indexes: [{ unique: true, fields: ["user_id", "post_id", "type"] }],
  }
);
