import { DataTypes, Model, Optional } from "sequelize";
import { UserAttributes } from "../interfaces/IUserAttributes";
import sequelize from "../config/db";

type UserCreationAttributes = Optional<
  UserAttributes,
  "id" | "profileimage" | "interests"
>;

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;
  public name!: string;
  public username!: string;
  public email!: string;
  public password!: string;
  public profileimage?: string;
  public interests?: string;
  public role!: "User" | "Author" | "Admin";
  public loginAttempts!: number;
  public lockUntil!: Date | null;

  // timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize the User model
User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    username: { type: DataTypes.STRING, allowNull: false, unique: true },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    password: { type: DataTypes.STRING, allowNull: false },
    profileimage: { type: DataTypes.STRING, allowNull: true },

    interests: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const interests = this.getDataValue("interests");
        return interests ? JSON.parse(interests) : [];
      },
      set(value: string[] | string) {
        this.setDataValue(
          "interests",
          Array.isArray(value) ? JSON.stringify(value) : value
        );
      },
    },

    role: {
      type: DataTypes.ENUM,
      values: ["User", "Author", "Admin"],
      allowNull: false,
      defaultValue: "User",
    },

    loginAttempts: {
      type: DataTypes.INTEGER.UNSIGNED,
      defaultValue: 0,
    },

    lockUntil: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "User",
  }
);

export default User;
