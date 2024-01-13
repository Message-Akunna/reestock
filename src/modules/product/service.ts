import { Op, Transaction } from "sequelize";
import {
  slugify,
  paginate,
  deleteFile,
  fileExists,
  ExistsError,
  NotFoundError,
  successMessage,
  AuthenticationError,
} from "iyasunday";
//
import {
  ListParamsInt,
  UserAttributes,
  SearchParamsInt,
} from "../../utils/interface";
import db from "../../models";
export async function create(
  user: UserAttributes | undefined,
  body: Record<any, any>
) {
  return await db.sequelize.transaction(async (transaction: Transaction) => {
    let product = await db.Product.findOne({
      where: { name: body.name },
      attributes: ["id"],
      transaction,
    });
    if (product) throw new ExistsError("Product with this name already exist");
    product = await db.Product.create(body, {
      transaction,
      individualHooks: true,
    });

    return {
      success: true,
      message: `Product created successfully`,
      data: product,
    };
  });
}

export async function update(productId: string, body: Record<string, string>) {
  try {
    return await db.sequelize.transaction(async (transaction: Transaction) => {
      let product = await db.Product.findByPk(productId, { transaction });
      if (!product) throw new NotFoundError("Product not found");
      if (body.name && body.name != product.name) {
        body.slug = slugify(body.name, true);
      }

      if (body.imagesUrl && body.imagesUrl.length > 0) {
        const previousImages = product.imagesUrl;
        if (previousImages.length > 0) {
          for (let previousImage of previousImages) {
            const relativeUrl = previousImage.split("media/").pop();
            previousImage = process.env.STORAGE_PATH + "/" + relativeUrl;

            if (!(await fileExists(previousImage)))
              throw new NotFoundError("File not found");
            await deleteFile(previousImage);
          }
        }
      }
      product = await product.update(body, { transaction });

      return {
        success: true,
        message: "Product update successfully",
        data: product,
      };
    });
  } catch (error) {
    throw error;
  }
}

export async function remove(productId: string) {
  try {
    return await db.sequelize.transaction(async (transaction: Transaction) => {
      const product = await db.Product.findByPk(productId, { transaction });
      if (!product) throw new NotFoundError("Product not found");
      product.destroy();

      return successMessage("Product deleted successfully");
    });
  } catch (error) {
    throw error;
  }
}

export async function list(query: any) {
  try {
    const { page, limit } = query;

    const totalProductCount = await db.Product.count();

    const { offset, pageCount } = paginate(totalProductCount, page, limit);

    let productList = await db.Product.findAll({
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
      message: "Product fetched successfully",
      data: productList,
      page,
      pageCount,
    };
  } catch (error) {
    throw error;
  }
}

export async function search({
  limit,
  page,
  phrase = undefined,
  maxPrice = undefined,
  minPrice = undefined,
}: SearchParamsInt) {
  let where: { [key: string]: any } = {};

  if (phrase) where.name = { [Op.like]: `%${phrase}%` };
  if (minPrice && !maxPrice) where.sellingPrice = { [Op.gte]: minPrice };
  if (!minPrice && maxPrice) where.sellingPrice = { [Op.lte]: maxPrice };
  if (maxPrice && minPrice)
    where.sellingPrice = { [Op.between]: [minPrice, maxPrice] };

  if (!phrase && !maxPrice && !minPrice) {
    console.log(limit, page, phrase, maxPrice, minPrice);
    throw new AuthenticationError(
      "Please specify one or more search parameter"
    );
  }

  const searchProductCount = await db.Product.count({
    where,
  });

  const { offset, pageCount } = paginate(
    searchProductCount,
    Number(page),
    Number(limit)
  );

  let allProducts = await db.Product.findAll({
    where,
    limit: limit,
    offset: offset,
    include: [
      {
        model: db.Category,
        as: "category",
        attributes: ["name", "slug", "id"],
      },
    ],
  });

  return {
    success: true,
    message: "Product fetched successfully",
    data: allProducts,
    page,
    pageCount,
  };
}

export async function singleProduct(slug: string, showRelatedProducts = false) {
  const where: { [key: string]: any } = {};
  if (parseInt(slug) > 0) where.id = slug;
  else where.slug = slug;
  let product = await db.Product.findOne({
    where,
    include: [
      {
        model: db.Category,
        as: "category",
        attributes: ["name", "slug", "id"],
      },
    ],
  });
  if (!product) throw new NotFoundError("Products not found");

  return {
    success: true,
    data: product,
  };
}

export default { create, update, remove, list, search, singleProduct };
