"use strict";
import { Model } from "sequelize";
import { AddressAttributes } from "../utils/interface";

module.exports = (sequelize: any, DataTypes: any) => {
  class Address extends Model<AddressAttributes> implements AddressAttributes {
    declare id: number;
    declare street: string;
    declare city: string;
    declare state: string;
    declare country: string;
    declare zipCode: string | null;
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      // define association here
      Address.belongsTo(models.User, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      }); // This will add a userId attribute to Order to hold the
    }
  }
  Address.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      street: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      zipCode: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Address",
      tableName: "address",
    }
  );
  return Address;
};
