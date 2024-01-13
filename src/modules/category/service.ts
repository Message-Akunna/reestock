import {
  slugify,
  paginate,
  ExistsError,
  errorMessage,
  NotFoundError,
} from "iyasunday";
import { Transaction, col, fn } from "sequelize";
//
import db from "../../models";

export const create = async (body: {
  name: string;
  slug: string;
  categoryId: any;
}) => {
  return await db.sequelize.transaction(async (transaction: Transaction) => {
    let categories = await db.Category.findOne({
      where: { name: body.name },
      attributes: ["id"],
      transaction,
    });
    if (categories)
      throw new ExistsError(`${body.name} already exists in categories`);
    if (body.categoryId) {
      categories = await db.Category.findByPk(body.categoryId, {
        attributes: ["name"],
        transaction,
      });
      if (!categories) throw new NotFoundError("Invalid category sent");
    }

    categories = await db.Category.create(body, {
      transaction,
      individualHooks: true,
    });
    return {
      success: true,
      message: `${body.name} created successfully`,
      data: categories,
    };
  });
};

export const list = async ({
  limit,
  page,
  categoryId = undefined,
}: {
  limit: number;
  page: number;
  categoryId?: number;
}) => {
  let where: { [key: string]: any } = {};
  where.categoryId = categoryId ? categoryId : null;
  const totalCategoryCount = await db.Category.count({
    where,
  });
  const { offset, pageCount } = paginate(totalCategoryCount, page, limit);

  const categories = await db.Category.findAll({
    where,
    limit: limit,
    offset: offset,
  });

  return {
    success: true,
    categories,
    page,
    pageCount,
  };
};

export const listAll = async ({
  limit,
  page,
  categoryId = undefined,
}: {
  limit: number;
  page: number;
  categoryId?: number;
}) => {
  const totalCategoryCount = await db.Category.count();
  const { offset, pageCount } = paginate(totalCategoryCount, page, limit);

  const categories = await db.Category.findAll({
    limit: limit,
    offset: offset,
  });

  return {
    success: true,
    categories,
    page,
    pageCount,
  };
};

export const update = async (id: string, body: Record<any, any>) => {
  return await db.sequelize.transaction(async (transaction: Transaction) => {
    let category = await db.Category.findByPk(id, {
      transaction,
    });
    if (!category) throw new NotFoundError("Category not found");
    if (Number(category.id) === Number(body.categoryId))
      throw errorMessage("Category cannot be a parent of itself");
    body.slug = slugify(body.name, true);
    category = await category.update(body, {
      transaction,
      individualHooks: true,
    });

    return {
      success: true,
      message: "Category updated successfully",
      data: category,
    };
  });
};

export const destroy = async (categoryId: string) => {
  return await db.sequelize.transaction(async (transaction: Transaction) => {
    let category = await db.Category.findByPk(categoryId, {
      transaction,
    });
    if (!category) throw new NotFoundError("category not found");

    category = await category.destroy({ transaction });

    return {
      success: true,
      message: "Category deleted successfully",
    };
  });
};

export const listCategoryProducts = async (
  slug: string,
  limit: number,
  page: number
) => {
  const where: { [key: string]: any } = {};
  if (parseInt(slug) > 0) where.id = slug;
  else where.slug = slug;

  const category = await db.Category.findOne({
    where,
    attributes: ["id"],
  });

  if (!category) throw new NotFoundError("No category found with name found");

  const totalProductCount = await db.Product.count({
    where: {
      categoryId: category.id,
    },
  });

  console.log(totalProductCount);

  const { offset, pageCount } = paginate(totalProductCount, page, limit);

  let categoryProducts = await db.Product.findAll({
    where: { categoryId: category.id },
    include: [
      {
        model: db.Category,
        as: "category",
        attributes: ["name", "slug", "id"],
      },
    ],
    limit: limit,
    offset: offset,
  });

  return {
    success: true,
    message: `Product fetched successfully`,
    data: categoryProducts,
    page,
    pageCount,
  };
};

export default { list, listAll, create, update, destroy, listCategoryProducts };
