"use strict";
import { Model } from "sequelize";
import { CartAttributes, CartItemAttributes } from "../utils/interface";
module.exports = (sequelize: any, DataTypes: any) => {
  class CartItem extends Model<CartItemAttributes> implements CartAttributes {
    declare id: number;
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      // define association here
      CartItem.belongsTo(models.Cart, {
        as: "items",
        foreignKey: "cartId",
        onDelete: "CASCADE",
      });
      CartItem.belongsTo(models.Product, {
        as: "product",
        foreignKey: "productId",
        onDelete: "CASCADE",
      });
    }
  }
  CartItem.init(
    {
      // CartItem attributes
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
    },
    {
      sequelize,
      modelName: "CartItem",
      tableName: "cart_item",
    }
  );
  return CartItem;
};
