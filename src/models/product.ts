"use strict";
import { Model } from "sequelize";
import slugify from "slugify";
//
import { ProductAttributes } from "@/src/utils/interface";

module.exports = (sequelize: any, DataTypes: any) => {
  class Product extends Model<ProductAttributes> implements ProductAttributes {
    declare id: string;
    declare sku: string;
    declare slug: string;
    declare name: string;
    declare price: number;
    declare brandName: string;
    declare description: string;
    declare reorderLevel: number;
    declare reorderQuantity: number;
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      // define association here
      Product.belongsTo(models.Category, {
        foreignKey: {
          name: "categoryId",
          allowNull: true,
        },
        as: "category",
        onDelete: "SET NULL",
      });
      Product.belongsToMany(models.Tag, {
        through: "product_tag",
        onDelete: "CASCADE",
      });
    }
  }
  Product.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      name: {
        type: DataTypes.CHAR(50),
        allowNull: false,
        unique: {
          name: "unique_product",
          msg: "Product with this name already exist",
        },
      },

      brandName: {
        type: DataTypes.CHAR(50),
        allowNull: false,
      },

      slug: {
        type: DataTypes.CHAR(50),
        allowNull: false,
      },

      description: {
        type: DataTypes.TEXT,
        defaultValue: null,
      },

      price: {
        type: DataTypes.DOUBLE,
        defaultValue: 0,
      },

      reorderLevel: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      reorderQuantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },

      sku: {
        type: DataTypes.CHAR(),
        defaultValue: null,
      },
    },
    {
      modelName: "Product",
      tableName: "product",
      hooks: {
        beforeValidate: (product, options) => {
          product.slug = slugify(product.name, {
            lower: true, // convert to lower case
            strict: true, // remove special characters
            replacement: "-", // replace spaces with replacement character, defaults to `-`
          });
        },
      },
      sequelize,
    }
  );
  return Product;
};
