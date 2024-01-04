"use strict";
import { Model } from "sequelize";
import slugify from "slugify";
import { TagAttributes } from "../utils/interface";

module.exports = (sequelize: any, DataTypes: any) => {
  class Tag extends Model<TagAttributes> implements TagAttributes {
    declare id: number;
    declare slug: string;
    declare name: string;
    declare image_url: string | null;
    declare description: string | null;
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      // define association here
      Tag.belongsToMany(models.Product, {
        through: "product_tag",
        onDelete: "CASCADE",
      });
    }
  }
  Tag.init(
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
          name: "unique_tag",
          msg: "Tag name already exists",
        },
      },

      slug: {
        type: DataTypes.CHAR(100),
        allowNull: false,
        unique: true,
      },

      description: {
        type: DataTypes.TEXT(),
        allowNull: true,
      },
      image_url: {
        type: DataTypes.TEXT(),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Tag",
      tableName: "tag",
      hooks: {
        beforeCreate: (tag, options) => {
          tag.slug = slugify(tag.name, {
            lower: true, // convert to lower case
            strict: true, // remove special characters
            replacement: "-", // replace spaces with replacement character, defaults to `-`
          });
        },
      },
    }
  );
  return Tag;
};
