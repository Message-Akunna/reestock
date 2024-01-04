"use strict";
import { Model } from "sequelize";
import { ProductTagAttributes } from "../utils/interface";
module.exports = (sequelize: any, DataTypes: any) => {
  class ProductTag
    extends Model<ProductTagAttributes>
    implements ProductTagAttributes
  {
    declare tagId: number;
    declare productId: number;
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      // define association here
    }
  }
  ProductTag.init(
    {
      productId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: "product", // name of the table, not the model
          key: "id",
        },
      },
      tagId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: "tag", // name of the table, not the model
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "ProductTag",
      tableName: "product_tag",
      indexes: [
        {
          fields: ["productId"],
        },
      ],
    }
  );
  return ProductTag;
};
