"use strict";
import { Model } from "sequelize";
import { ORDER_STATUS, DELIVERY_TYPES } from "../utils/constants";
import { OrderAttributes } from "../utils/interface";
module.exports = (sequelize: any, DataTypes: any) => {
  class Order extends Model<OrderAttributes> implements OrderAttributes {
    declare id: number;
    declare orderTotal: number;
    declare status?: keyof typeof ORDER_STATUS;
    declare deliveryType: keyof typeof DELIVERY_TYPES;
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      // define association here
      Order.belongsTo(models.User, {
        as: "orders",
        foreignKey: "userId",
        onDelete: "CASCADE",
      }); // This will add a userId attribute to Order to hold the
      Order.belongsTo(models.Address, {
        foreignKey: "addressId",
        onDelete: "SET NULL",
      }); // This will add an addressId attribute to Order to hold the primary key value for Address
    }
  }
  Order.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      status: {
        type: DataTypes.ENUM(),
        values: Object.values(ORDER_STATUS),
        defaultValue: ORDER_STATUS.PENDING,
      },

      deliveryType: {
        type: DataTypes.ENUM(),
        values: Object.values(DELIVERY_TYPES),
        defaultValue: DELIVERY_TYPES.DELIVERY,
        allowNull: false,
      },
      orderTotal: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Order",
      tableName: "order",
    }
  );
  return Order;
};
