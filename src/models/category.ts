"use strict";
import { Model } from "sequelize";
import slugify from "slugify";

module.exports = (sequelize: any, DataTypes: any) => {
  class Category extends Model {
    declare slug: string;
    declare name: string;
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      // define association here
      Category.belongsTo(Category, {
        foreignKey: "categoryId",
        as: "Parent",
        onDelete: "SET NULL",
      });
      Category.hasMany(Category, {
        foreignKey: "categoryId",
        as: "Children",
      });
    }
  }
  Category.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      name: {
        type: DataTypes.CHAR(80),
        allowNull: false,
        unique: {
          name: "unique_category",
          msg: `Category name already exists`,
        },
      },

      slug: {
        type: DataTypes.CHAR(100),
        allowNull: false,
      },

      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      description: {
        type: DataTypes.TEXT(),
        allowNull: true,
      },
      imageUrl: {
        type: DataTypes.TEXT(),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Category",
      tableName: "category",
      hooks: {
        beforeCreate: (category, options) => {
          category.slug = slugify(category.name, {
            lower: true, // convert to lower case
            strict: true, // remove special characters
            replacement: "-", // replace spaces with replacement character, defaults to `-`
          });
        },
      },
    }
  );
  return Category;
};
