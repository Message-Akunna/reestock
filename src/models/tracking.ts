'use strict';
import { Model } from "sequelize";
module.exports = (sequelize: any, DataTypes: any) => {
  class Tracking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      // define association here
    }
  }
  Tracking.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    },
    {
      sequelize,
      modelName: "Tracking",
      tableName: "tracking",
    }
  );
  return Tracking;
};