import Joi from "joi";

export default {
  create: {
    body: {
      schema: Joi.object({
        name: Joi.string().trim().max(30).required().lowercase(),
        categoryId: Joi.string(),
        imageUrl: Joi.string(),
      }),
    },
  },

  list: {
    query: {
      schema: Joi.object({
        page: Joi.number().integer().default(1),
        limit: Joi.number().integer().default(20),
        categoryId: Joi.string(),
      }),
    },
  },
  listAll: {
    query: {
      schema: Joi.object({
        page: Joi.number().integer().default(1),
        limit: Joi.number().integer().default(20),
      }),
    },
  },

  update: {
    body: {
      schema: Joi.object({
        name: Joi.string().trim().max(30).required().lowercase(),
        image_url: Joi.string(),
        categoryId: Joi.string(),
      }),
    },

    params: {
      schema: Joi.object({
        categoryId: Joi.string().required(),
      }),
    },
  },

  destroy: {
    params: {
      schema: Joi.object({
        categoryId: Joi.string().required(),
      }),
    },
  },

  listCategoryProducts: {
    params: {
      schema: Joi.object({
        slug: Joi.string().required(),
      }),
    },

    query: {
      schema: Joi.object({
        limit: Joi.number().integer().default(20),
        page: Joi.number().integer().default(1),
      }),
    },
  },
};
