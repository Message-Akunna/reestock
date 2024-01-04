"use strict";
import { Model } from "sequelize";
import { PAYMENT_STATUS } from "../utils/constants";
import { PaymentAttributes } from "../utils/interface";
module.exports = (sequelize: any, DataTypes: any) => {
  class Payment extends Model<PaymentAttributes> implements PaymentAttributes {
    declare id: number;
    declare amount: number;
    declare trans_ref: string;
    declare transactionId: number | null;
    declare status: keyof typeof PAYMENT_STATUS;
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      // define association here
      Payment.belongsTo(models.User, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });
      Payment.belongsTo(models.Order, {
        foreignKey: "paymentId",
        onDelete: "CASCADE",
      });
    }
  }
  Payment.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      trans_ref: {
        type: DataTypes.CHAR(100),
        allowNull: false,
      },

      transactionId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      status: {
        type: DataTypes.ENUM,
        values: Object.values(PAYMENT_STATUS),
        defaultValue: PAYMENT_STATUS.PENDING,
      },
    },
    {
      sequelize,
      modelName: "Payment",
      tableName: "payment",
    }
  );
  return Payment;
};
