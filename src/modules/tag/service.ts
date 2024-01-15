import {
  slugify,
  paginate,
  ExistsError,
  errorMessage,
  NotFoundError,
} from "iyasunday";
import { Op, Transaction, col, fn } from "sequelize";
//
import db from "../../models";

export const create = async (body: {
  name: string;
  slug: string;
  tagId: any;
}) => {
  return await db.sequelize.transaction(async (transaction: Transaction) => {
    let tags = await db.Tag.findOne({
      where: { name: body.name },
      attributes: ["id"],
      transaction,
    });
    if (tags) throw new ExistsError(`${body.name} already exists in tags`);
    if (body.tagId) {
      tags = await db.Tag.findByPk(body.tagId, {
        attributes: ["name"],
        transaction,
      });
      if (!tags) throw new NotFoundError("Invalid tag sent");
    }

    tags = await db.Tag.create(body, {
      transaction,
      individualHooks: true,
    });
    return {
      success: true,
      message: `${body.name} created successfully`,
      data: tags,
    };
  });
};

export const list = async ({
  limit,
  page,
  tagId = undefined,
}: {
  limit: number;
  page: number;
  tagId?: number;
}) => {
  const totalTagCount = await db.Tag.count();
  const { offset, pageCount } = paginate(totalTagCount, page, limit);

  const tags = await db.Tag.findAll({
    limit: limit,
    offset: offset,
  });

  return {
    success: true,
    tags,
    page,
    pageCount,
  };
};

export const update = async (id: string, body: Record<any, any>) => {
  return await db.sequelize.transaction(async (transaction: Transaction) => {
    let tag = await db.Tag.findByPk(id, {
      transaction,
    });
    if (!tag) throw new NotFoundError("Tag not found");
    if (Number(tag.id) === Number(body.tagId))
      throw errorMessage("Tag cannot be a parent of itself");
    body.slug = slugify(body.name, true);
    tag = await tag.update(body, {
      transaction,
      individualHooks: true,
    });

    return {
      success: true,
      message: "Tag updated successfully",
      data: tag,
    };
  });
};

export const destroy = async (tagId: string) => {
  return await db.sequelize.transaction(async (transaction: Transaction) => {
    let tag = await db.Tag.findByPk(tagId, {
      transaction,
    });
    if (!tag) throw new NotFoundError("tag not found");

    tag = await tag.destroy({ transaction });

    return {
      success: true,
      message: "Tag deleted successfully",
    };
  });
};

export const listTagProducts = async (
  slug: string,
  limit: number,
  page: number
) => {
  const where: { [key: string]: any } = {};
  if (parseInt(slug) > 0) where.id = slug;
  else where.slug = slug;

  const tag = await db.Tag.findOne({
    where,
    attributes: ["id", "name"],
  });

  if (!tag) throw new NotFoundError("No tag with that name found");

  const totalProductCount = await db.ProductTag.count({
    where: {
      tagId: tag.id,
    },
  });

  const { offset, pageCount } = paginate(totalProductCount, page, limit);

  let tagProducts = await db.Product.findAll({
    include: [
      {
        model: db.Category,
        as: "category",
        attributes: ["name", "slug", "id"],
      },
      {
        model: db.Tag,
        as: "tags",
        where: {
          name: {
            [Op.in]: [tag.name], // replace with your tags
          },
        },
        attributes: ["name", "slug", "id"],
        through: { attributes: [] },
      },
    ],
    limit: limit,
    offset: offset,
  });

  return {
    success: true,
    message: `Product fetched successfully`,
    data: tagProducts,
    page,
    pageCount,
  };
};

export default { list, create, update, destroy, listTagProducts };
