"use strict";
import { Model } from "sequelize";
import { InventoryAttributes } from "../utils/interface";
module.exports = (sequelize: any, DataTypes: any) => {
  class Inventory
    extends Model<InventoryAttributes>
    implements InventoryAttributes
  {
    declare id: number;
    declare quantity: number;
    declare reorderLevel: number;
    declare reorderQuantity: number;
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      // define association here
      Inventory.belongsTo(models.Product, {
        foreignKey: "productId",
        onDelete: "CASCADE",
      });
    }
  }
  Inventory.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      reorderQuantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      reorderLevel: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
    },
    {
      sequelize,
      modelName: "Inventory",
      tableName: "inventory",
    }
  );
  return Inventory;
};
