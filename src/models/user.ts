"use strict";
import { CreationOptional, Model, Optional, UUIDV4 } from "sequelize";
import { UserAttributes } from "@/src/utils/interface";
import { ACCOUNT_STATUS, ROLES } from "../utils/constants";

//// we're telling the Model that 'id' is optional
//// when creating an instance of the model (such as using Model.create()).

module.exports = (sequelize: any, DataTypes: any) => {
  class User extends Model<UserAttributes> implements UserAttributes {
    declare id: CreationOptional<string>;
    declare surname: string;
    declare firstname: string;
    declare email: string;
    declare password: string;
    declare role: keyof typeof ROLES | undefined;
    declare status: keyof typeof ACCOUNT_STATUS | undefined;
    declare lastLogin: Date | undefined;
    declare token: string | undefined;
    declare avatar?: string | undefined;
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      // define association here
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      firstname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      surname: { type: DataTypes.STRING, allowNull: false },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM,
        values: Object.values(ROLES),
        defaultValue: ROLES.USER,
      },
      status: {
        type: DataTypes.ENUM,
        values: Object.values(ACCOUNT_STATUS),
        defaultValue: ACCOUNT_STATUS.UNVERIFIED,
      },
      lastLogin: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
      },
      token: {
        type: DataTypes.CHAR,
        allowNull: true,
      },
      avatar: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "user",
    }
  );
  return User;
};
