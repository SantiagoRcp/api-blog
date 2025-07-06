import { DataTypes, Model, Optional } from "sequelize";
import User from "./user.model";
import sequelize from "../config/db";

interface passwordResetCodeAttributes {
  id: number;
  user_id: number;
  code: string;
  expires_at: Date;
  created_at?: Date;
}

type CreationAttributes = Optional<
  passwordResetCodeAttributes,
  "id" | "created_at"
>;

class PasswordResetCode
  extends Model<passwordResetCodeAttributes, CreationAttributes>
  implements passwordResetCodeAttributes
{
  public id!: number;
  public user_id!: number;
  public code!: string;
  public expires_at!: Date;
  public readonly created_at!: Date;
}

// Initialize the PasswordResetCode model
PasswordResetCode.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },

    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },

    code: {
      type: DataTypes.STRING(10), // Adjust the length as needed
      allowNull: false,
    },

    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "password_reset_codes",
    modelName: "PasswordResetCode",
    timestamps: false,
  }
);

// Establecer relación con User
PasswordResetCode.belongsTo(User, { foreignKey: "user_id", as: "user" });
User.hasMany(PasswordResetCode, {
  foreignKey: "user_id",
  as: "passwordResetCodes",
});

export default PasswordResetCode;
