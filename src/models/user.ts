"use strict";
import { CreationOptional, Model, Optional, UUIDV4 } from "sequelize";
import { compare, hashSync } from "bcryptjs";
//
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
    declare phoneNumber: string;
    declare password: string;
    declare tokenRef: string | undefined;
    declare avatar?: string | undefined;
    declare lastLogin: Date | undefined;
    declare role: keyof typeof ROLES | undefined;
    declare status: keyof typeof ACCOUNT_STATUS | undefined;
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      // define association here
      User.hasMany(models.Order, {
        as: "orders",
        foreignKey: "userId",
        onDelete: "CASCADE",
      }); // This will add a userId attribute to Order to hold the primary key value for User
    }
    async checkPassword(password: string) {
      try {
        return await compare(password, this.password);
      } catch (error) {
        throw error;
      }
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
        unique: { name: "unique_email", msg: "User with email already exists" },
      },
      phoneNumber: {
        type: DataTypes.CHAR(20),
        allowNull: false,
        unique: {
          name: "unique_phoneno",
          msg: "User with phone number already exists",
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        set(val: string) {
          return this.setDataValue("password", hashSync(val));
        },
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
      tokenRef: {
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
