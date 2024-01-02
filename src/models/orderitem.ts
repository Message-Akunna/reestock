"use strict";
import { Model } from "sequelize";
module.exports = (sequelize: any, DataTypes: any) => {
  class OrderItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      // define association here
      OrderItem.belongsTo(models.Product, {
        foreignKey: "productId",
        onDelete: "CASCADE",
      }); // This will add a productId attribute to OrderItem to hold the primary key value for Product
      OrderItem.belongsTo(models.Order, {
        foreignKey: "orderId",
        onDelete: "CASCADE",
      }); // This will also add an orderId attribute to OrderItem to hold the primary key value for Order
    }
  }
  OrderItem.init(
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
    },
    {
      sequelize,
      modelName: "OrderItem",
      tableName: "order_item",
    }
  );
  return OrderItem;
};
